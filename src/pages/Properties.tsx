import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'

interface Property {
  id: string
  title: string
  description: string
  price: number
  type: string
  status: string
  address: string
  city: string
  state: string
  bedrooms: number
  bathrooms: number
  area: number
  photos: string[]
  owner: {
    id: string
    name: string
    email: string
    phone: string
  }
}

export default function Properties() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/properties')
      .then(({ data }) => setProperties(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [])

  const typeLabel: Record<string, string> = {
    HOUSE: 'Casa',
    APARTMENT: 'Apartamento',
    LAND: 'Terreno',
    COMMERCIAL: 'Comercial',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando imóveis...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Imóveis disponíveis</h1>
        <button
          className="text-sm text-gray-500 underline"
          onClick={() => { localStorage.removeItem('token'); navigate('/') }}
        >
          Sair
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {properties.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Nenhum imóvel disponível no momento.</p>
        )}

        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:border-gray-300 transition-colors"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {typeLabel[property.type] || property.type}
                </span>
                <h2 className="text-base font-semibold text-gray-900 mt-0.5">{property.title}</h2>
              </div>
              <span className="text-base font-semibold text-gray-900">
                {property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-3">{property.address}, {property.city} — {property.state}</p>

            <div className="flex gap-4 text-sm text-gray-600">
              {property.bedrooms && <span>{property.bedrooms} quartos</span>}
              {property.bathrooms && <span>{property.bathrooms} banheiros</span>}
              {property.area && <span>{property.area} m²</span>}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
              Anunciado por {property.owner.name}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}