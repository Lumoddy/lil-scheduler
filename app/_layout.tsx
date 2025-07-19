import { ThemedText } from "@/components/ThemedText";
import { ThemeColors } from "@/constants/ThemeColors";
import { BackgroundPressable } from "@/contexts/BackgroundPressable";
import { FirebaseAppContext, firebaseAppOptions, FirebaseAuthContext, FirebaseFirestoreContext } from "@/contexts/Firebase";
import { MergeContext } from "@/contexts/MergeContext";
import { UserData, UserDataContext } from "@/contexts/UserData";
import { defaultAppName, FirebaseApp, firebaseAppImport } from "@/library/FirebaseMerge/App";
import { FirebaseAuth, firebaseAuthImport } from "@/library/FirebaseMerge/Auth";
import { FirebaseFirestore, firebaseFirestoreImport } from "@/library/FirebaseMerge/Firestore";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";

export default function()
{
    const [tasks, setTasks] = useState<UserData["tasks"]>();
    const userData = useMemo<UserData>(
        () => (
        {
            tasks,
            setTasks,
        }),
        [tasks]);

    return (
        <MergeContext
            contexts={
            [
                UserDataContext,
                FirebaseAppContext,
                FirebaseAuthContext,
                FirebaseFirestoreContext,
            ]}
            values={
            [
                userData,
                app,
                auth,
                firestore,
            ]}>
            <BackgroundPressable>
                <Stack
                    screenOptions={
                    {
                        contentStyle:
                        {
                            backgroundColor: ThemeColors.background,
                            userSelect: "none",
                        },
                        header: () =>
                            <ThemedText type="header1" children="Test"/>,
                    }}>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}/>
                </Stack>
            </BackgroundPressable>
        </MergeContext>
    );
}

const _initializeApp = firebaseAppImport(
{
    native: (n) => n.initializeApp,
    web: (n) => async (...args: Parameters<typeof n.initializeApp>) => n.initializeApp(...args),
});

const _initializeAuth = firebaseAuthImport("initializeAuth");

const _initializeFirestore = firebaseFirestoreImport(
{
    native: (n) => n.initializeFirestore,
    web: (n) => async (...args: Parameters<typeof n.initializeFirestore>) => n.initializeFirestore(...args),
});

let app: FirebaseApp | undefined;
let auth: FirebaseAuth | undefined;
let firestore: FirebaseFirestore | undefined;

_initializeApp(firebaseAppOptions, defaultAppName).then((newApp) =>
{
    app = newApp;
    auth = _initializeAuth(newApp);
    _initializeFirestore(newApp, {})
        .then((newFirestore) => firestore = newFirestore);
});