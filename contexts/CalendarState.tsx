import { UseStatePair } from "@/library/ReactExtensions";
import { createContext } from "react";

export interface CalenderState
{
    date: UseStatePair<Date>;
}

export const CalenderStateContext
    = createContext<CalenderState | undefined>(undefined);