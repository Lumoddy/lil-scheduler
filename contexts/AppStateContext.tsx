import { createContext } from "react";

export type AppData =
{
    
};

export const AppDataContext = createContext(
    { data: undefined as AppData | undefined });