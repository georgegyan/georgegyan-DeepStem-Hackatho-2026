import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

import UserMarker from "./UserMarker";
import DestinationPin from "./DestinationPin";

function MapClickHandler({ setDestination }) {
  useMapEvents({
    click(e) {
      setDestination({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
}

export default function MapView({ location }) {
  const [destination, setDestination] = useState(null);

  if (!location) {
    return <h2>Getting your location...</h2>;
  }

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <UserMarker position={location} />

      <DestinationPin destination={destination} />

      <MapClickHandler setDestination={setDestination} />
    </MapContainer>
  );
}