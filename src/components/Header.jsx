import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'

export default function Header({ cartCount = 0 }) {
  const [query,setQuery] = useState('')
  const [menuOpen,setMenuOpen] = useState(false)
  const navigate = useNavigate()
  function search(e){ e.preventDefault(); navigate(`/products${query.trim()?`?filter=${encodeURIComponent(query.trim())}`:''}`); setMenuOpen(false) }
  return <header className="site-header">
    <div className="header-main container">
      <button className="icon-button mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen?<X/>:<Menu/>}</button>
      <Link to="/" className="logo"><span className="logo-mark">›</span> Digital Store</Link>
      <form className="search-box" onSubmit={search}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar produto..."/><button aria-label="Pesquisar"><Search size={18}/></button></form>
      <div className="account-links"><a href="#cadastro">Cadastre-se</a><a className="login-button" href="#entrar">Entrar</a></div>
      <Link to="/cart" className="cart-link" aria-label="Carrinho"><ShoppingCart/><span>{cartCount}</span></Link>
    </div>
    <nav className={`main-nav container ${menuOpen?'open':''}`}>
      <NavLink to="/">Home</NavLink><NavLink to="/products">Produtos</NavLink><NavLink to="/categories">Categorias</NavLink><NavLink to="/orders">Meus Pedidos</NavLink>
    </nav>
  </header>
}
