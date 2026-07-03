import { Marker, Popup } from "react-leaflet";

export default function DestinationPin({ destination }) {
  if (!destination) return null;

  return (
    <Marker position={[destination.lat, destination.lng]}>
      <Popup>
        Destination Selected
        <br />
        Lat: {destination.lat}
        <br />
        Lng: {destination.lng}
      </Popup>
    </Marker>
  );
}