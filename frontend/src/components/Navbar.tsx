'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl">SecondGo</Link>
            <Link href="/productos" className="hover:text-indigo-200">Productos</Link>
            <Link href="/tiendas" className="hover:text-indigo-200">Tiendas</Link>
            <Link href="/resenas" className="hover:text-indigo-200">Reseñas</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.nombres} {user.apellidos}</span>
            <button
              onClick={logout}
              className="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
