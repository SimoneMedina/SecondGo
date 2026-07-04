'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const esVendedor = user.tipo_usuario === 'vendedor';

  return (
    <nav className="sticky top-0 z-50 border-b border-green-700 bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 text-white shadow-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <div className="flex items-center gap-8">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <img
              src="/Imagenes/SecondGo.png"
              className="h-14 w-14 rounded-full bg-white p-1 shadow-md"
              alt="SecondGo"
            />

            <div>
              <h1 className="text-2xl font-bold">
                SecondGo
              </h1>

              <p className="text-xs text-green-100">
                Moda sostenible
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">

            <Link
              href="/"
              className="rounded-xl px-4 py-2 transition hover:bg-white/20"
            >
              🏠 Inicio
            </Link>

            <Link
              href="/productos"
              className="rounded-xl px-4 py-2 transition hover:bg-white/20"
            >
              {esVendedor ? '👕 Mis Productos' : '🔎 Buscar prendas'}
            </Link>

            <Link
              href="/tiendas"
              className="rounded-xl px-4 py-2 transition hover:bg-white/20"
            >
              {esVendedor ? '🏪 Mi Tienda' : '📍 Tiendas'}
            </Link>

            {!esVendedor && (
              <>
                <Link
                  href="/armario"
                  className="rounded-xl px-4 py-2 transition hover:bg-white/20"
                >
                  🧥 Mi Armario
                </Link>

                <Link
                  href="/resenas"
                  className="rounded-xl px-4 py-2 transition hover:bg-white/20"
                >
                  ⭐ Mis Reseñas
                </Link>
              </>
            )}

            {esVendedor && (
              <Link
                href="/productos/crear"
                className="rounded-xl bg-white px-4 py-2 font-semibold text-green-700 transition hover:bg-green-100"
              >
                ➕ Nuevo Producto
              </Link>
            )}

          </div>

        </div>

        <div className="flex items-center gap-4">

          <div className="flex items-center gap-3 rounded-full bg-white/15 px-3 py-2">

            <img
              src="/Imagenes/avatar.png"
              alt="Perfil"
              className="h-11 w-11 rounded-full border-2 border-white object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://ui-avatars.com/api/?name=' +
                  encodeURIComponent(user.nombres);
              }}
            />

            <div className="hidden text-right md:block">

              <p className="text-sm font-semibold">
                {user.nombres}
              </p>

              <p className="text-xs text-green-100 capitalize">
                {user.tipo_usuario}
              </p>

            </div>

          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-700"
          >
            Salir
          </button>

        </div>

      </div>
    </nav>
  );
}