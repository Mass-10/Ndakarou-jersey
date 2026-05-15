import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

interface Product {
    id: string
    name: string
    club: string
    price: number
    imageUrl: string
    season: string
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data.slice(0, 3)))
    }, [])

    return (
        <div className="page-shell container">
            <section className="grid gap-20 lg:grid-cols-[1.2fr_0.8fr] items-center">
                <div className="space-y-8">
                    <p className="text-sm uppercase tracking-[0.45em] text-emerald-400">Dakar · Collection 2025/26</p>
                    <h1 className="page-title max-w-2xl">
                        WEAR<br />
                        <span className="text-emerald-400">YOUR</span><br />
                        CLUB
                    </h1>
                    <p className="max-w-xl text-slate-300 leading-8">
                        Les maillots officiels de vos clubs préférés, livrés directement à Dakar.
                        Authentique, premium et conçu pour les supporters qui veulent se démarquer.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Link to="/products" className="btn-primary">
                            Explorer le catalogue
                        </Link>
                        <Link to="/register" className="btn-secondary">
                            Créer un compte →
                        </Link>
                    </div>
                </div>

                <div className="hero-panel p-6 flex items-end justify-center min-h-[420px]">
                    {products[0] ? (
                        <div className="relative w-full max-w-[520px] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                            <img src={products[0].imageUrl} alt={products[0].name} className="h-[430px] w-full object-cover" />
                            <div className="absolute bottom-6 left-6 rounded-3xl bg-slate-950/90 border border-white/10 p-5 shadow-lg">
                                <p className="text-xs uppercase tracking-[0.35em] text-emerald-400 mb-2">{products[0].club}</p>
                                <p className="text-xl font-semibold text-white">{products[0].name}</p>
                                <p className="text-sm text-slate-400 mt-1">Saison {products[0].season}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="surface flex h-full min-h-[420px] items-center justify-center text-slate-400">
                            Chargement des nouveautés...
                        </div>
                    )}
                </div>
            </section>

            <section className="mt-20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="section-title">Nouveautés</p>
                        <p className="text-sm text-muted">Maillots populaires sélectionnés pour toi.</p>
                    </div>
                    <Link to="/products" className="text-sm text-emerald-400 hover:text-emerald-300 transition">
                        Voir tout
                    </Link>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map(product => (
                        <Link to={`/products/${product.id}`} key={product.id} className="card surface overflow-hidden group">
                            <div className="relative overflow-hidden">
                                <img src={product.imageUrl} alt={product.name} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
                            </div>
                            <div className="p-5">
                                <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">{product.club}</p>
                                <h2 className="mt-3 text-xl font-semibold text-white">{product.name}</h2>
                                <p className="mt-2 text-sm text-slate-400">Saison {product.season}</p>
                                <div className="mt-5 flex items-center justify-between">
                                    <span className="text-lg font-bold text-white">{product.price.toLocaleString()} FCFA</span>
                                    <span className="btn-secondary">Voir</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}
