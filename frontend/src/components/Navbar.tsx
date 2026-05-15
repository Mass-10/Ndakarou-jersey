import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode'

export default function Navbar() {
    const { isAuthenticated, logout, token } = useAuth()
    const isAdmin = token ? jwtDecode<{ role: string }>(token).role === 'admin' : false
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
        setMenuOpen(false)
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
            <div className="container flex items-center justify-between gap-4 px-6 py-4">
                <Link to="/" className="text-xl font-bold tracking-tight text-emerald-400">
                    Ndakarou Jersey
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link to="/products" className="text-sm text-slate-300 hover:text-white transition">
                        Catalogue
                    </Link>
                    <Link to="/cart" className="text-sm text-slate-300 hover:text-white transition">
                        Panier 🛒
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/orders" className="text-sm text-slate-300 hover:text-white transition">
                                Mes commandes
                            </Link>
                            {isAdmin && (
                                <Link to="/admin/products" className="text-sm text-emerald-400 hover:text-emerald-300 transition">
                                    Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="btn-secondary text-slate-200">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-primary">
                            Se connecter
                        </Link>
                    )}
                </div>

                <button className="md:hidden flex flex-col gap-1.5 p-2 text-slate-100" onClick={() => setMenuOpen(!menuOpen)}>
                    <span className={`block w-6 h-0.5 rounded-full bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                    <span className={`block w-6 h-0.5 rounded-full bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 rounded-full bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden flex flex-col gap-4 px-6 pb-6 pt-2 border-t border-white/10 bg-slate-950/95">
                    <Link to="/products" onClick={() => setMenuOpen(false)} className="text-sm text-slate-300 hover:text-white transition">
                        Catalogue
                    </Link>
                    <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-sm text-slate-300 hover:text-white transition">
                        Panier 🛒
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-sm text-slate-300 hover:text-white transition">
                                Mes commandes
                            </Link>
                            <button onClick={handleLogout} className="btn-secondary w-full text-left text-slate-200">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-center">
                            Se connecter
                        </Link>
                    )}
                </div>
            )}
        </nav>
    )
}
