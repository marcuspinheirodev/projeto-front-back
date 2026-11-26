import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { createStore } from './store.js'
import { send, readBody } from './http.js'

const users = createStore('users.json')
const secrets = createStore('secret.json', { value: randomBytes(32).toString('hex') })
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const publicUser = ({ id, name, email }) => ({ id, name, email })

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}

function checkPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  const candidate = scryptSync(password, salt, 64)
  return timingSafeEqual(candidate, Buffer.from(hash, 'hex'))
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', secrets.read().value).update(body).digest('base64url')
  return `${body}.${signature}`
}

function verify(token = '') {
  const [body, signature] = token.split('.')
  if (!body || !signature) return null
  const expected = createHmac('sha256', secrets.read().value).update(body).digest('base64url')
  if (signature.length !== expected.length) return null
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
  return payload.exp > Date.now() ? payload : null
}

function issueToken(user) {
  return sign({ sub: user.id, exp: Date.now() + TOKEN_TTL_MS })
}

function validateRegistration({ name, email, password }) {
  const errors = []
  if (typeof name !== 'string' || !name.trim()) errors.push('Nome é obrigatório')
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) errors.push('E-mail inválido')
  if (typeof password !== 'string' || password.length < 6) errors.push('A senha deve ter ao menos 6 caracteres')
  return errors
}

export async function handleAuth(req, res, action) {
  if (req.method === 'POST' && action === 'register') {
    const body = await readBody(req)
    const errors = validateRegistration(body)
    if (errors.length) return send(res, 400, { errors })

    const all = users.read()
    const email = body.email.trim().toLowerCase()
    if (all.some((u) => u.email === email)) return send(res, 409, { error: 'E-mail já cadastrado' })

    const nextId = all.reduce((max, u) => Math.max(max, u.id), 0) + 1
    const user = { id: nextId, name: body.name.trim(), email, password: hashPassword(body.password) }
    users.write([...all, user])
    return send(res, 201, { user: publicUser(user), token: issueToken(user) })
  }

  if (req.method === 'POST' && action === 'login') {
    const { email, password } = await readBody(req)
    const user = users.read().find((u) => u.email === String(email || '').trim().toLowerCase())
    if (!user || typeof password !== 'string' || !checkPassword(password, user.password)) {
      return send(res, 401, { error: 'E-mail ou senha incorretos' })
    }
    return send(res, 200, { user: publicUser(user), token: issueToken(user) })
  }

  if (req.method === 'GET' && action === 'me') {
    const token = (req.headers.authorization || '').replace(/^Bearer /, '')
    const payload = verify(token)
    const user = payload && users.read().find((u) => u.id === payload.sub)
    return user ? send(res, 200, { user: publicUser(user) }) : send(res, 401, { error: 'Não autenticado' })
  }

  return send(res, 404, { error: 'Rota não encontrada' })
}
