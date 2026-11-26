import { createContext, useContext, useEffect, useState } from 'react'
import { fetchCurrentUser, loginUser, registerUser } from '../services/authApi'

const TOKEN_KEY = 'token'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return
    fetchCurrentUser(token)
      .then((current) => (current ? setUser(current) : localStorage.removeItem(TOKEN_KEY)))
      .catch(() => {})
  }, [])

  async function authenticate(request, data) {
    const { user: loggedUser, token } = await request(data)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(loggedUser)
  }

  const login = (data) => authenticate(loginUser, data)
  const register = (data) => authenticate(registerUser, data)

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
