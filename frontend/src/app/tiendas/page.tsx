'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Tienda } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MapaTiendas = dynamic(() => import('@/components/MapaTiendas'), {
  ssr: false,
});

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

    setLoading(true);

    const request =
      user.tipo_usuario === 'vendedor'
        ? api.get('/tiendas/mi-tienda')
        : api.get('/tiendas');

    request
      .then((res) => {
        const respuesta = res.data;

        const data =
          respuesta?.data?.data ??
          respuesta?.data ??
          respuesta;

        const lista = Array.isArray(data) ? data : data ? [data] : [];

        const tiendasValidas = lista.filter((t) => t && t.id);

        console.log('Tiendas recibidas:', tiendasValidas);

        setTiendas(tiendasValidas);
      })
      .catch((error) => {
        console.error('Error al obtener tiendas:', error);
        setTiendas([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  const esVendedor = user.tipo_usuario === 'vendedor';

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-900">
            {esVendedor ? 'Mi tienda' : 'Tiendas SecondGo'}
          </h1>

          <p className="mt-1 text-sm text-green-700">
            {esVendedor
              ? 'Administra tu mostrador sostenible y revisa tus productos.'
              : 'Explora tiendas cercanas, revisa sus productos y descubre moda sostenible.'}
          </p>
        </div>

        {esVendedor && (
          <Link
            href="/tiendas/crear"
            className="rounded-xl bg-green-700 px-4 py-2 text-center font-semibold text-white transition hover:bg-green-800"
          >
            + Nueva tienda
          </Link>
        )}
      </div>

      {!esVendedor && tiendas.length > 0 && <MapaTiendas tiendas={tiendas} />}

      {loading ? (
        <p className="text-sm text-green-700">Cargando tiendas...</p>
      ) : tiendas.length === 0 ? (
        <p className="text-sm text-gray-600">No hay tiendas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiendas.map((t, index) => (
            <article
              key={t.id || index}
              className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-lg"
            >
              {t.logo ? (
                <img
                  src={t.logo}
                  alt={t.nombre}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 items-center justify-center bg-green-50 text-green-800">
                  SecondGo
                </div>
              )}

              <div className="space-y-3 p-5">
                <h2 className="text-xl font-bold text-green-900">
                  {t.nombre}
                </h2>

                <p className="text-sm text-gray-600">
                  {t.descripcion}
                </p>

                <p className="text-sm text-gray-600">
                  📍 {t.ubicacion || 'Ubicación no registrada'}
                </p>

                <p className="text-sm text-gray-600">
                  🛍️ {t.cantidadProductos ?? 0} productos disponibles
                </p>

                <Link
                  href={`/tiendas/${t.id}`}
                  className="block rounded-xl bg-green-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-800"
                >
                  Ver tienda
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
