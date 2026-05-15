import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

interface CartItem {
    id: string
    name: string
    club: string
    price: number
    imageUrl: string
    size: string
    quantity: number
}

export default function Cart() {
    const [items, setItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(false)
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setItems(cart)
    }, [])

    const updateQuantity = (id: string, size: string, delta: number) => {
        const updated = items.map(item => {
            if (item.id === id && item.size === size) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) }
            }
            return item
        })
        setItems(updated)
        localStorage.setItem('cart', JSON.stringify(updated))
    }

    const removeItem = (id: string, size: string) => {
        const updated = items.filter(i => !(i.id === id && i.size === size))
        setItems(updated)
        localStorage.setItem('cart', JSON.stringify(updated))
    }

    const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

    const handleCheckout = async () => {
        if (!isAuthenticated) return navigate('/login')
        setLoading(true)
        try {
            await api.post('/orders', {
                items: items.map(i => ({ productId: i.id, quantity: i.quantity, size: i.size }))
            })
            localStorage.removeItem('cart')
            setItems([])
            alert('Commande passée avec succès ! 🎉')
            navigate('/orders')
        } catch {
            alert('Erreur lors de la commande — réessaie.')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="page-shell flex flex-col items-center justify-center gap-4">
                <p className="text-xl text-white">Ton panier est vide 😂</p>
                <button onClick={() => navigate('/products')} className="btn-primary">
                    Voir le catalogue
                </button>
            </div>
        )
    }

    return (
        <div className="page-shell container">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="section-title">Mon panier</h1>
                    <p className="text-sm text-muted">Revois tes articles avant de finaliser la commande.</p>
                </div>
                <div className="text-base font-semibold text-white">Total : {total.toLocaleString()} FCFA</div>
            </div>

            <div className="space-y-4">
                {items.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 sm:flex-row sm:items-center">
                        <img src={item.imageUrl} alt={item.name} className="h-28 w-24 rounded-3xl object-cover" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">{item.club}</p>
                            <p className="text-lg font-semibold text-white truncate">{item.name}</p>
                            <p className="text-sm text-muted mt-2">Taille : {item.size}</p>
                            <div className="mt-4 flex items-center gap-3">
                                <button onClick={() => updateQuantity(item.id, item.size, -1)} className="btn-secondary w-10">
                                    −
                                </button>
                                <span className="text-sm text-white">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.size, 1)} className="btn-secondary w-10">
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <button onClick={() => removeItem(item.id, item.size)} className="text-sm text-rose-300 hover:text-rose-200">
                                Supprimer
                            </button>
                            <p className="text-base font-bold text-white">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-muted">Total de la commande</span>
                    <span className="text-2xl font-bold text-white">{total.toLocaleString()} FCFA</span>
                </div>
                <button onClick={handleCheckout} disabled={loading} className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? 'Processing...' : 'Passer la commande'}
                </button>
            </div>
        </div>
    )
}
