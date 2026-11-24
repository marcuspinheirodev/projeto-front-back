
import { Globe, Camera, Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">

        <div className="footer-about">
          <div className="logo footer-logo">
            <span className="logo-mark">›</span>
            Digital Store
          </div>

          <p>
            Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore.
          </p>

          <div className="socials">
            <a href="#facebook"><Globe size={17} /></a>
            <a href="#instagram"><Camera size={17} /></a>
            <a href="#twitter"><Send size={17} /></a>
          </div>
        </div>

        <div>
          <h4>Informação</h4>
          <a href="#sobre">Sobre Drip Store</a>
          <a href="#seguranca">Segurança</a>
          <a href="#wishlist">Wishlist</a>
          <a href="#blog">Blog</a>
          <a href="#trabalhe">Trabalhe conosco</a>
          <a href="/orders">Meus Pedidos</a>
        </div>

        <div>
          <h4>Categorias</h4>
          <a href="#camisetas">Camisetas</a>
          <a href="#calcas">Calças</a>
          <a href="#bones">Bonés</a>
          <a href="#headphones">Headphones</a>
          <a href="#tenis">Tênis</a>
        </div>

        <div>
          <h4>Contato</h4>
          <p>
            Av. Santos Dumont, 1510 - 1º andar -
            Aldeota, Fortaleza - CE, 60150-161
          </p>
          <p>(85) 3031-3411</p>
        </div>

      </div>

      <div className="container copyright">
        © 2026 Digital College
      </div>
    </footer>
  )
}
