import { Router } from 'express'
import prisma from '../lib/prisma'
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// GET tous les produits (public)
router.get('/', async (req, res) => {
    const products = await prisma.product.findMany()
    res.json(products)
})

// GET un produit (public)
router.get('/:id', async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } })
    if (!product) return res.status(404).json({ error: 'Produit introuvable' })
    res.json(product)
})

// POST créer un produit (admin only)
router.post('/', authenticate, isAdmin, async (req: AuthRequest, res) => {
    const { name, club, price, stock, imageUrl, season } = req.body
    const product = await prisma.product.create({
        data: { name, club, price, stock, imageUrl, season }
    })
    res.json(product)
})

// PUT modifier un produit (admin only)
router.put('/:id', authenticate, isAdmin, async (req: AuthRequest, res) => {
    const product = await prisma.product.update({
        where: { id: String(req.params.id) },
        data: req.body
    })
    res.json(product)
})

// DELETE (admin only)
router.delete('/:id', authenticate, isAdmin, async (req: AuthRequest, res) => {
    await prisma.product.delete({ where: { id: String(req.params.id) } })
    res.json({ message: 'Produit supprimé 🗑️' })
})

export default router