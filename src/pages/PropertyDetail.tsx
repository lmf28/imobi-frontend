import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import api from '@/services/api'

interface Property {
  id: string
  title: string
  description: string
  price: number
  type: string
  address: string
  city: string
  state: string
  zipCode: string
  bedrooms: number
  bathrooms: number
  area: number
  photos: string[]
  owner: {
    id: string
    name: string
    email: string
    phone: string
    creci: string
  }
}

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(({ data }) => setProperty(data))
      .catch(() => navigate('/properties'))
      .finally(() => setLoading(false))
  }, [id])

  const handleRequestVisit = async () => {
    if (!property) return
    setRequesting(true)
    try {
      const brokerId = localStorage.getItem('userId') || property.owner.id
      const { data } = await api.post('/leads/whatsapp', {
        propertyId: property.id,
        brokerId,
      })
      window.open(data.whatsappUrl, '_blank')
    } catch {
      alert('Erro ao solicitar visita. Tente novamente.')
    } finally {
      setRequesting(false)
    }
  }

  const typeLabel: Record<string, string> = {
    HOUSE: 'Casa',
    APARTMENT: 'Apartamento',
    LAND: 'Terreno',
    COMMERCIAL: 'Comercial',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (!property) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button
          className="text-gray-500 text-sm underline"
          onClick={() => navigate('/properties')}
        >
          Voltar
        </button>
        <h1 className="text-base font-semibold text-gray-900">Detalhe do imóvel</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {typeLabel[property.type] || property.type}
          </span>
          <h2 className="text-xl font-semibold text-gray-900 mt-1 mb-1">{property.title}</h2>
          <p className="text-2xl font-bold text-gray-900 mb-4">
            {property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>

          {property.description && (
            <p className="text-sm text-gray-600 mb-4">{property.description}</p>
          )}

          <div className="grid grid-cols-3 gap-3 mb-4">
            {property.bedrooms && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-semibold text-gray-900">{property.bedrooms}</p>
                <p className="text-xs text-gray-500">Quartos</p>
              </div>
            )}
            {property.bathrooms && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-semibold text-gray-900">{property.bathrooms}</p>
                <p className="text-xs text-gray-500">Banheiros</p>
              </div>
            )}
            {property.area && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-semibold text-gray-900">{property.area}</p>
                <p className="text-xs text-gray-500">m²</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-50 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Localização</p>
            <p className="text-sm text-gray-500">{property.address}, {property.city} — {property.state}</p>
            <p className="text-sm text-gray-400">{property.zipCode}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Corretor responsável</p>
          <p className="text-base font-semibold text-gray-900">{property.owner.name}</p>
          {property.owner.creci && (
            <p className="text-xs text-gray-400 mb-1">CRECI: {property.owner.creci}</p>
          )}
          <p className="text-sm text-gray-500">{property.owner.email}</p>
        </div>

        <div className="pb-6">
          <Button
            className="w-full h-12 text-base"
            onClick={handleRequestVisit}
            disabled={requesting}
          >
            {requesting ? 'Abrindo WhatsApp...' : 'Solicitar visita via WhatsApp'}
          </Button>
        </div>
      </main>
    </div>
  )
}