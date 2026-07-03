'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { TipoUsuario } from '@/lib/types';

const MapaUbicacion = dynamic(() => import('@/components/MapaUbicacion'), {
  ssr: false,
});

interface RegisterForm {
  nombres_usuario: string;
  apellidos_usuario: string;
  correo_usuario: string;
  contrasena_usuario: string;
  latitud: number;
  longitud: number;
  direccion: string;
  tipo_usuario: TipoUsuario;
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
  nombres_usuario: '',
  apellidos_usuario: '',
  correo_usuario: '',
  contrasena_usuario: '',
  latitud: -0.180653,
  longitud: -78.467834,
  direccion: '',
  tipo_usuario: 'comprador',
});
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      router.push('/');
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(message || 'Error al registrarse');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Crear Cuenta</h1>

        {error && (
          <div className="mb-4 border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de cuenta</label>
            <div className="grid grid-cols-2 gap-3">
              {(['comprador', 'vendedor'] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setForm({ ...form, tipo_usuario: tipo })}
                  className={`border p-4 text-left transition ${
                    form.tipo_usuario === tipo
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <span className="block text-sm font-semibold capitalize">{tipo}</span>
                  <span className="mt-1 block text-xs text-gray-500">
                    {tipo === 'comprador' ? 'Explorar y reseñar tiendas' : 'Publicar productos y tienda'}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nombres</label>
            <input
              type="text"
              value={form.nombres_usuario}
              onChange={(e) => setForm({ ...form, nombres_usuario: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Apellidos</label>
            <input
              type="text"
              value={form.apellidos_usuario}
              onChange={(e) => setForm({ ...form, apellidos_usuario: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Correo Electronico</label>
            <input
              type="email"
              value={form.correo_usuario}
              onChange={(e) => setForm({ ...form, correo_usuario: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Contrasena</label>
            <input
              type="password"
              value={form.contrasena_usuario}
              onChange={(e) => setForm({ ...form, contrasena_usuario: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
<div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Ubicación
  </label>

  <MapaUbicacion
    latitud={form.latitud}
    longitud={form.longitud}
    onChange={(lat, lng) =>
      setForm({
        ...form,
        latitud: lat,
        longitud: lng,
      })
    }
  />

  <p className="mt-2 text-xs text-gray-500">
    Haz clic en el mapa para seleccionar tu ubicación.
  </p>
</div>

<div>
  <label className="mb-1 block text-sm font-medium text-gray-700">
    Dirección o referencia
  </label>
  <input
    type="text"
    value={form.direccion}
    onChange={(e) => setForm({ ...form, direccion: e.target.value })}
    className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="Ej: Quito, La Carolina"
  />
</div>
          <button
            type="submit"
            className="w-full bg-indigo-600 py-2 text-white transition hover:bg-indigo-700"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Ya tienes cuenta?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline">Inicia sesion</Link>
        </p>
      </div>
    </div>
  );
}
