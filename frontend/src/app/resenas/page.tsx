'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Resena, ApiResponse } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ResenasPage() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    api.get<ApiResponse<Resena[]>>('/resenas')
      .then((res) => setResenas(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reseñas</h1>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : resenas.length === 0 ? (
        <p className="text-gray-500">No hay reseñas registradas.</p>
      ) : (
        <div className="space-y-4">
          {resenas.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{r.compradorNombre || r.compradorId}</span>
                  <span className="text-gray-400 text-sm ml-2">a {r.tiendaId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">{'★'.repeat(Math.round(r.valor))}</span>
                  <span className="text-sm text-gray-500">{r.calificacion}</span>
                </div>
              </div>
              <p className="text-gray-700 mt-2">{r.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
