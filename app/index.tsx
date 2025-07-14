import { AppDataContext as AppStateContext } from "@/contexts/AppStateContext";
import { Link } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";

export default function Index()
{
    const appState = useContext(AppStateContext);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Text>Edit app/index.tsx to edit this screen.</Text>
            <Link href="/"><Text>Normal</Text></Link>
            <Link href="/" replace><Text>Replace</Text></Link>
            <Link href="/" push><Text>Push</Text></Link>
            <Link replace href="/welcome-sequence/WelcomeBegin"><Text>Start</Text></Link>
        </View>
    );
}