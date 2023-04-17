import { createContext, useContext, useState } from "react";

const Context = createContext(null);

export default function LoggerProvider({ children }) {
    const [logger, setLogger] = useState(null);

    return <Context.Provider value={{ logger, setLogger }}>{children}</Context.Provider>
}

export function useLogger() {
    return useContext(Context);
}