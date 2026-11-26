import http from 'node:http'
import { send } from './http.js'
import { handleProducts } from './products.js'
import { handleAuth } from './auth.js'

const PORT = process.env.PORT || 3001
const PRODUCTS_ROUTE = /^\/api\/products(?:\/(\d+))?\/?$/
const AUTH_ROUTE = /^\/api\/auth\/(register|login|me)\/?$/

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204)

  const path = req.url.split('?')[0]
  const products = path.match(PRODUCTS_ROUTE)
  const auth = path.match(AUTH_ROUTE)

  try {
    if (products) return await handleProducts(req, res, products[1] ? Number(products[1]) : null)
    if (auth) return await handleAuth(req, res, auth[1])
    return send(res, 404, { error: 'Rota não encontrada' })
  } catch (error) {
    return send(res, 400, { error: error.message })
  }
})

server.listen(PORT, () => console.log(`API em http://localhost:${PORT}`))
