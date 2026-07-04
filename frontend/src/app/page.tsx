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
        {
          href: '/tiendas',
          titulo: 'Mi tienda',
          texto: 'Administra tu mostrador, ubicación, productos y reseñas.',
          icono: '🏪',
        },
        {
          href: '/productos',
          titulo: 'Mis productos',
          texto: 'Revisa prendas publicadas, estados y fotos.',
          icono: '👕',
        },
        {
          href: '/productos/crear',
          titulo: 'Nuevo producto',
          texto: 'Publica prendas con fotos, color y etiquetas inteligentes.',
          icono: '➕',
        },
      ]
    : [
        {
          href: '/productos',
          titulo: 'Buscar prendas',
          texto: 'Explora productos con filtros, colores y sugerencias.',
          icono: '🔎',
        },
        {
          href: '/tiendas',
          titulo: 'Tiendas cercanas',
          texto: 'Encuentra tiendas en el mapa y revisa sus productos.',
          icono: '📍',
        },
        {
          href: '/armario',
          titulo: 'Mi armario',
          texto: 'Mira tus prendas solicitadas y arma outfits con SecondGo IA.',
          icono: '🧥',
        },
        {
          href: '/resenas',
          titulo: 'Mis reseñas',
          texto: 'Consulta las reseñas que hiciste a las tiendas.',
          icono: '⭐',
        },
      ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-700 via-emerald-600 to-lime-600 p-8 text-white shadow-xl">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-100">
              SecondGo
            </p>
            <h1 className="text-3xl font-bold">
              Bienvenido, {user.nombres}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-green-50">
              {esVendedor
                ? 'Gestiona tu tienda sostenible, publica prendas y conecta con compradores.'
                : 'Explora moda sostenible, solicita prendas y recibe ideas de outfits.'}
            </p>
          </div>

          <img
            src="/Imagenes/SecondGo.png"
            alt="SecondGo"
            className="h-24 w-40 rounded-2xl bg-white/90 object-contain p-3 shadow-lg"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {accesos.map((acceso) => (
          <Link
            key={acceso.href}
            href={acceso.href}
            className="group rounded-3xl border border-green-100 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:border-green-300 hover:shadow-xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              {acceso.icono}
            </div>

            <h2 className="text-lg font-bold text-green-900">
              {acceso.titulo}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {acceso.texto}
            </p>

            <p className="mt-4 text-sm font-semibold text-green-700 group-hover:underline">
              Entrar →
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}