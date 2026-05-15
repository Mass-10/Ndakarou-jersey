import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

interface OrderItem {
    id: string
    quantity: number
    size: string
    product: {
        name: string
        club: string
        price: number
        imageUrl: string
    }
}

interface Order {
    id: string
    total: number
    status: string
    createdAt: string
    items: OrderItem[]
}

const statusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'text-amber-400 bg-amber-500/10'
        case 'confirmed':
            return 'text-emerald-400 bg-emerald-500/10'
        case 'cancelled':
            return 'text-rose-400 bg-rose-500/10'
        default:
            return 'text-slate-300 bg-slate-700/10'
    }
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        api.get('/orders/my-orders')
            .then(res => setOrders(res.data))
            .catch(() => null)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="page-shell flex items-center justify-center">
                <p className="text-slate-300">Chargement...</p>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="page-shell flex flex-col items-center justify-center gap-4">
                <p className="text-xl text-white">Aucune commande pour l'instant 👀</p>
                <button onClick={() => navigate('/products')} className="btn-primary">
                    Faire son shopping
                </button>
            </div>
        )
    }

    return (
        <div className="page-shell container">
            <h1 className="section-title mb-8">Mes commandes</h1>
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="surface overflow-hidden p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                            <div>
                                <p className="text-sm text-muted">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p className="text-xs font-mono text-slate-500">#{order.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <span className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${statusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="h-16 w-20 rounded-3xl object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white truncate">{item.product.name}</p>
                                        <p className="text-sm text-muted">Taille : {item.size} · Qté : {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-white">{(item.product.price * item.quantity).toLocaleString()} FCFA</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
