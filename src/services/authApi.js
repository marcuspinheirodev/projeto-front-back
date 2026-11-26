async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.errors?.join(', ') || data.error || 'Erro na requisição')
  return data
}

export const registerUser = (data) => post('/api/auth/register', data)
export const loginUser = (data) => post('/api/auth/login', data)

export async function fetchCurrentUser(token) {
  const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) return null
  return (await res.json()).user
}
