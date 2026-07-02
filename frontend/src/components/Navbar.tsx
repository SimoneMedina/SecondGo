'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;
  const esVendedor = user.tipo_usuario === 'vendedor';

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-5 overflow-x-auto">
            <Link href="/" className="shrink-0 text-xl font-bold">SecondGo</Link>
            <Link href="/productos" className="shrink-0 hover:text-indigo-200">
              {esVendedor ? 'Mis Productos' : 'Catalogo'}
            </Link>
            <Link href="/tiendas" className="shrink-0 hover:text-indigo-200">
              {esVendedor ? 'Mi Tienda' : 'Tiendas'}
            </Link>
            {!esVendedor && (
              <Link href="/resenas" className="shrink-0 hover:text-indigo-200">Resenas</Link>
            )}
            {esVendedor && (
              <Link href="/productos/crear" className="shrink-0 hover:text-indigo-200">+ Nuevo Producto</Link>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <span className="hidden text-sm sm:inline">{user.nombres} {user.apellidos}</span>
            <button
              onClick={logout}
              className="bg-indigo-700 px-3 py-1 text-sm hover:bg-indigo-800"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
