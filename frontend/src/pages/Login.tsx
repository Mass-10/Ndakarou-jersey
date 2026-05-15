import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await api.post('/auth/login', { email, password })
            login(res.data.token)
            navigate('/')
        } catch {
            setError('Email ou password incorrect — réessaie.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-shell flex items-center justify-center">
            <div className="surface w-full max-w-md p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white">Connexion</h1>
                    <p className="text-sm text-muted mt-2">Content de te revoir sur <span className="text-emerald-400">Ndakarou Jersey</span></p>
                </div>
                {error && (
                    <div className="mb-4 rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-300">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm text-muted">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ton@email.com" required className="input-field" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm text-muted">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="input-field" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
                <p className="text-sm text-muted text-center mt-6">
                    Pas encore de compte ? <Link to="/register" className="text-emerald-400 hover:text-emerald-300">Créer un compte</Link>
                </p>
            </div>
        </div>
    )
}
