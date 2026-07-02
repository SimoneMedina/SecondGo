'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Producto, ApiResponse, ProductoListResponse } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const tallaLabels: Record<string, string> = {
  XXS: 'XXS - 30',
  XS: 'XS / PP - 32 a 34',
  S: 'S / P - 36 a 38',
  M: 'M - 40',
  L: 'L / G - 42',
  XL: 'XL / GG - 44',
  XXL: 'XXL / 2XL - 46',
  XXXL: 'XXXL / 3XL - 48',
};

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [fotoActual, setFotoActual] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const endpoint = user.tipo_usuario === 'vendedor' ? `/productos/tienda/${user.id}` : '/productos';
    api.get<ApiResponse<ProductoListResponse>>(endpoint)
      .then((res) => setProductos(res.data.data.productos))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  const esVendedor = user.tipo_usuario === 'vendedor';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{esVendedor ? 'Mis Productos' : 'Catalogo de Productos'}</h1>
        {esVendedor && (
          <Link
            href="/productos/crear"
            className="bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            + Nuevo Producto
          </Link>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : productos.length === 0 ? (
        <p className="text-gray-500">No hay productos registrados.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {productos.map((p) => {
            const fotos = p.fotos ?? [];
            const indice = fotoActual[p.id] ?? 0;
            const foto = fotos[indice] ?? fotos[0];

            return (
              <div key={p.id} className="overflow-hidden bg-white shadow-md">
                <div className="relative h-48 bg-gray-100">
                  {foto ? (
                    <img src={foto} alt={p.nombre} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">Sin fotos</div>
                  )}
                  {fotos.length > 1 && (
                    <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                      {fotos.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`Foto ${i + 1}`}
                          onClick={() => setFotoActual((actual) => ({ ...actual, [p.id]: i }))}
                          className={`h-2.5 w-2.5 rounded-full ${i === indice ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{p.nombre}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{p.descripcion}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span className="bg-gray-100 px-2 py-0.5">{p.estado}</span>
                    <span>{p.color}</span>
                    {p.talla && <span>{tallaLabels[p.talla] ?? p.talla}</span>}
                  </div>
                  {p.tiendaNombre && (
                    <p className="mt-2 text-xs text-gray-400">Tienda: {p.tiendaNombre}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
