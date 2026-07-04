'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { ApiResponse, Producto, ProductoListResponse } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AsistenteIASecondGo from '@/components/AsistenteIASecondGo';
import Link from 'next/link';

const estilos = ['Casual', 'Formal', 'Deportivo', 'Básicos'];

export default function ArmarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoBase, setProductoBase] = useState<Producto | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [estilo, setEstilo] = useState('Casual');
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.tipo_usuario !== 'comprador') {
      router.push('/productos');
      return;
    }

    api
      .get<ApiResponse<ProductoListResponse> | ProductoListResponse>(
        '/productos/armario/mis-prendas',
      )
      .then((res) => {
        const payload = 'data' in res.data && res.data.data ? res.data.data : res.data;
        const lista = Array.isArray(payload.productos) ? payload.productos : [];

        setProductos(lista);
        setProductoBase(lista[0] || null);
      })
      .catch((err) => {
        console.error(err);
        setProductos([]);
        setProductoBase(null);
      })
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  const respuestaChat = useMemo(() => {
    if (!mensaje.trim()) {
      return 'Hola, soy SecondGo IA. Elige una prenda de tu armario y dime qué estilo quieres armar. Puedo sugerirte combinaciones casuales, formales, deportivas o con básicos.';
    }

    if (!productoBase) {
      return 'Todavía no tienes prendas solicitadas en tu armario. Cuando solicites una prenda, podré ayudarte a crear outfits con ella.';
    }

    const texto = mensaje.toLowerCase();
    const estiloDetectado =
      estilos.find((e) => texto.includes(e.toLowerCase())) || estilo;

    return `Con ${productoBase.nombre}, te recomiendo un look ${estiloDetectado.toLowerCase()} usando tonos que combinen con ${productoBase.color}. Puedes buscar prendas complementarias en la misma gama ${productoBase.grupoColor || 'neutra'}, agregar una pieza básica y cerrar el outfit con accesorios sencillos. Si quieres algo más actual, intenta equilibrar una prenda protagonista con colores neutros para que el look se vea limpio, sostenible y fácil de repetir.`;
  }, [mensaje, productoBase, estilo]);

  if (authLoading || !user) return null;

  if (loading) {
    return (
      <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
        <p className="text-sm text-green-700">Cargando tu armario...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-green-900">Mi armario</h1>
        <p className="mt-1 text-sm text-green-700">
          Aquí aparecen las prendas que solicitaste y puedes pedir ideas de outfits.
        </p>
      </div>

      {productos.length === 0 ? (
        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
          <p className="text-sm text-gray-600">
            Aún no tienes prendas solicitadas.
          </p>

          <Link
            href="/productos"
            className="mt-4 inline-flex rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productos.map((p) => {
              const foto = p.fotos?.[0];

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProductoBase(p)}
                  className={`overflow-hidden rounded-3xl border bg-white text-left shadow-lg transition hover:-translate-y-1 ${
                    productoBase?.id === p.id
                      ? 'border-green-700 ring-2 ring-green-600'
                      : 'border-green-100'
                  }`}
                >
                  {foto ? (
                    <img
                      src={foto}
                      alt={p.nombre}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-green-50 text-green-800">
                      Sin foto
                    </div>
                  )}

                  <div className="space-y-2 p-5">
                    <h2 className="text-lg font-bold text-green-900">
                      {p.nombre}
                    </h2>

                    <p className="line-clamp-2 text-sm text-gray-600">
                      {p.descripcion}
                    </p>

                    <p className="text-xs text-green-700">
                      Tienda: {p.tiendaNombre || p.tiendaId || p.usuarioTienda}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                        {p.estado}
                      </span>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                        {p.color}
                      </span>

                      {p.estilo && (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                          {p.estilo}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </section>

          {productoBase && (
            <AsistenteIASecondGo
              productoBase={productoBase}
              productos={productos}
            />
          )}

          <section className="rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-green-900">
                Chat de outfits
              </h2>

              <p className="mt-1 text-sm text-green-700">
                Escribe una idea y SecondGo IA te dará una sugerencia conceptual.
              </p>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {estilos.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEstilo(e)}
                  className={`rounded-2xl border px-3 py-2 text-sm font-semibold ${
                    estilo === e
                      ? 'border-green-700 bg-green-700 text-white'
                      : 'border-green-200 bg-green-50 text-green-800'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            <div className="space-y-4 rounded-3xl bg-green-50 p-5">
              <div className="rounded-3xl bg-white p-4 text-sm leading-6 text-gray-700">
                🤖 {respuestaChat}
              </div>

              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Ej: quiero un look casual para salir con amigas"
                className="min-h-24 w-full rounded-2xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}