'use client';

import { useState, FormEvent } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function CrearProductoPage() {
  const [form, setForm] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    color_producto: '',
    talla_producto: '',
    dimensiones_producto: '',
    estado_producto: 'Nuevo',
  });
  const [archivo, setArchivo] = useState<File | null>(null);
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
      if (archivo) {
        const buffer = await archivo.arrayBuffer();
        body.foto_producto = Array.from(new Uint8Array(buffer));
      }
      await api.post('/productos', body);
      router.push('/productos');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear producto');
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input type="text" value={form.nombre_producto} onChange={(e) => setForm({ ...form, nombre_producto: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea value={form.descripcion_producto} onChange={(e) => setForm({ ...form, descripcion_producto: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input type="text" value={form.color_producto} onChange={(e) => setForm({ ...form, color_producto: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Talla</label>
            <input type="text" value={form.talla_producto} onChange={(e) => setForm({ ...form, talla_producto: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dimensiones</label>
          <input type="text" value={form.dimensiones_producto} onChange={(e) => setForm({ ...form, dimensiones_producto: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select value={form.estado_producto} onChange={(e) => setForm({ ...form, estado_producto: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500">
            <option>Nuevo</option>
            <option>Usado</option>
            <option>Reacondicionado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Foto</label>
          <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="w-full" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
          Crear Producto
        </button>
      </form>
    </div>
  );
}
