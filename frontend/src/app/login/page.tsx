'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(correo, password);
      router.push('/');
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-xl border-t-4 border-green-600 rounded-lg">
        
        {/* Logo con ancho dinámico */}
        <div className="flex justify-center mb-6">
          <img 
            src="/Imagenes/SecondGo.png" 
            alt="Logo SecondGo" 
            className="w-full max-w-[150px] h-auto object-contain" 
          />
        </div>

        <h1 className="mb-6 text-center text-2xl font-bold text-green-900">Iniciar Sesión</h1>

        {error && (
          <div className="mb-4 border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-green-900">Correo Electrónico</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-green-900">Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 py-2 text-white transition hover:bg-green-700 font-bold rounded-md"
          >
            Ingresar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-green-700 hover:underline font-bold">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
