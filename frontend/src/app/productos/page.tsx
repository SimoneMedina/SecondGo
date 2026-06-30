'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Producto, ApiResponse, ProductoListResponse } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    api.get<ApiResponse<ProductoListResponse>>('/productos')
      .then((res) => setProductos(res.data.data.productos))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          href="/productos/crear"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Nuevo Producto
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : productos.length === 0 ? (
        <p className="text-gray-500">No hay productos registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {p.foto && (
                <img
                  src={`data:image/jpeg;base64,${p.foto}`}
                  alt={p.nombre}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg">{p.nombre}</h2>
                <p className="text-gray-500 text-sm mt-1">{p.descripcion}</p>
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{p.estado}</span>
                  <span>{p.color}</span>
                  <span>{p.dimensiones}</span>
                </div>
                {p.tiendaNombre && (
                  <p className="text-xs text-gray-400 mt-2">Tienda: {p.tiendaNombre}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
