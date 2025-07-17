import { ThemedText } from "@/components/ThemedText";
import { ThemeColors } from "@/constants/ThemeColors";
import { appConfig, FirebaseAppContext } from "@/contexts/Firebase";
import { UserDataContext } from "@/contexts/UserData";
import { Stack } from "expo-router";
import { initializeApp } from "firebase/app";

export default function()
{
    return (
        <UserDataContext value={
            {
                
            }}>
            <FirebaseAppContext value={initializeApp(appConfig)}>
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