import { Marker, Popup } from "react-leaflet";

export default function UserMarker({ position }) {
  return (
    <Marker position={[position.lat, position.lng]}>
      <Popup>
        <strong>Your Current Location</strong>
        <br />
        Latitude: {position.lat}
        <br />
        Longitude: {position.lng}
      </Popup>
    </Marker>
  );
}