import { Group } from "@/components/Flex";
import { ThemedButton } from "@/components/ThemedButton";
import { themedHeader, themedLogoTag } from "@/components/ThemedHeader";
import { ThemedLink } from "@/components/ThemedLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";

export default function()
{
    return (
        <Group>
            <Stack.Screen
                options={
                {
                    header: themedHeader(),
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
                        placeholder="name@domain.com"
                        autoComplete="username"/>
                    <ThemedText
                        type="label"
                        children="Password"/>
                    <ThemedTextField
                        style="outline"
                        placeholder="password"
                        autoComplete="new-password"/>
                </View>
                <View>
                    <ThemedButton
                        style="fill"
                        color="bold"
                        size="large"
                        styleOverride={
                        {
                            maxWidth: 400,
                            marginInline: 32,
                        }}
                        children="Login"/>
                    <ThemedLink
                        replace
                        href="/Signin"
                        style="fill"
                        color="more"
                        size="small"
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