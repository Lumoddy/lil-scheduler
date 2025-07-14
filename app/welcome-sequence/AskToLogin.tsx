import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function AskToLogin()
{
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Text>AskToSkip</Text>
            <Link href="/">
                <Text>Login</Text>
            </Link>
            <Link replace href="/welcome-sequence/WelcomeEnd">
                <Text>Skip</Text>
            </Link>
        </View>
    )
}