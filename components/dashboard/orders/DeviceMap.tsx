import { Circle, MapContainer, TileLayer } from 'react-leaflet';

interface DeviceMapProps {
  longitude: number;
  latitude: number;
}

function DeviceMap({ longitude, latitude }: DeviceMapProps): JSX.Element {
  return (
    <MapContainer
      className="h-64 w-64"
      center={[latitude, longitude]}
      zoom={10}
      zoomControl={false}
      scrollWheelZoom={false}
      touchZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Circle center={[latitude, longitude]} pathOptions={{ fillColor: 'blue' }} radius={3000} />
    </MapContainer>
  );
}

export default DeviceMap;
