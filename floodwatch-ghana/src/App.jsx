import useLocation from "./hooks/useLocation";
import Dashboard from "./pages/Dashboard";
import FloodProvider from "./context/FloodContext";

function App() {
  useLocation();

  return (
    <FloodProvider>
      <Dashboard />
    </FloodProvider>
  );
}

export default App;