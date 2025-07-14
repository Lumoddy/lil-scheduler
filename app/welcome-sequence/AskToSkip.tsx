import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function AskToSkip()
{
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Text>AskToSkip</Text>
            <Link replace href="/welcome-sequence/AskToLogin">
                <Text>Continue</Text>
            </Link>
            <Link replace href="/welcome-sequence/WelcomeEnd">
                <Text>Skip</Text>
            </Link>
        </View>
    )
}