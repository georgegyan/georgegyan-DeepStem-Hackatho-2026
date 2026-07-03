import { useEffect, useState } from "react";
import { getCurrentLocation } from "../services/locationService";

export default function useLocation() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    async function fetchLocation() {
      const coords = await getCurrentLocation();
      setLocation(coords);
    }

    fetchLocation();
  }, []);

  return location;
}