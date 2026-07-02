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
    if (!user) {
      router.push('/login');
      return;
    }

    const request = user.tipo_usuario === 'vendedor'
      ? api.get<ApiResponse<Tienda>>('/tiendas/mi-tienda')
      : api.get<ApiResponse<Tienda[]>>('/tiendas');

    request
      .then((res) => {
        const data = res.data.data;
        setTiendas(Array.isArray(data) ? data : [data]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  const esVendedor = user.tipo_usuario === 'vendedor';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{esVendedor ? 'Mi Tienda' : 'Tiendas'}</h1>
        {esVendedor && (
          <Link
            href="/tiendas/crear"
            className="bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            + Nueva Tienda
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : tiendas.length === 0 ? (
        <p className="text-gray-500">No hay tiendas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiendas.map((t) => (
            <div key={t.id} className="overflow-hidden bg-white shadow-md">
              {t.logo && (
                <img
                  src={t.logo}
                  alt={t.nombre}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold">{t.nombre}</h2>
                <p className="mt-1 text-sm text-gray-500">{t.descripcion}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-0.5">
                    {t.cantidadProductos ?? 0} productos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
