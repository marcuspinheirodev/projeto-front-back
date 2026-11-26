import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export default function Auth({ mode }) {
  const isRegister = mode === 'register'
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await (isRegister ? register(form) : login(form))
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="container auth-page">
        <form className="auth-form" onSubmit={submit}>
          <h1>{isRegister ? 'Criar conta' : 'Entrar'}</h1>
          {isRegister && (
            <input name="name" placeholder="Nome" value={form.name} onChange={change} required />
          )}
          <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={change} required />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            minLength={isRegister ? 6 : undefined}
            value={form.password}
            onChange={change}
            required
          />
          {error && <p className="crud-error">{error}</p>}
          <button className="primary-button" type="submit" disabled={loading}>
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </button>
          <p className="auth-switch">
            {isRegister ? (
              <>Já tem conta? <Link to="/login">Entrar</Link></>
            ) : (
              <>Não tem conta? <Link to="/register">Cadastre-se</Link></>
            )}
          </p>
        </form>
      </div>
    </Layout>
  )
}
