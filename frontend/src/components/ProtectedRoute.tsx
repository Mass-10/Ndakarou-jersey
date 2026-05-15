import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode'

interface TokenPayload {
    userId: string
    role: string
}

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const { token } = useAuth()
    if (!token) return <Navigate to="/login" />

    const decoded = jwtDecode<TokenPayload>(token)
    if (decoded.role !== 'admin') return <Navigate to="/" />

    return <>{children}</>
}