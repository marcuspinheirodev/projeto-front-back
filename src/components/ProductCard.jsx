import { Link } from 'react-router-dom'
export default function ProductCard({product}){return <Link className="product-card" to={`/product/${product.id}`}>
  <div className="product-image">{product.tag&&<span className="discount-tag">{product.tag}</span>}<img src={product.image} alt={product.name}/></div>
  <div className="product-info"><small>{product.category}</small><p>{product.name}</p><div className="prices"><del>R$ {product.price.toFixed(2).replace('.',',')}</del><strong>R$ {product.priceDiscount.toFixed(2).replace('.',',')}</strong></div></div>
</Link>}
