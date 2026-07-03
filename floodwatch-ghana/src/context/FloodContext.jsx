/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const FloodContext = createContext();

export default function FloodProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);

  return (
    <FloodContext.Provider
      value={{
        location,
        setLocation,
        destination,
        setDestination,
      }}
    >
      {children}
    </FloodContext.Provider>
  );
}