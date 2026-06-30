'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Bienvenido, {user.nombres}</h1>
        <p className="text-indigo-100">Panel de control de SecondGo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/productos" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="text-3xl mb-3">📦</div>
          <h2 className="text-lg font-semibold">Productos</h2>
          <p className="text-gray-500 text-sm">Gestiona el catálogo de productos</p>
        </Link>

        <Link href="/tiendas" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="text-3xl mb-3">🏪</div>
          <h2 className="text-lg font-semibold">Tiendas</h2>
          <p className="text-gray-500 text-sm">Administra las tiendas registradas</p>
        </Link>

        <Link href="/resenas" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <div className="text-3xl mb-3">⭐</div>
          <h2 className="text-lg font-semibold">Reseñas</h2>
          <p className="text-gray-500 text-sm">Revisa las opiniones de los clientes</p>
        </Link>
      </div>
    </div>
  );
}
