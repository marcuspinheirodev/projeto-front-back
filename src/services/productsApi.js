const BASE = '/api/products'

async function request(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.errors?.join(', ') || data.error || 'Erro na requisição')
  return data
}

export const listProducts = () => request(BASE)
export const createProduct = (p) => request(BASE, { method: 'POST', body: JSON.stringify(p) })
export const updateProduct = (id, p) => request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(p) })
export const deleteProduct = (id) => request(`${BASE}/${id}`, { method: 'DELETE' })
