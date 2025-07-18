import { Group } from "@/components/Flex";
import { ThemedButton } from "@/components/ThemedButton";
import { themedHeader, themedLogoTag } from "@/components/ThemedHeader";
import { ThemedLink } from "@/components/ThemedLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { FirebaseAppContext } from "@/contexts/Firebase";
import { Auth, getAuth, NativeAuth, WebAuth } from "@/library/FirebaseMerge/Auth";
import { nativeOrWeb } from "@/library/PlatformExtensions";
import { Stack, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

export default function()
{
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const app = useContext(FirebaseAppContext);
    const [auth, setAuth] = useState<Auth>();
    useEffect(() => setAuth(() => getAuth(app)), [app]);

    const [lockUI, setLockUI] = useState(false);

    return (
        <Group>
            <Stack.Screen
                options={
                {
                    header: themedHeader({ lockUI }),
                    headerTitle: themedLogoTag("faded-text"),
                }}/>
            <ThemedText type="header1" children="Login"/>
            <ScrollView
                contentContainerStyle={
                {
                    marginBlock: "auto",
                    paddingBottom: 120,
                    alignItems: "stretch",
                    gap: 64,
                }}>
                <View
                    style={
                    {
                        maxWidth: 400,
                        marginInline: 48,
                    }}>
                    <ThemedText
                        type="label"
                        children="Email"/>
                    <ThemedTextField
                        style="outline"
                        autoComplete="username"
                        onChangeText={setEmailInput}
                        placeholder="name@domain.com"/>
                    <ThemedText
                        type="label"
                        children="Password"/>
                    <ThemedTextField
                        style="outline"
                        secureTextEntry
                        autoComplete="new-password"
                        onChangeText={setPasswordInput}
                        placeholder="password"/>
                </View>
                <View>
                    {
                        errorMessage === undefined ? undefined :
                        <ThemedText type="error" children={errorMessage}/>
                    }
                    <ThemedButton
                        onPress={() =>
                        {
                            if (auth === undefined)
                                throw new Error(
                                    "FirebaseAppContext must be initialized.");

                            setLockUI(true);

                            nativeOrWeb(
                            {
                                native: NativeAuth.signInWithEmailAndPassword,
                                web: WebAuth.signInWithEmailAndPassword,
                            })(
                                auth,
                                emailInput,
                                passwordInput)
                                .then(() =>
                                {
                                    const router = useRouter();
                                    if (router.canGoBack())
                                        router.back();
                                    else
                                        router.replace("/(tabs)/Calendar/Day");
                                })
                                .catch((error) =>
                                {
                                    setErrorMessage(error instanceof Error
                                        ? error.message
                                        : String(error));
                                })
                                .finally(() =>
                                {
                                    setLockUI(false);
                                });
                        }}
                        style="fill"
                        color="bold"
                        size="large"
                        disabled={lockUI
                            || !/@/.test(emailInput)
                            || passwordInput.length === 0}
                        styleOverride={
                        {
                            maxWidth: 400,
                            marginInline: 32,
                        }}
                        children="Login"/>
                    <ThemedLink
                        replace
                        href="/Signup"
                        style="fill"
                        color="more"
                        size="small"
                        disabled={lockUI}
                        styleOverride={
                        {
                            maxWidth: 368,
                            marginInline: 48,
                        }}
                        children="Create account instead"/>
                </View>
            </ScrollView>
        </Group>
    );
}