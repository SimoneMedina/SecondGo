'use client';

import { useState, FormEvent } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function CrearTiendaPage() {
  const [form, setForm] = useState({
    nombre_local: '',
    descripcion_tienda: '',
    ubicacion_tienda: 0,
    ruc_local: '',
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const body: any = { ...form };
      if (logo) {
        const buffer = await logo.arrayBuffer();
        body.logo_local = Array.from(new Uint8Array(buffer));
      }
      await api.post('/tiendas', body);
      router.push('/tiendas');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear tienda');
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nueva Tienda</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre del Local</label>
          <input type="text" value={form.nombre_local} onChange={(e) => setForm({ ...form, nombre_local: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea value={form.descripcion_tienda} onChange={(e) => setForm({ ...form, descripcion_tienda: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ubicación</label>
          <input type="number" step="0.01" value={form.ubicacion_tienda} onChange={(e) => setForm({ ...form, ubicacion_tienda: parseFloat(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">RUC</label>
          <input type="text" value={form.ruc_local} onChange={(e) => setForm({ ...form, ruc_local: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" maxLength={13} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Logo</label>
          <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="w-full" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
          Crear Tienda
        </button>
      </form>
    </div>
  );
}
