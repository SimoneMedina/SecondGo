'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { TipoUsuario } from '@/lib/types';

interface RegisterForm {
  nombres_usuario: string;
  apellidos_usuario: string;
  correo_usuario: string;
  contrasena_usuario: string;
  tipo_usuario: TipoUsuario;
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    nombres_usuario: '',
    apellidos_usuario: '',
    correo_usuario: '',
    contrasena_usuario: '',
    tipo_usuario: 'comprador',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(form);
      router.push('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Error al conectar con el servidor'
        );
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-xl border-t-4 border-green-600">
        <div className="flex justify-center mb-6 px-4">
          <img 
            src="/Imagenes/SecondGo.png" 
            alt="Logo SecondGo" 
            className="w-full max-w-sm object-cover"
          />
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold text-green-800">Crear Cuenta</h1>

        {error && (
          <div className="mb-4 border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-green-900">Tipo de cuenta</label>
            <div className="grid grid-cols-2 gap-3">
              {(['comprador', 'vendedor'] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setForm({ ...form, tipo_usuario: tipo })}
                  className={`border p-4 text-left transition ${
                    form.tipo_usuario === tipo
                      ? 'border-green-600 bg-green-100 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <span className="block text-sm font-semibold capitalize text-green-900">{tipo}</span>
                  <span className="mt-1 block text-xs text-gray-500">
                    {tipo === 'comprador' ? 'Explora moda sostenible' : 'Publica tus prendas'}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-green-900">Nombres</label>
            <input
              type="text"
              placeholder="Ej: Juan"
              value={form.nombres_usuario}
              onChange={(e) => setForm({ ...form, nombres_usuario: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-green-900">Apellidos</label>
            <input
              type="text"
              placeholder="Ej: Pérez"
              value={form.apellidos_usuario}
              onChange={(e) => setForm({ ...form, apellidos_usuario: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-green-900">Correo Electrónico</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.correo_usuario}
              onChange={(e) => setForm({ ...form, correo_usuario: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-green-900">Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={form.contrasena_usuario}
              onChange={(e) => setForm({ ...form, contrasena_usuario: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 py-2 text-white transition hover:bg-green-700 font-bold disabled:opacity-50"
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-green-700 hover:underline font-bold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}