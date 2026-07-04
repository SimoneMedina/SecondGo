'use client';

import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { Producto, ApiResponse, ProductoListResponse } from '@/lib/types';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AsistenteIASecondGo from '@/components/AsistenteIASecondGo';

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

const tallas = ['Todas', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const estados = ['Todos', 'Disponible', 'Pendiente', 'Solicitado'];

const estilos = ['Todos', 'Casual', 'Formal', 'Deportivo', 'Básicos'];

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [fotoActual, setFotoActual] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [talla, setTalla] = useState('Todas');
  const [estado, setEstado] = useState('Todos');
  const [estilo, setEstilo] = useState('Todos');
  const [color, setColor] = useState('');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const endpoint =
      user.tipo_usuario === 'vendedor'
        ? `/productos/tienda/${user.id}`
        : '/productos';

    api
      .get<ApiResponse<ProductoListResponse> | ProductoListResponse>(endpoint)
      .then((res) => {
        const payload = 'data' in res.data && res.data.data ? res.data.data : res.data;
        const lista = Array.isArray(payload.productos) ? payload.productos : [];

        setProductos(lista);
        setProductoSeleccionado(lista[0] || null);
      })
      .catch((err) => {
        console.error(err);
        setProductos([]);
      })
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    const colorTexto = color.toLowerCase().trim();

    return productos.filter((p) => {
      const contenido = [
        p.nombre,
        p.descripcion,
        p.color,
        p.grupoColor,
        p.tipoPrenda,
        p.estilo,
        p.talla,
        p.tiendaNombre,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const coincideBusqueda = !texto || contenido.includes(texto);
      const coincideTalla = talla === 'Todas' || p.talla === talla;
      const coincideEstado = estado === 'Todos' || p.estado === estado;
      const coincideEstilo = estilo === 'Todos' || p.estilo === estilo;
      const coincideColor =
        !colorTexto ||
        p.color?.toLowerCase().includes(colorTexto) ||
        p.grupoColor?.toLowerCase().includes(colorTexto);

      return (
        coincideBusqueda &&
        coincideTalla &&
        coincideEstado &&
        coincideEstilo &&
        coincideColor
      );
    });
  }, [productos, busqueda, talla, estado, estilo, color]);

  const solicitarProducto = async (producto: Producto) => {
    setError('');

    try {
      await api.patch(`/productos/${producto.id}/solicitar`);

      setProductos((actuales) =>
        actuales.map((p) =>
          p.id === producto.id
            ? {
                ...p,
                estado: 'Pendiente',
                compradorSolicitanteId: user?.id,
              }
            : p,
        ),
      );

      setProductoSeleccionado((actual) =>
        actual?.id === producto.id
          ? {
              ...actual,
              estado: 'Pendiente',
              compradorSolicitanteId: user?.id,
            }
          : actual,
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;

        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'No se pudo solicitar la prenda',
        );
      } else {
        setError('No se pudo solicitar la prenda');
      }
    }
  };

  if (authLoading || !user) return null;

  const esVendedor = user.tipo_usuario === 'vendedor';
  const esComprador = user.tipo_usuario === 'comprador';

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-900">
            {esVendedor ? 'Mis productos' : 'Buscar prendas'}
          </h1>
          <p className="mt-1 text-sm text-green-700">
            {esVendedor
              ? 'Administra las prendas publicadas en tu tienda.'
              : 'Filtra por prenda, talla, color, estilo y recibe sugerencias tipo IA.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {esComprador && (
            <Link
              href="/armario"
              className="rounded-xl border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-800 shadow-sm hover:bg-green-50"
            >
              🧥 Ver mi armario
            </Link>
          )}

          {esVendedor && (
            <Link
              href="/productos/crear"
              className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800"
            >
              + Nuevo producto
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!esVendedor && (
        <section className="rounded-3xl border border-green-100 bg-white p-5 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-green-900">
            Filtros de búsqueda
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-green-900">
                Buscar prenda
              </label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ej: pantalón, camiseta, casual..."
                className="w-full rounded-xl border border-green-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-green-900">
                Talla
              </label>
              <select
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
                className="w-full rounded-xl border border-green-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              >
                {tallas.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-green-900">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full rounded-xl border border-green-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              >
                {estados.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-green-900">
                Estilo
              </label>
              <select
                value={estilo}
                onChange={(e) => setEstilo(e.target.value)}
                className="w-full rounded-xl border border-green-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              >
                {estilos.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-semibold text-green-900">
              Color o gama
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Ej: azul, neutros, cálidos..."
              className="w-full rounded-xl border border-green-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <p className="mt-3 text-sm text-green-700">
            Resultados encontrados: {productosFiltrados.length}
          </p>
        </section>
      )}

      {loading ? (
        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
          <p className="text-sm text-green-700">Cargando productos...</p>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
          <p className="text-sm text-gray-600">
            No hay productos que coincidan con la búsqueda.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {productosFiltrados.map((p) => {
            const fotos = p.fotos ?? [];
            const indice = fotoActual[p.id] ?? 0;
            const foto = fotos[indice] ?? fotos[0];
            const estadoLower = p.estado.toLowerCase();
            const noDisponible =
              estadoLower === 'solicitado' || estadoLower === 'pendiente';

            return (
              <article
                key={p.id}
                onClick={() => setProductoSeleccionado(p)}
                className={`cursor-pointer overflow-hidden rounded-3xl border bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${
                  productoSeleccionado?.id === p.id
                    ? 'border-green-700 ring-2 ring-green-600'
                    : 'border-green-100'
                } ${estadoLower === 'solicitado' ? 'opacity-70 grayscale' : ''}`}
              >
                <div className="relative h-56 bg-green-50">
                  {foto ? (
                    <img
                      src={foto}
                      alt={p.nombre}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-green-800">
                      Sin fotos
                    </div>
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      estadoLower === 'solicitado'
                        ? 'bg-gray-200 text-gray-700'
                        : estadoLower === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {p.estado}
                  </span>

                  {fotos.length > 1 && (
                    <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                      {fotos.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFotoActual((actual) => ({
                              ...actual,
                              [p.id]: i,
                            }));
                          }}
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
                    <h2 className="text-lg font-bold text-green-900">{p.nombre}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {p.descripcion}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                      {p.color}
                    </span>

                    {p.talla && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                        {tallaLabels[p.talla] ?? p.talla}
                      </span>
                    )}

                    {p.estilo && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                        {p.estilo}
                      </span>
                    )}

                    {p.grupoColor && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-green-800">
                        {p.grupoColor}
                      </span>
                    )}
                  </div>

                  {p.tiendaNombre && (
                    <p className="text-xs text-gray-500">Tienda: {p.tiendaNombre}</p>
                  )}

                  {esComprador && (
                    <button
                      type="button"
                      disabled={noDisponible}
                      onClick={(e) => {
                        e.stopPropagation();
                        solicitarProducto(p);
                      }}
                      className={`w-full rounded-xl px-4 py-2 text-sm font-semibold ${
                        noDisponible
                          ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                          : 'bg-green-700 text-white hover:bg-green-800'
                      }`}
                    >
                      {noDisponible ? 'No disponible' : 'Solicitar prenda'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {!esVendedor && productoSeleccionado && (
        <AsistenteIASecondGo
          productoBase={productoSeleccionado}
          productos={productosFiltrados}
        />
      )}
    </div>
  );
}