'use client';

import { useState, FormEvent, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { detectarGrupoColor, nombreColorBasico } from '@/lib/colorUtils';
import { detectarEtiquetasProducto } from '@/lib/detectarEtiquetasProducto';

const tallas = [
  { value: 'XXS', label: 'XXS - 30' },
  { value: 'XS', label: 'XS / PP - 32 a 34' },
  { value: 'S', label: 'S / P - 36 a 38' },
  { value: 'M', label: 'M - 40' },
  { value: 'L', label: 'L / G - 42' },
  { value: 'XL', label: 'XL / GG - 44' },
  { value: 'XXL', label: 'XXL / 2XL - 46' },
  { value: 'XXXL', label: 'XXXL / 3XL - 48' },
];

export default function CrearProductoPage() {
  const [form, setForm] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    color_producto: 'Verde',
    hex_color: '#16a34a',
    grupo_color: 'naturales',
    talla_producto: 'M',
    estado_producto: 'Disponible',
  });

  const [archivos, setArchivos] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [verificandoTienda, setVerificandoTienda] = useState(true);
  const [tieneTienda, setTieneTienda] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user?.tipo_usuario !== 'vendedor') router.push('/productos');
  }, [user, loading, router]);

  useEffect(() => {
    if (loading || !user || user.tipo_usuario !== 'vendedor') return;

    const verificarTienda = async () => {
      setVerificandoTienda(true);
      setError('');

      try {
        await api.get('/tiendas/mi-tienda');
        setTieneTienda(true);
      } catch (err: unknown) {
        setTieneTienda(false);

        if (axios.isAxiosError(err) && err.response?.status !== 404) {
          setError(err.response?.data?.message || 'No se pudo verificar tu tienda');
        }
      } finally {
        setVerificandoTienda(false);
      }
    };

    verificarTienda();
  }, [user, loading]);

  const previews = useMemo(() => {
    return archivos.map((archivo) => URL.createObjectURL(archivo));
  }, [archivos]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  if (loading || !user || user.tipo_usuario !== 'vendedor') return null;

  if (verificandoTienda) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
        <p className="text-sm text-green-700">Verificando tu tienda...</p>
      </div>
    );
  }

  if (!tieneTienda) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
        <h1 className="mb-3 text-2xl font-bold text-green-900">Crea tu tienda primero</h1>
        <p className="mb-5 text-sm text-gray-600">
          Los productos se publican dentro de tu tienda. Primero debes crear una tienda.
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Link
          href="/tiendas/crear"
          className="inline-flex rounded-xl bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
        >
          Crear tienda
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const textoReferencia =
        archivos[0]?.name || form.nombre_producto || form.descripcion_producto;

      const etiquetas = detectarEtiquetasProducto(textoReferencia);

      const body = new FormData();

      body.append('nombre_producto', form.nombre_producto);
      body.append('descripcion_producto', form.descripcion_producto);
      body.append('color_producto', form.color_producto);
      body.append('hex_color', form.hex_color);
      body.append('grupo_color', form.grupo_color);
      body.append('tipo_prenda', etiquetas.tipo_prenda);
      body.append('estilo_producto', etiquetas.estilo_producto);
      body.append('talla_producto', form.talla_producto);
      body.append('estado_producto', form.estado_producto);

      archivos.forEach((archivo) => {
        body.append('fotos', archivo);
      });

      await api.post('/productos', body);
      router.push('/productos');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;

        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Error al crear producto',
        );
      } else {
        setError('Error al crear producto');
      }
    }
  };

  const agregarArchivos = (files: FileList | null) => {
    if (!files) return;
    setArchivos((actuales) => [...actuales, ...Array.from(files)].slice(0, 10));
  };

  const quitarArchivo = (index: number) => {
    setArchivos((actuales) => actuales.filter((_, i) => i !== index));
  };

  const cambiarColor = (hex: string) => {
    setForm({
      ...form,
      hex_color: hex,
      color_producto: nombreColorBasico(hex),
      grupo_color: detectarGrupoColor(hex),
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-900">Nuevo producto</h1>
        <p className="mt-1 text-sm text-green-700">
          Carga una prenda.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
        <div>
          <label className="mb-1 block text-sm font-semibold text-green-900">
            Nombre visible
          </label>
          <input
            type="text"
            value={form.nombre_producto}
            onChange={(e) => setForm({ ...form, nombre_producto: e.target.value })}
            className="w-full rounded-xl border border-green-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ej: Camisa blanca de algodón"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-green-900">
            Descripción
          </label>
          <textarea
            value={form.descripcion_producto}
            onChange={(e) => setForm({ ...form, descripcion_producto: e.target.value })}
            className="min-h-28 w-full rounded-xl border border-green-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="rounded-3xl border border-green-100 bg-green-50 p-4">
          <label className="mb-2 block text-sm font-semibold text-green-900">
            Color de la prenda
          </label>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              type="color"
              value={form.hex_color}
              onChange={(e) => cambiarColor(e.target.value)}
              className="h-16 w-24 cursor-pointer rounded-2xl border border-green-200 bg-white p-1"
            />

            <div>
              <p className="text-sm font-bold text-green-900">
                {form.color_producto}
              </p>
              <p className="text-xs text-green-700">
                Código: {form.hex_color}
              </p>
              <p className="text-xs text-green-700">
                Gama de color: {form.grupo_color}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-green-900">
              Talla
            </label>
            <select
              value={form.talla_producto}
              onChange={(e) => setForm({ ...form, talla_producto: e.target.value })}
              className="w-full rounded-xl border border-green-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              {tallas.map((talla) => (
                <option key={talla.value} value={talla.value}>
                  {talla.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-green-900">
              Estado
            </label>
            <select
              value={form.estado_producto}
              onChange={(e) => setForm({ ...form, estado_producto: e.target.value })}
              className="w-full rounded-xl border border-green-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Disponible</option>
              <option>Pendiente</option>
              <option>Solicitado</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
  <label className="block text-sm font-medium text-gray-700">Fotos de la prenda</label>

  <div className="flex items-center justify-center w-full">
    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-2xl cursor-pointer bg-green-50 hover:bg-green-100 transition-colors">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <svg className="w-8 h-8 mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        <p className="text-sm text-green-700 font-semibold">Haz clic para subir fotos</p>
      </div>
      <input 
        type="file" 
        accept="image/*" 
        multiple 
        onChange={(e) => agregarArchivos(e.target.files)} 
        className="hidden" 
      />
    </label>
  </div>

  {previews.length > 0 && (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-4">
      {previews.map((preview, index) => (
        <div key={index} className="relative group aspect-square overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <img src={preview} alt={`Prenda ${index + 1}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <button
            type="button"
            onClick={() => quitarArchivo(index)}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      ))}
    </div>
  )}
</div>

        <button
          type="submit"
          className="w-full rounded-xl bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          Crear producto
        </button>
      </form>
    </div>
  );
}