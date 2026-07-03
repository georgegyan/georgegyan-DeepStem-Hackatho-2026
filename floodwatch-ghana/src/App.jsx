import MapView from "./components/Map/MapView";
import useLocation from "./hooks/useLocation";

function App() {
  const location = useLocation();

  return <MapView location={location} />;
}

export default App;