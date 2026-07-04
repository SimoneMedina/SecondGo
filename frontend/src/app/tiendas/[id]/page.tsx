'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Tienda = {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion?: string;
  ubicacion?: string;
  latitud?: number | null;
  longitud?: number | null;
  logo?: string;
  idVendedor: string;
  cantidadProductos?: number;
};

type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  hexColor?: string | null;
  grupoColor?: string | null;
  tipoPrenda?: string | null;
  estilo?: string | null;
  talla?: string | null;
  estado: string;
  usuarioTienda: string;
  fotos?: string[];
};

type Resena = {
  id?: string;
  calificacion: number;
  comentario: string;
  compradorNombre?: string;
};

type TiendaDetalle = {
  tienda: Tienda;
  productos: Producto[];
  resenas: Resena[];
  promedioResenas: number;
};

const tallaLabels: Record<string, string> = {
  XXS: 'XXS - 30',
  XS: 'XS / PP - 32 a 34',
  S: 'S / P - 36 a 38',
  M: 'M - 40',
  L: 'L / G - 42',
  XL: 'XL / GG - 44',
  XXL: 'XXL / 2XL - 46',
  XXXL: 'XXXL / 3XL - 48',
};

function Estrellas({ valor }: { valor: number }) {
  const seguro = Math.max(0, Math.min(5, Math.round(valor || 0)));

  return (
    <div className="text-lg text-yellow-500">
      {'★'.repeat(seguro)}
      {'☆'.repeat(5 - seguro)}
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const valor = estado.toLowerCase();

  if (valor === 'solicitado') {
    return (
      <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
        Solicitado
      </span>
    );
  }

  if (valor === 'pendiente') {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
        Pendiente
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
      Disponible
    </span>
  );
}

export default function PerfilTiendaPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const id = String(params.id);

  const [detalle, setDetalle] = useState<TiendaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [fotoActual, setFotoActual] = useState<Record<string, number>>({});

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    api
  .get(`/tiendas/${id}/detalle`)
  .then((res) => {
    const respuesta = res.data;

    const data =
      respuesta?.data?.data ??
      respuesta?.data ??
      respuesta;

    console.log('Detalle tienda:', data);

    setDetalle(data);
  })
  .catch((error) => {
    console.error('Error al obtener detalle de tienda:', error);
    setDetalle(null);
  })
  .finally(() => {
    setLoading(false);
  });
  }, [id, user, authLoading, router]);

  if (authLoading || !user) return null;

  if (loading) {
    return (
      <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
        <p className="text-sm text-green-700">Cargando tienda...</p>
      </div>
    );
  }

  if (!detalle) {
    return (
      <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
        <p className="text-sm text-gray-600">No se encontró la tienda.</p>
      </div>
    );
  }

  const { tienda, productos, resenas, promedioResenas } = detalle;

  return (
    <div className="space-y-8">
      <Link href="/tiendas" className="inline-flex text-sm font-semibold text-green-700 hover:underline">
        ← Volver a tiendas
      </Link>

      <section className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-lg">
        {tienda.logo ? (
          <img src={tienda.logo} alt={tienda.nombre} className="h-64 w-full object-cover" />
        ) : (
          <div className="flex h-64 items-center justify-center bg-green-50 text-4xl font-bold text-green-800">
            SecondGo
          </div>
        )}

        <div className="space-y-5 p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-3xl font-bold text-green-900">{tienda.nombre}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">{tienda.descripcion}</p>
            </div>

            <div className="w-fit rounded-2xl bg-green-50 px-4 py-3">
              <Estrellas valor={promedioResenas} />
              <p className="mt-1 text-xs text-green-700">
                {resenas.length} reseñas
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-3">
            <div className="rounded-2xl bg-green-50 p-4">
              <p className="font-semibold text-green-900">Ubicación</p>
              <p className="mt-1">{tienda.ubicacion || 'No registrada'}</p>
            </div>

            <div className="rounded-2xl bg-green-50 p-4">
              <p className="font-semibold text-green-900">Productos</p>
              <p className="mt-1">{productos.length} prendas publicadas</p>
            </div>

            <div className="rounded-2xl bg-green-50 p-4">
              <p className="font-semibold text-green-900">Vendedor</p>
              <p className="mt-1">{tienda.idVendedor}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-green-900">Productos de la tienda</h2>
            <p className="mt-1 text-sm text-green-700">
              Prendas disponibles, pendientes o ya solicitadas.
            </p>
          </div>
        </div>

        {productos.length === 0 ? (
          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
            <p className="text-sm text-gray-600">Esta tienda aún no tiene productos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productos.map((p) => {
              const fotos = p.fotos ?? [];
              const indice = fotoActual[p.id] ?? 0;
              const foto = fotos[indice] ?? fotos[0];
              const solicitado = p.estado.toLowerCase() === 'solicitado';

              return (
                <article
                  key={p.id}
                  className={`overflow-hidden rounded-3xl border bg-white shadow-lg transition ${
                    solicitado
                      ? 'border-gray-200 opacity-70 grayscale'
                      : 'border-green-100 hover:-translate-y-1 hover:shadow-xl'
                  }`}
                >
                  <div className="relative h-52 bg-green-50">
                    {foto ? (
                      <img src={foto} alt={p.nombre} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-green-800">
                        Sin fotos
                      </div>
                    )}

                    <div className="absolute left-3 top-3">
                      <EstadoBadge estado={p.estado} />
                    </div>

                    {fotos.length > 1 && (
                      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                        {fotos.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              setFotoActual((actual) => ({
                                ...actual,
                                [p.id]: i,
                              }))
                            }
                            className={`h-2.5 w-2.5 rounded-full ${
                              i === indice ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-5">
                    <div>
                      <h3 className="text-lg font-bold text-green-900">{p.nombre}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">{p.descripcion}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                        {p.color}
                      </span>

                      {p.hexColor && (
                        <span className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-green-800">
                          <span
                            className="h-3 w-3 rounded-full border border-green-200"
                            style={{ backgroundColor: p.hexColor }}
                          />
                          {p.hexColor}
                        </span>
                      )}

                      {p.grupoColor && (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                          {p.grupoColor}
                        </span>
                      )}

                      {p.tipoPrenda && (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                          {p.tipoPrenda}
                        </span>
                      )}

                      {p.estilo && (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                          {p.estilo}
                        </span>
                      )}

                      {p.talla && (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                          {tallaLabels[p.talla] ?? p.talla}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-green-900">Reseñas</h2>
          <p className="mt-1 text-sm text-green-700">
            Opiniones de compradores sobre esta tienda.
          </p>
        </div>

        {resenas.length === 0 ? (
          <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
            <p className="text-sm text-gray-600">Esta tienda aún no tiene reseñas.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {resenas.map((r, index) => (
              <article
                key={r.id || index}
                className="rounded-3xl border border-green-100 bg-white p-5 shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-green-900">
                      {r.compradorNombre || 'Comprador'}
                    </p>
                    <Estrellas valor={Number(r.calificacion || 0)} />
                  </div>
                </div>

                <p className="text-sm leading-6 text-gray-600">
                  {r.comentario || 'Sin comentario'}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}