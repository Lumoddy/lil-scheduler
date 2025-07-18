import { Group } from "@/components/Flex";
import { themedHeader, themedHeaderButton } from "@/components/ThemedHeader";
import { ThemeColors } from "@/constants/ThemeColors";
import { CalenderStateContext } from "@/contexts/CalendarState";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";

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
                header: themedHeader(),
                headerRight: themedHeaderButton(
                    "Calender",
                    {
                        onPress()
                        {
                            useRouter()
                                .navigate("/(tabs)/Calendar/DatePicker");
                        },
                    }),
            }}/>
        </Group>
    );
}