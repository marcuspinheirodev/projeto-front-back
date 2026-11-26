// API REST de produtos (CRUD) — Node puro, sem dependências.
// Uso: npm run server  (porta 3001)
import http from 'node:http'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_FILE = join(__dirname, 'db.json')
const PORT = process.env.PORT || 3001

const seed = [
  { id: 1, name: 'K-Swiss V8 - Masculino', category: 'Tênis', brand: 'K-Swiss', gender: 'Masculino', state: 'Novo', price: 200, priceDiscount: 100, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85' },
  { id: 2, name: 'Tênis Esportivo Runner', category: 'Tênis', brand: 'Adidas', gender: 'Unissex', state: 'Novo', price: 299, priceDiscount: 199, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=85' },
]

const load = () => {
  if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, JSON.stringify(seed, null, 2))
  return JSON.parse(readFileSync(DB_FILE, 'utf8'))
}
const save = (data) => writeFileSync(DB_FILE, JSON.stringify(data, null, 2))

const FIELDS = ['name', 'category', 'brand', 'gender', 'state', 'price', 'priceDiscount', 'image']

function validate(body) {
  const errors = []
  if (!body || typeof body !== 'object') return ['Corpo da requisição inválido']
  for (const f of ['name', 'category', 'brand']) {
    if (typeof body[f] !== 'string' || !body[f].trim()) errors.push(`${f} é obrigatório`)
  }
  const price = Number(body.price), disc = Number(body.priceDiscount)
  if (!Number.isFinite(price) || price < 0) errors.push('price deve ser um número >= 0')
  if (!Number.isFinite(disc) || disc < 0) errors.push('priceDiscount deve ser um número >= 0')
  if (Number.isFinite(price) && Number.isFinite(disc) && disc > price) errors.push('priceDiscount não pode ser maior que price')
  return errors
}

function sanitize(body) {
  const out = {}
  for (const f of FIELDS) if (body[f] !== undefined) out[f] = body[f]
  out.price = Number(out.price)
  out.priceDiscount = Number(out.priceDiscount)
  return out
}

const send = (res, status, data) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(data === undefined ? '' : JSON.stringify(data))
}

const readBody = (req) => new Promise((resolve, reject) => {
  let raw = ''
  req.on('data', (c) => { raw += c; if (raw.length > 1e6) req.destroy() })
  req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}) } catch { reject(new Error('JSON inválido')) } })
  req.on('error', reject)
})

http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204)
  const match = req.url.split('?')[0].match(/^\/api\/products(?:\/(\d+))?\/?$/)
  if (!match) return send(res, 404, { error: 'Rota não encontrada' })
  const id = match[1] ? Number(match[1]) : null

  try {
    const db = load()

    // READ (lista)
    if (req.method === 'GET' && id === null) return send(res, 200, db)

    // READ (um)
    if (req.method === 'GET') {
      const p = db.find((x) => x.id === id)
      return p ? send(res, 200, p) : send(res, 404, { error: 'Produto não encontrado' })
    }

    // CREATE
    if (req.method === 'POST' && id === null) {
      const body = await readBody(req)
      const errors = validate(body)
      if (errors.length) return send(res, 400, { errors })
      const product = { id: db.reduce((m, x) => Math.max(m, x.id), 0) + 1, ...sanitize(body) }
      db.push(product)
      save(db)
      return send(res, 201, product)
    }

    // UPDATE
    if (req.method === 'PUT' && id !== null) {
      const i = db.findIndex((x) => x.id === id)
      if (i < 0) return send(res, 404, { error: 'Produto não encontrado' })
      const body = await readBody(req)
      const errors = validate({ ...db[i], ...body })
      if (errors.length) return send(res, 400, { errors })
      db[i] = { ...db[i], ...sanitize({ ...db[i], ...body }), id }
      save(db)
      return send(res, 200, db[i])
    }

    // DELETE
    if (req.method === 'DELETE' && id !== null) {
      const i = db.findIndex((x) => x.id === id)
      if (i < 0) return send(res, 404, { error: 'Produto não encontrado' })
      db.splice(i, 1)
      save(db)
      return send(res, 204)
    }

    return send(res, 405, { error: 'Método não permitido' })
  } catch (e) {
    return send(res, 400, { error: e.message })
  }
}).listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}/api/products`))
