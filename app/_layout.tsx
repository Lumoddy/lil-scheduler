import { ThemedText } from "@/components/ThemedText";
import { ThemeColors } from "@/constants/ThemeColors";
import { FirebaseAppContext, firebaseAppOptions } from "@/contexts/Firebase";
import { UserDataContext } from "@/contexts/UserData";
import { defaultAppName, FirebaseApp, getApps, initializeApp } from "@/library/FirebaseMerge/App";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import 'setimmediate';

export default function()
{
    const [app, setApp] = useState<FirebaseApp>();
    useEffect(() =>
    {
        if (!getApps().some((app) => app.name === defaultAppName))
            initializeApp(firebaseAppOptions, defaultAppName).then(setApp);
    });

    return (
        <UserDataContext value={
            {
                
            }}>
            <FirebaseAppContext value={app}>
                <Stack
                    screenOptions={
                    {
                        contentStyle:
                        {
                            backgroundColor: ThemeColors.background,
                            userSelect: "none",
                        },
                        header: () => <ThemedText type="header1">Test</ThemedText>,
                    }}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
                </Stack>
            </FirebaseAppContext>
        </UserDataContext>
    );
}