import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedSize, setSelectedSize] = useState('')
    const [added, setAdded] = useState(false)

    useEffect(() => {
        if (!id) return
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .finally(() => setLoading(false))
    }, [id])

    const handleAddToCart = () => {
        if (!selectedSize) return alert('Choisis une taille frr 😂')
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        const exists = cart.find((i: any) => i.id === product!.id && i.size === selectedSize)
        if (exists) {
            exists.quantity += 1
        } else {
            cart.push({ ...product, size: selectedSize, quantity: 1 })
        }
        localStorage.setItem('cart', JSON.stringify(cart))
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    if (loading) {
        return (
            <div className="page-shell flex items-center justify-center">
                <p className="text-slate-300">Chargement...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="page-shell flex items-center justify-center">
                <p className="text-slate-300">Produit introuvable — classique. 😂</p>
            </div>
        )
    }

    return (
        <div className="page-shell container">
            <button onClick={() => navigate(-1)} className="btn-secondary mb-10">
                ← Retour
            </button>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
                <div className="surface overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-8">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">{product.club}</p>
                        <h1 className="mt-4 text-4xl font-bold text-white">{product.name}</h1>
                        <p className="mt-3 text-sm text-slate-400">Saison {product.season}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm text-muted">Prix</p>
                                <p className="mt-2 text-3xl font-bold text-white">{product.price.toLocaleString()} FCFA</p>
                            </div>
                            <p className={`rounded-full px-4 py-2 text-xs font-semibold ${product.stock > 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="section-title">Choisir une taille</p>
                        <div className="flex flex-wrap gap-3">
                            {SIZES.map(size => (
                                <button key={size} onClick={() => setSelectedSize(size)} className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${selectedSize === size ? 'border-emerald-400 bg-emerald-500/15 text-white' : 'border-slate-700 bg-slate-950 text-slate-300'}`}>
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
                        {added ? 'Ajouté au panier ✅' : 'Ajouter au panier'}
                    </button>
                </div>
            </div>
        </div>
    )
}
