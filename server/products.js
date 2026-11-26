import { createStore } from './store.js'
import { send, readBody } from './http.js'

const store = createStore('db.json', [
  { id: 1, name: 'K-Swiss V8 - Masculino', category: 'Tênis', brand: 'K-Swiss', gender: 'Masculino', state: 'Novo', price: 200, priceDiscount: 100, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85' },
  { id: 2, name: 'Tênis Esportivo Runner', category: 'Tênis', brand: 'Adidas', gender: 'Unissex', state: 'Novo', price: 299, priceDiscount: 199, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=85' },
])

const FIELDS = ['name', 'category', 'brand', 'gender', 'state', 'price', 'priceDiscount', 'image']

function validate(body) {
  const errors = []
  for (const field of ['name', 'category', 'brand']) {
    if (typeof body[field] !== 'string' || !body[field].trim()) errors.push(`${field} é obrigatório`)
  }
  const price = Number(body.price)
  const discount = Number(body.priceDiscount)
  if (!Number.isFinite(price) || price < 0) errors.push('price deve ser um número >= 0')
  if (!Number.isFinite(discount) || discount < 0) errors.push('priceDiscount deve ser um número >= 0')
  if (Number.isFinite(price) && Number.isFinite(discount) && discount > price) {
    errors.push('priceDiscount não pode ser maior que price')
  }
  return errors
}

function pick(body) {
  const product = {}
  for (const field of FIELDS) if (body[field] !== undefined) product[field] = body[field]
  product.price = Number(product.price)
  product.priceDiscount = Number(product.priceDiscount)
  return product
}

export async function handleProducts(req, res, id) {
  const products = store.read()

  if (req.method === 'GET' && id === null) return send(res, 200, products)

  if (req.method === 'GET') {
    const product = products.find((p) => p.id === id)
    return product ? send(res, 200, product) : send(res, 404, { error: 'Produto não encontrado' })
  }

  if (req.method === 'POST' && id === null) {
    const body = await readBody(req)
    const errors = validate(body)
    if (errors.length) return send(res, 400, { errors })
    const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1
    const product = { id: nextId, ...pick(body) }
    store.write([...products, product])
    return send(res, 201, product)
  }

  if (req.method === 'PUT' && id !== null) {
    const index = products.findIndex((p) => p.id === id)
    if (index < 0) return send(res, 404, { error: 'Produto não encontrado' })
    const merged = { ...products[index], ...(await readBody(req)) }
    const errors = validate(merged)
    if (errors.length) return send(res, 400, { errors })
    products[index] = { ...pick(merged), id }
    store.write(products)
    return send(res, 200, products[index])
  }

  if (req.method === 'DELETE' && id !== null) {
    if (!products.some((p) => p.id === id)) return send(res, 404, { error: 'Produto não encontrado' })
    store.write(products.filter((p) => p.id !== id))
    return send(res, 204)
  }

  return send(res, 405, { error: 'Método não permitido' })
}
