'use client';

import { useState, FormEvent, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

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
    if (!loading && user?.tipo_usuario !== 'vendedor') router.push('/tiendas');
  }, [user, loading, router]);

  const preview = useMemo(() => (logo ? URL.createObjectURL(logo) : ''), [logo]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  if (loading || !user || user.tipo_usuario !== 'vendedor') return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const body = new FormData();
      body.append('nombre_local', form.nombre_local);
      body.append('descripcion_tienda', form.descripcion_tienda);
      body.append('ubicacion_tienda', String(form.ubicacion_tienda));
      if (form.ruc_local) body.append('ruc_local', form.ruc_local);
      if (logo) body.append('logo', logo);

      await api.post('/tiendas', body);
      router.push('/tiendas');
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(message || 'Error al crear tienda');
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Nueva Tienda</h1>

      {error && (
        <div className="mb-4 border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md">
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre del Local</label>
          <input type="text" value={form.nombre_local} onChange={(e) => setForm({ ...form, nombre_local: e.target.value })}
            className="w-full border px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Descripcion</label>
          <textarea value={form.descripcion_tienda} onChange={(e) => setForm({ ...form, descripcion_tienda: e.target.value })}
            className="w-full border px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Ubicacion</label>
          <input type="number" step="0.01" value={form.ubicacion_tienda} onChange={(e) => setForm({ ...form, ubicacion_tienda: parseFloat(e.target.value) })}
            className="w-full border px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">RUC</label>
          <input type="text" value={form.ruc_local} onChange={(e) => setForm({ ...form, ruc_local: e.target.value })}
            className="w-full border px-3 py-2 focus:ring-2 focus:ring-indigo-500" maxLength={13} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Logo</label>
          <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="w-full" />
          {preview && <img src={preview} alt="Vista previa del logo" className="mt-3 h-40 w-full object-cover" />}
        </div>
        <button type="submit" className="w-full bg-indigo-600 py-2 text-white hover:bg-indigo-700">
          Crear Tienda
        </button>
      </form>
    </div>
  );
}
