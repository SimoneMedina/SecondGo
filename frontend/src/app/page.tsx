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

  const esVendedor = user.tipo_usuario === 'vendedor';
  const accesos = esVendedor
    ? [
        { href: '/tiendas', titulo: 'Mi Tienda', texto: 'Administra la informacion de tu local' },
        { href: '/productos', titulo: 'Mis Productos', texto: 'Revisa el inventario publicado' },
        { href: '/productos/crear', titulo: 'Nuevo Producto', texto: 'Publica articulos con fotos' },
      ]
    : [
        { href: '/productos', titulo: 'Catalogo', texto: 'Explora productos disponibles' },
        { href: '/tiendas', titulo: 'Tiendas', texto: 'Encuentra locales registrados' },
        { href: '/resenas', titulo: 'Resenas', texto: 'Comparte opiniones sobre tiendas' },
      ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
        <h1 className="mb-2 text-3xl font-bold">Bienvenido, {user.nombres}</h1>
        <p className="text-indigo-100">
          {esVendedor ? 'Panel para gestionar tu tienda' : 'Panel para explorar SecondGo'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {accesos.map((acceso) => (
          <Link key={acceso.href} href={acceso.href} className="bg-white p-6 shadow-md transition hover:shadow-lg">
            <h2 className="text-lg font-semibold">{acceso.titulo}</h2>
            <p className="mt-2 text-sm text-gray-500">{acceso.texto}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
