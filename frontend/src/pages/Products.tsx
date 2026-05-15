import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

interface Product {
    id: string
    name: string
    club: string
    price: number
    stock: number
    imageUrl: string
    season: string
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="page-shell flex items-center justify-center">
                <p className="text-slate-300">Chargement...</p>
            </div>
        )
    }

    return (
        <div className="page-shell container">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="section-title">Catalogue</h1>
                    <p className="text-sm text-muted">{products.length} maillots disponibles</p>
                </div>
                <Link to="/" className="btn-secondary">
                    Retour à l’accueil
                </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map(product => (
                    <Link to={`/products/${product.id}`} key={product.id} className="card surface overflow-hidden group">
                        <div className="relative overflow-hidden">
                            <img src={product.imageUrl} alt={product.name} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <div className="p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">{product.club}</p>
                            <h2 className="mt-3 text-lg font-semibold text-white">{product.name}</h2>
                            <p className="mt-2 text-sm text-slate-400">{product.season}</p>
                            <div className="mt-5 flex items-center justify-between gap-3">
                                <span className="text-base font-bold text-white">{product.price.toLocaleString()} FCFA</span>
                                <span className="btn-secondary">Voir</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
