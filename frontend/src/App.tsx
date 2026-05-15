import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Products from './pages/Products'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Home from './pages/Home'
import AdminRoute from './components/ProtectedRoute'
import AdminProducts from './pages/AdminProducts'

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/admin/products" element={
                    <AdminRoute>
                        <AdminProducts />
                    </AdminRoute>
                } />
                <Route path="/*" element={
                    <>
                        <Navbar />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </>
                } />
            </Routes>
        </>
    )
}


