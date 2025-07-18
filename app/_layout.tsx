import { ThemedText } from "@/components/ThemedText";
import { ThemeColors } from "@/constants/ThemeColors";
import { BackgroundPressable } from "@/contexts/BackgroundPressable";
import { FirebaseAppContext, firebaseAppOptions } from "@/contexts/Firebase";
import { UserDataContext } from "@/contexts/UserData";
import { defaultAppName, FirebaseApp, getApps, initializeApp } from "@/library/FirebaseMerge/App";
import { NativeFirestore, WebFirestore } from "@/library/FirebaseMerge/Firestore";
import { nativeOrWeb } from "@/library/PlatformExtensions";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function()
{
    const [app, setApp] = useState<FirebaseApp>();
    useEffect(() =>
    {
        if (!getApps().some((app) => app.name === defaultAppName))
        {
            initializeApp(firebaseAppOptions, defaultAppName).then(async (app) =>
            {
                await nativeOrWeb(
                {
                    native: NativeFirestore.initializeFirestore,
                    web: WebFirestore.initializeFirestore,
                })(app, {});

                setApp(app);
            });
        }
    });

    return (
        <UserDataContext value={
            {
                
            }}>
            <FirebaseAppContext value={app}>
                <BackgroundPressable>
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
                </BackgroundPressable>
            </FirebaseAppContext>
        </UserDataContext>
    );
}