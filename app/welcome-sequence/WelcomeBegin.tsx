import { Redirect } from "expo-router";

export default function WelcomeBegin()
{
    return <Redirect href="/welcome-sequence/AskToSkip"/>;
}