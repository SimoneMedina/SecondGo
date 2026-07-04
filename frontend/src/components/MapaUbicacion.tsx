'use client';

import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  latitud: number;
  longitud: number;
  onChange: (latitud: number, longitud: number) => void;
};

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickMapa({ onChange }: { onChange: Props['onChange'] }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function MapaUbicacion({ latitud, longitud, onChange }: Props) {
  return (
    <div className="h-72 overflow-hidden rounded-2xl border border-green-200">
      <MapContainer center={[latitud, longitud]} zoom={13} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitud, longitud]} icon={icon} />
        <ClickMapa onChange={onChange} />
      </MapContainer>
    </div>
  );
}