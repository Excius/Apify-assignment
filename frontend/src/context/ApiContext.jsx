import React, { createContext, useState } from "react";

export const ApiContext = createContext();

export function ApiContextProvider({ children }) {
  const [apiKey, setApiKey] = useState(null);
  return (
    <ApiContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiContext.Provider>
  );
}
