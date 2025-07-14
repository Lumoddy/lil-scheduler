import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function AskToGetExamples()
{
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Text>AskToGetExamples</Text>
            <Link replace href="/welcome-sequence/WelcomeEnd">
                <Text>Yes</Text>
            </Link>
            <Link replace href="/welcome-sequence/WelcomeEnd">
                <Text>No</Text>
            </Link>
        </View>
    )
}