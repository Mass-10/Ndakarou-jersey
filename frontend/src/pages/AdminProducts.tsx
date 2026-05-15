import { useEffect, useState } from 'react'
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

const empty = { name: '', club: '', price: 0, stock: 0, imageUrl: '', season: '' }
const CLOUD_NAME = 'dxmvuzb2i'
const UPLOAD_PRESET = 'jersey_uploads'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchProducts = () => {
    api.get('/products').then(res => setProducts(res.data))
  }

  useEffect(() => { fetchProducts() }, [])

  const uploadImage = async (file: File): Promise<string> => {
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', UPLOAD_PRESET)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data
    })
    const json = await res.json()
    return json.secure_url
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm(prev => ({ ...prev, imageUrl: url }))
    } catch {
      alert('Erreur upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editId) {
        await api.put(`/products/${editId}`, form)
      } else {
        await api.post('/products', form)
      }
      setForm(empty)
      setEditId(null)
      setShowForm(false)
      fetchProducts()
    } catch {
      alert('Erreur — vérifie les champs.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      club: product.club,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      season: product.season
    })
    setEditId(product.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    await api.delete(`/products/${id}`)
    fetchProducts()
  }

  const handleCancel = () => {
    setForm(empty)
    setEditId(null)
    setShowForm(false)
  }

  return (
    <div className="page-shell container">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="section-title">Admin — Produits</h1>
          <p className="text-sm text-muted">{products.length} produits dans le catalogue</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Ajouter un produit
          </button>
        )}
      </div>

      {showForm && (
        <div className="surface p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6">
            {editId ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>

          {/* ✅ bouton submit DANS le form */}
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Nom', key: 'name' as const, type: 'text', placeholder: 'Maillot PSG Home 2024' },
              { label: 'Club', key: 'club' as const, type: 'text', placeholder: 'PSG' },
              { label: 'Prix (FCFA)', key: 'price' as const, type: 'number', placeholder: '25000' },
              { label: 'Stock', key: 'stock' as const, type: 'number', placeholder: '10' },
              { label: 'Saison', key: 'season' as const, type: 'text', placeholder: '2024/25' },
            ].map(field => (
              <div key={field.key}>
                <label className="mb-2 block text-sm text-muted">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: field.type === 'number' ? +e.target.value : e.target.value })}
                  required
                  className="input-field"
                />
              </div>
            ))}

            {/* Upload image */}
            <div>
              <label className="mb-2 block text-sm text-muted">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="input-field"
              />
              {uploading && <p className="text-xs mt-1" style={{ color: '#16a34a' }}>Upload en cours... ⏳</p>}
              {form.imageUrl && !uploading && <p className="text-xs mt-1" style={{ color: '#16a34a' }}>✅ Image uploadée</p>}
            </div>

            {/* Preview */}
            {form.imageUrl && (
              <div className="sm:col-span-2">
                <p className="text-sm text-muted mb-2">Aperçu</p>
                <img src={form.imageUrl} alt="preview"
                  className="h-28 w-24 rounded-3xl object-cover border border-white/10" />
              </div>
            )}

            {/* Boutons DANS le form */}
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <button type="submit" disabled={loading || uploading} className="btn-primary">
                {loading ? 'Sauvegarde...' : editId ? 'Modifier' : 'Ajouter'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <img src={product.imageUrl} alt={product.name}
              className="h-24 w-24 rounded-3xl object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">{product.club}</p>
              <p className="text-lg font-semibold text-white truncate">{product.name}</p>
              <p className="text-sm text-muted mt-1">{product.season} · {product.stock} en stock</p>
            </div>
            <p className="text-base font-bold text-white">{product.price.toLocaleString()} FCFA</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleEdit(product)} className="btn-secondary text-sm">
                Modifier
              </button>
              <button onClick={() => handleDelete(product.id)} className="text-sm text-rose-300 hover:text-rose-200">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}