import Header from './Header'
import Footer from './Footer'
export default function Layout({children,cartCount}){return <><Header cartCount={cartCount}/><main>{children}</main><Footer/></>}
