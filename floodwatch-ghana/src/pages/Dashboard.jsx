import Navbar from "../components/Navbar/Navbar";
import MapView from "../components/Map/MapView";

export default function Dashboard() {
  return (
    <>
      <Navbar />

      <div
        style={{
          height: "calc(100vh - 70px)",
        }}
      >
        <MapView />
      </div>
    </>
  );
}