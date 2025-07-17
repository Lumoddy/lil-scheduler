import { Group } from "@/components/Flex";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemeColors } from "@/constants/ThemeColors";
import { CalenderStateContext } from "@/contexts/CalendarState";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";
import { Button, Platform } from "react-native";

export default function()
{
    const calenderState = useContext(CalenderStateContext);

    if (calenderState === undefined)
        throw new Error("CalenderStateContext is not defined.");

    const {
        date: [date],
    } = calenderState;

    return (
        <Group>
            <Stack.Screen options={
            {
                contentStyle:
                {
                    backgroundColor: ThemeColors.background,
                },
                title: date.toLocaleString(
                    "default",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }),
                headerRight()
                {
                    switch (Platform.OS)
                    {
                        case "ios":
                            return <Button
                                title="Calender"
                                color={ThemeColors.bold}
                                onPress={() => useRouter()
                                    .navigate("/(tabs)/Calendar/DatePicker")}/>
                        default:
                            return <ThemedButton
                                children="Calender"
                                style="textonly"
                                color="bold"
                                size="small"
                                onPress={() => useRouter()
                                    .navigate("/(tabs)/Calendar/DatePicker")}/>;
                    }
                },
            }}/>
        </Group>
    );
}