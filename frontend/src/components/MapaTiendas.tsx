'use client';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

type TiendaMapa = {
  id: string;
  nombre: string;
  ubicacion?: string;
  latitud?: number | null;
  longitud?: number | null;
};

type Props = {
  tiendas: TiendaMapa[];
};

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapaTiendas({ tiendas }: Props) {
  const tiendasConUbicacion = tiendas.filter(
    (t) => typeof t.latitud === 'number' && typeof t.longitud === 'number',
  );

  const centro =
    tiendasConUbicacion.length > 0
      ? [tiendasConUbicacion[0].latitud!, tiendasConUbicacion[0].longitud!]
      : [-0.180653, -78.467834];

  return (
    <div className="h-80 overflow-hidden rounded-3xl border border-green-100 shadow-lg">
      <MapContainer center={centro as [number, number]} zoom={13} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {tiendasConUbicacion.map((tienda) => (
          <Marker
            key={tienda.id}
            position={[tienda.latitud!, tienda.longitud!]}
            icon={icon}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{tienda.nombre}</p>
                <p className="text-xs">{tienda.ubicacion}</p>
                <Link href={`/tiendas/${tienda.id}`} className="text-green-700 underline">
                  Ver tienda
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}