import { Router } from 'express'
import prisma from '../lib/prisma'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// Créer une commande
router.post('/', authenticate, async (req: AuthRequest, res) => {
    const { items } = req.body
    // items = [{ productId, quantity, size }]

    let total = 0
    for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } })
        if (!product) return res.status(404).json({ error: 'Produit introuvable' })
        total += product.price * item.quantity
    }

    const order = await prisma.order.create({
        data: {
            userId: req.user!.userId,
            total,
            items: {
                create: items.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    size: item.size
                }))
            }
        },
        include: { items: true }
    })

    res.json(order)
})

// Historique commandes du user connecté
router.get('/my-orders', authenticate, async (req: AuthRequest, res) => {
    const orders = await prisma.order.findMany({
        where: { userId: req.user!.userId },
        include: { items: { include: { product: true } } }
    })
    res.json(orders)
})

export default router