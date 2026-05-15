import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirm) {
            setError('Les passwords matchent pas frr 😂')
            return
        }
        setLoading(true)
        setError('')
        try {
            await api.post('/auth/register', { email, password })
            navigate('/login')
        } catch {
            setError('Email déjà utilisé — try another one.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-shell flex items-center justify-center">
            <div className="surface w-full max-w-md p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white">Créer un compte</h1>
                    <p className="text-sm text-muted mt-2">Bienvenue sur <span className="text-emerald-400">Ndakarou Jersey</span></p>
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
                    <div>
                        <label className="mb-2 block text-sm text-muted">Confirmer le password</label>
                        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required className="input-field" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Création...' : "S'inscrire"}
                    </button>
                </form>

                <p className="text-sm text-muted text-center mt-6">
                    Déjà un compte ? <Link to="/login" className="text-emerald-400 hover:text-emerald-300">Se connecter</Link>
                </p>
            </div>
        </div>
    )
}
