import { ThemedText } from "@/components/ThemedText";
import { ThemeColors } from "@/constants/ThemeColors";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function()
{
    return (
        <Stack
            screenOptions={
            {
                headerStyle:
                {
                    backgroundColor: ThemeColors.background,
                },
                headerTransparent: false,
                headerTitleAlign: "center",
                headerTintColor: ThemeColors.text,
                headerTitle: (props) => <ThemedText
                    type="header2"
                    children={props.children}
                    styleOverride={
                    {
                        ...Platform.OS !== "ios" ? {} :
                        {
                            fontSize: 24,
                            marginTop: 0,
                        },
                    }}/>,
            }}/>
    );
}