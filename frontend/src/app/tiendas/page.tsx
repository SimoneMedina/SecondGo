'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Tienda, ApiResponse } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function TiendasPage() {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    api.get<ApiResponse<Tienda[]>>('/tiendas')
      .then((res) => setTiendas(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tiendas</h1>
        <Link
          href="/tiendas/crear"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Nueva Tienda
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : tiendas.length === 0 ? (
        <p className="text-gray-500">No hay tiendas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiendas.map((t) => (
            <div key={t.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {t.logo && (
                <img
                  src={`data:image/jpeg;base64,${t.logo}`}
                  alt={t.nombre}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg">{t.nombre}</h2>
                <p className="text-gray-500 text-sm mt-1">{t.descripcion}</p>
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">
                    {t.cantidadProductos ?? 0} productos
                  </span>
                  {t.ruc && <span>RUC: {t.ruc}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
