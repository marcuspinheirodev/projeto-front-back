import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { listProducts, createProduct, updateProduct, deleteProduct } from '../services/productsApi'

const empty = { name: '', category: 'Tênis', brand: '', gender: 'Unissex', state: 'Novo', price: '', priceDiscount: '', image: '' }

export default function ProductsCrud() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const load = () => listProducts().then(setItems).catch(e => setError(e.message))
  useEffect(() => { load() }, [])

  const change = e => setForm({ ...form, [e.target.name]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      editingId ? await updateProduct(editingId, form) : await createProduct(form)
      setForm(empty); setEditingId(null); load()
    } catch (err) { setError(err.message) }
  }

  function edit(p) { setEditingId(p.id); setForm({ ...empty, ...p }); window.scrollTo(0, 0) }
  function cancel() { setEditingId(null); setForm(empty); setError('') }

  async function remove(p) {
    if (!confirm(`Excluir "${p.name}"?`)) return
    try { await deleteProduct(p.id); load() } catch (err) { setError(err.message) }
  }

  return <Layout><div className="container crud-page">
    <h1>Gerenciar produtos</h1>
    <form className="crud-form" onSubmit={submit}>
      <h3>{editingId ? `Editar produto #${editingId}` : 'Novo produto'}</h3>
      <input name="name" placeholder="Nome" value={form.name} onChange={change} required />
      <input name="brand" placeholder="Marca" value={form.brand} onChange={change} required />
      <input name="category" placeholder="Categoria" value={form.category} onChange={change} required />
      <select name="gender" value={form.gender} onChange={change}><option>Masculino</option><option>Feminino</option><option>Unissex</option></select>
      <select name="state" value={form.state} onChange={change}><option>Novo</option><option>Usado</option></select>
      <input name="price" type="number" min="0" step="0.01" placeholder="Preço" value={form.price} onChange={change} required />
      <input name="priceDiscount" type="number" min="0" step="0.01" placeholder="Preço com desconto" value={form.priceDiscount} onChange={change} required />
      <input name="image" placeholder="URL da imagem" value={form.image} onChange={change} />
      {error && <p className="crud-error">{error}</p>}
      <div className="crud-actions"><button className="primary-button" type="submit">{editingId ? 'Salvar' : 'Cadastrar'}</button>{editingId && <button type="button" onClick={cancel}>Cancelar</button>}</div>
    </form>
    <table className="crud-table">
      <thead><tr><th>ID</th><th>Nome</th><th>Marca</th><th>Preço</th><th>Desconto</th><th>Ações</th></tr></thead>
      <tbody>
        {items.map(p => <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.brand}</td><td>R$ {Number(p.price).toFixed(2)}</td><td>R$ {Number(p.priceDiscount).toFixed(2)}</td>
          <td><button onClick={() => edit(p)}>Editar</button> <button onClick={() => remove(p)}>Excluir</button></td></tr>)}
        {!items.length && <tr><td colSpan="6">Nenhum produto cadastrado.</td></tr>}
      </tbody>
    </table>
  </div></Layout>
}
