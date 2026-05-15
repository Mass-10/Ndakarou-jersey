import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

const router = Router()

// REGISTER
router.post('/register', async (req, res) => {
    const { email, password } = req.body

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ error: 'Email déjà utilisé' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: { email, password: hashed }
    })

    res.json({ message: 'Compte créé ✅', userId: user.id })
})

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Mauvais password' })

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    )

    res.json({ token })
})

export default router