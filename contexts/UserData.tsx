import { TaskDefinition } from "@/library/Task";
import { createContext } from "react";

export interface UserData
{
    tasks?: TaskDefinition[];
}

export const UserDataContext = createContext<UserData | undefined>(undefined);