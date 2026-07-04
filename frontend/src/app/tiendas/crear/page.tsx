'use client';

import { useState, FormEvent, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import dynamic from 'next/dynamic';

const MapaUbicacion = dynamic(() => import('@/components/MapaUbicacion'), { ssr: false });

export default function CrearTiendaPage() {
  const [form, setForm] = useState({
    nombre_local: '',
    descripcion_tienda: '',
    ubicacion_tienda: '', // Este campo estaba vacío siempre
    latitud_tienda: -0.180653,
    longitud_tienda: -78.467834,
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user?.tipo_usuario !== 'vendedor') router.push('/tiendas');
  }, [user, loading, router]);

  const preview = useMemo(() => {
    return logo ? URL.createObjectURL(logo) : '';
  }, [logo]);

  // Función para manejar cambios en el mapa y actualizar la ubicación
  const handleMapChange = (lat: number, lng: number) => {
    setForm(prev => ({
      ...prev,
      latitud_tienda: lat,
      longitud_tienda: lng,
      // Actualizamos el string de ubicación con las coordenadas actuales
      ubicacion_tienda: `${lat}, ${lng}` 
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación extra antes de enviar
    if (!form.ubicacion_tienda) {
      setError('Por favor, selecciona una ubicación en el mapa.');
      return;
    }

    try {
      const body = new FormData();
      body.append('nombre_local', form.nombre_local);
      body.append('descripcion_tienda', form.descripcion_tienda);
      body.append('ubicacion_tienda', form.ubicacion_tienda);
      body.append('latitud_tienda', String(form.latitud_tienda));
      body.append('longitud_tienda', String(form.longitud_tienda));
      if (logo) body.append('logo', logo);
      
      await api.post('/tiendas', body);
      router.push('/tiendas');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setError(Array.isArray(message) ? message.join(', ') : message || 'Error al crear tienda');
      } else {
        setError('Error al crear tienda');
      }
    }
  };

  if (loading || !user || user.tipo_usuario !== 'vendedor') return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Nueva tienda</h1>
      
      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-green-100">
        <div>
          <label className="block text-sm font-semibold text-green-900 mb-2">Logo de la tienda</label>
          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-40 border-2 border-dashed border-green-300 rounded-2xl flex items-center justify-center overflow-hidden bg-green-50">
              {preview ? (
                <img src={preview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-green-400 text-xs">Sin imagen</span>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setLogo(e.target.files?.[0] || null)} 
              className="text-sm text-green-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-green-900 mb-1">Nombre del local</label>
          <input type="text" value={form.nombre_local} onChange={(e) => setForm({...form, nombre_local: e.target.value})} className="w-full rounded-xl border border-green-200 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500" required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-green-900 mb-1">Descripción</label>
          <textarea value={form.descripcion_tienda} onChange={(e) => setForm({...form, descripcion_tienda: e.target.value})} className="w-full rounded-xl border border-green-200 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]" required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-green-900 mb-1">Ubicación</label>
          <MapaUbicacion 
            latitud={form.latitud_tienda} 
            longitud={form.longitud_tienda} 
            onChange={handleMapChange} 
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="flex-1 py-3 rounded-xl border border-green-600 text-green-600 font-semibold hover:bg-green-50 transition">
            Cancelar
          </button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition shadow-lg">
            Crear tienda
          </button>
        </div>
      </form>
    </div>
  );
}
