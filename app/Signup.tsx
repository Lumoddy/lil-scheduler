import { Group } from "@/components/Flex";
import { ThemedButton } from "@/components/ThemedButton";
import { themedHeader, themedLogoTag } from "@/components/ThemedHeader";
import { ThemedLink } from "@/components/ThemedLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { FirebaseAppContext } from "@/contexts/Firebase";
import { Auth, getAuth, NativeAuth, WebAuth } from "@/library/FirebaseMerge/Auth";
import { nativeOrWeb } from "@/library/PlatformExtensions";
import { Stack, useNavigation } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

export default function()
{
    const [emailInput, setEmailInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const app = useContext(FirebaseAppContext);
    const [auth, setAuth] = useState<Auth>();
    useEffect(() => setAuth(() => getAuth(app)), [app]);

    return (
        <Group>
            <Stack.Screen
                options={
                {
                    header: themedHeader(),
                    headerTitle: themedLogoTag("faded-text"),
                }}/>
            <ThemedText type="header1" children="Create Account"/>
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

                            nativeOrWeb(
                            {
                                native: NativeAuth.createUserWithEmailAndPassword,
                                web: WebAuth.createUserWithEmailAndPassword,
                            })(
                                auth,
                                emailInput,
                                passwordInput)
                                .then(() =>
                                {
                                    useNavigation().goBack();
                                })
                                .catch((error) =>
                                {
                                    setErrorMessage(error instanceof Error
                                        ? error.message
                                        : String(error));
                                });
                        }}
                        style="fill"
                        color="bold"
                        size="large"
                        styleOverride={
                        {
                            maxWidth: 400,
                            marginInline: 32,
                        }}
                        children="Create Account"/>
                    <ThemedLink
                        replace
                        href="/Login"
                        style="fill"
                        color="more"
                        size="small"
                        styleOverride={
                        {
                            maxWidth: 368,
                            marginInline: 48,
                        }}
                        children="Login instead"/>
                </View>
            </ScrollView>
        </Group>
    );
}