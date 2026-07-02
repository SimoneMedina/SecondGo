'use client';

import { useState, FormEvent, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function CrearProductoPage() {
  const [form, setForm] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    color_producto: '',
    talla_producto: '',
    dimensiones_producto: '',
    estado_producto: 'Nuevo',
  });
  const [archivos, setArchivos] = useState<File[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user?.tipo_usuario !== 'vendedor') router.push('/productos');
  }, [user, loading, router]);

  const previews = useMemo(() => archivos.map((archivo) => URL.createObjectURL(archivo)), [archivos]);

  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  if (loading || !user || user.tipo_usuario !== 'vendedor') return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      archivos.forEach((archivo) => body.append('fotos', archivo));

      await api.post('/productos', body);
      router.push('/productos');
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(message || 'Error al crear producto');
    }
  };

  const agregarArchivos = (files: FileList | null) => {
    if (!files) return;
    setArchivos((actuales) => [...actuales, ...Array.from(files)].slice(0, 10));
  };

  const quitarArchivo = (index: number) => {
    setArchivos((actuales) => actuales.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Nuevo Producto</h1>

      {error && (
        <div className="mb-4 border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md">
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre</label>
          <input type="text" value={form.nombre_producto} onChange={(e) => setForm({ ...form, nombre_producto: e.target.value })}
            className="w-full border px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Descripcion</label>
          <textarea value={form.descripcion_producto} onChange={(e) => setForm({ ...form, descripcion_producto: e.target.value })}
            className="w-full border px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Color</label>
            <input type="text" value={form.color_producto} onChange={(e) => setForm({ ...form, color_producto: e.target.value })}
              className="w-full border px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Talla</label>
            <input type="text" value={form.talla_producto} onChange={(e) => setForm({ ...form, talla_producto: e.target.value })}
              className="w-full border px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Dimensiones</label>
          <input type="text" value={form.dimensiones_producto} onChange={(e) => setForm({ ...form, dimensiones_producto: e.target.value })}
            className="w-full border px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Estado</label>
          <select value={form.estado_producto} onChange={(e) => setForm({ ...form, estado_producto: e.target.value })}
            className="w-full border px-3 py-2 focus:ring-2 focus:ring-indigo-500">
            <option>Nuevo</option>
            <option>Usado</option>
            <option>Reacondicionado</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Fotos</label>
          <input type="file" accept="image/*" multiple onChange={(e) => agregarArchivos(e.target.files)} className="w-full" />
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map((preview, index) => (
                <div key={preview} className="relative aspect-square overflow-hidden bg-gray-100">
                  <img src={preview} alt={`Vista previa ${index + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => quitarArchivo(index)}
                    className="absolute right-2 top-2 bg-black/70 px-2 py-1 text-xs text-white"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="w-full bg-indigo-600 py-2 text-white hover:bg-indigo-700">
          Crear Producto
        </button>
      </form>
    </div>
  );
}
