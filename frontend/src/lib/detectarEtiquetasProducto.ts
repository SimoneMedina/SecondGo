export type EtiquetasProducto = {
  tipo_prenda: string;
  estilo_producto: string;
};

const tiposPrenda = [
  'camisa',
  'camiseta',
  'blusa',
  'pantalon',
  'pantalón',
  'jean',
  'falda',
  'vestido',
  'chaqueta',
  'saco',
  'sudadera',
  'short',
  'zapatos',
  'zapatillas',
  'tacones',
  'bolso',
  'accesorio',
];

const estilos = ['casual', 'formal', 'deportivo', 'basicos', 'básicos'];

function limpiarTexto(texto: string) {
  return texto
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function detectarEtiquetasProducto(texto: string): EtiquetasProducto {
  const limpio = limpiarTexto(texto);

  const tipo =
    tiposPrenda.find((tipoPrenda) =>
      limpio.includes(
        tipoPrenda
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
      ),
    ) || 'prenda';

  const estilo =
    estilos.find((estiloActual) =>
      limpio.includes(
        estiloActual
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
      ),
    ) || 'casual';

  return {
    tipo_prenda: tipo.replace('pantalón', 'pantalon'),
    estilo_producto:
      estilo === 'basicos' || estilo === 'básicos'
        ? 'Básicos'
        : estilo.charAt(0).toUpperCase() + estilo.slice(1),
  };
}
