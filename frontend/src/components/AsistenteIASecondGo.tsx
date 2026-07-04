'use client';

import { useMemo, useState } from 'react';

type Producto = {
  id?: string;
  id_producto?: string;
  nombre?: string;
  nombre_producto?: string;
  descripcion?: string;
  descripcion_producto?: string;
  color?: string;
  color_producto?: string;
  talla?: string;
  talla_producto?: string;
  estilo?: string;
  estilo_producto?: string;
  categoria?: string;
  tipo_prenda?: string;
  foto?: string;
  fotos?: string[];
  estado?: string;
  estado_producto?: string;
};

type Props = {
  productoBase: Producto;
  productos: Producto[];
};

const estilos = ['Casual', 'Formal', 'Deportivo', 'Básicos'];

function obtenerValor(producto: Producto, campos: string[]) {
  for (const campo of campos) {
    const valor = producto[campo as keyof Producto];
    if (typeof valor === 'string' && valor.trim() !== '') return valor;
  }

  return '';
}

function normalizar(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function generarTextoIA(producto: Producto, estiloSeleccionado: string) {
  const nombre = obtenerValor(producto, ['nombre_producto', 'nombre']) || 'esta prenda';
  const color = obtenerValor(producto, ['color_producto', 'color']) || 'un tono neutro';
  const talla = obtenerValor(producto, ['talla_producto', 'talla']) || 'talla disponible';

  if (estiloSeleccionado === 'Formal') {
    return `Este look sería genial para una salida elegante o una presentación. Puedes usar ${nombre} en color ${color} como prenda principal, combinarla con piezas neutras y cerrar el outfit con zapatos más estructurados. La talla registrada es ${talla}.`;
  }

  if (estiloSeleccionado === 'Deportivo') {
    return `Este outfit puede funcionar muy bien para un estilo cómodo y activo. ${nombre} en color ${color} se puede combinar con prendas ligeras, zapatillas y accesorios sencillos para un look relajado pero funcional.`;
  }

  if (estiloSeleccionado === 'Básicos') {
    return `Esta prenda puede ser una base muy útil para tu armario. ${nombre} en ${color} combina fácil con jeans, camisetas lisas, chaquetas neutras o zapatillas. Es ideal para crear varios outfits sin complicarte.`;
  }

  return `Este look quedaría genial para el día a día. ${nombre} en color ${color} puede combinarse con prendas cómodas, denim, zapatillas o una chaqueta ligera para mantener un estilo casual, sostenible y fácil de usar.`;
}

function obtenerImagen(producto: Producto) {
  if (producto.fotos && producto.fotos.length > 0) return producto.fotos[0];
  if (producto.foto) return producto.foto;
  return '';
}

export default function AsistenteIASecondGo({ productoBase, productos }: Props) {
  const [estiloSeleccionado, setEstiloSeleccionado] = useState('Casual');

  const colorBase = obtenerValor(productoBase, ['color_producto', 'color']);
  const tallaBase = obtenerValor(productoBase, ['talla_producto', 'talla']);
  const nombreBase = obtenerValor(productoBase, ['nombre_producto', 'nombre']);
  const categoriaBase = obtenerValor(productoBase, ['categoria', 'tipo_prenda']);

  const similares = useMemo(() => {
    const nombre = normalizar(nombreBase);
    const color = normalizar(colorBase);
    const talla = normalizar(tallaBase);
    const categoria = normalizar(categoriaBase);
    const estilo = normalizar(estiloSeleccionado);

    return productos
      .filter((p) => {
        const idBase = productoBase.id || productoBase.id_producto;
        const idProducto = p.id || p.id_producto;

        if (idBase && idProducto && idBase === idProducto) return false;

        const texto = normalizar(
          [
            obtenerValor(p, ['nombre_producto', 'nombre']),
            obtenerValor(p, ['descripcion_producto', 'descripcion']),
            obtenerValor(p, ['color_producto', 'color']),
            obtenerValor(p, ['talla_producto', 'talla']),
            obtenerValor(p, ['categoria', 'tipo_prenda']),
            obtenerValor(p, ['estilo_producto', 'estilo']),
          ].join(' '),
        );

        return (
          (color && texto.includes(color)) ||
          (talla && texto.includes(talla)) ||
          (categoria && texto.includes(categoria)) ||
          (estilo && texto.includes(estilo)) ||
          (nombre && texto.includes(nombre.split(' ')[0]))
        );
      })
      .slice(0, 4);
  }, [productos, productoBase, colorBase, tallaBase, nombreBase, categoriaBase, estiloSeleccionado]);

  const textoIA = generarTextoIA(productoBase, estiloSeleccionado);

  return (
    <section className="mt-8 rounded-3xl border border-green-100 bg-white p-6 shadow-lg">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-green-900">
            Asistente de outfits SecondGo
          </h2>
          <p className="mt-1 text-sm text-green-700">
            Recomendaciones inteligentes basadas en color, talla, estilo y tipo de prenda.
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
          IA conceptual
        </div>
      </div>

      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-green-900">
          Escoge el estilo que quieres armar
        </label>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {estilos.map((estilo) => (
            <button
              key={estilo}
              type="button"
              onClick={() => setEstiloSeleccionado(estilo)}
              className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                estiloSeleccionado === estilo
                  ? 'border-green-700 bg-green-700 text-white'
                  : 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100'
              }`}
            >
              {estilo}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-green-50 p-5">
        <p className="text-sm font-semibold text-green-900">Sugerencia generada</p>
        <p className="mt-2 text-sm leading-6 text-gray-700">{textoIA}</p>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-lg font-bold text-green-900">
          Prendas parecidas para combinar
        </h3>

        {similares.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-green-200 p-5 text-sm text-gray-600">
            No hay suficientes prendas similares todavía. Carga productos con nombres como:
            <span className="ml-1 font-semibold text-green-800">
              1_camisa_blanco_casual
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similares.map((producto, index) => {
              const imagen = obtenerImagen(producto);
              const nombre = obtenerValor(producto, ['nombre_producto', 'nombre']) || 'Prenda sugerida';
              const color = obtenerValor(producto, ['color_producto', 'color']) || 'Sin color';
              const talla = obtenerValor(producto, ['talla_producto', 'talla']) || 'Sin talla';

              return (
                <article
                  key={(producto.id || producto.id_producto || index).toString()}
                  className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm"
                >
                  {imagen ? (
                    <img src={imagen} alt={nombre} className="h-36 w-full object-cover" />
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-green-100 text-sm text-green-800">
                      Sin imagen
                    </div>
                  )}

                  <div className="p-3">
                    <h4 className="line-clamp-1 font-semibold text-green-900">
                      {nombre}
                    </h4>
                    <p className="mt-1 text-xs text-gray-600">
                      {color} · {talla}
                    </p>
                    <p className="mt-2 text-xs text-green-700">
                      Combina con estilo {estiloSeleccionado.toLowerCase()}.
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}