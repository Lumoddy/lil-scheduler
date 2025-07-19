import { TaskDefinition } from "@/library/Task";
import { createContext, Dispatch, SetStateAction } from "react";

export interface UserData
{
    readonly tasks: TaskDefinition[] | undefined;
    setTasks: Dispatch<SetStateAction<TaskDefinition[] | undefined>>;
}

export const UserDataContext = createContext<UserData | undefined>(undefined);