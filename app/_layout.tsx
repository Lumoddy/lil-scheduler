import { AppDataContext } from "@/contexts/AppStateContext";
import { appConfig, FirebaseAppContext } from "@/contexts/Firebase";
import { Stack } from "expo-router";
import { initializeApp } from "firebase/app";

export default function()
{
    return (
        <FirebaseAppContext value={initializeApp(appConfig)}>
            <AppDataContext value={{ data: undefined }}>
                <Stack/>
            </AppDataContext>
        </FirebaseAppContext>
    );
}