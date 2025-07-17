import { Group } from "@/components/Flex";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedCalendarMonth } from "@/components/ThemedCalendar";
import { ThemeColors } from "@/constants/ThemeColors";
import { CalenderStateContext } from "@/contexts/CalendarState";
import { Stack, useRouter } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import { Button, FlatList, Platform } from "react-native";

export default function()
{
    const { date: [date, setDate] }
        = useContext(CalenderStateContext)!;

    const scrollView = useRef<FlatList<Date>>(undefined!);

    useEffect(() =>
    {
        scrollView.current.scrollToItem(
        {
            item: new Date(year, date.getMonth()),
        });
    },
    [scrollView]);

    const year = date.getFullYear();

    return (
        <Group>
            <Stack.Screen options={
            {
                contentStyle:
                {
                    backgroundColor: ThemeColors.background,
                },
                headerLargeTitle: true,
                title: "Calender",
                headerTitleAlign: "center",
                headerLeft()
                {
                    switch (Platform.OS)
                    {
                        case "ios":
                            return <Button
                                title="Today"
                                color={ThemeColors.bold}
                                onPress={() =>
                                {
                                    setDate(new Date());

                                    useRouter()
                                        .dismissTo("/(tabs)/Calendar/Day");
                                }}/>;
                        default:
                            return <ThemedButton
                                children="Today"
                                style="textonly"
                                color="bold"
                                size="small"
                                onPress={() =>
                                {
                                    setDate(new Date());

                                    useRouter()
                                        .dismissTo("/(tabs)/Calendar/Day");
                                }}/>;
                    }
                },
            }}/>
            <FlatList<Date>
                ref={scrollView}
                data={new Array(12).fill(0).map((_, i) => new Date(year, i))}
                style={{ flex: 1 }}
                renderItem={(data) => <ThemedCalendarMonth date={data.item}/>}
                keyExtractor={(data) => data.getTime().toString()}>
            </FlatList>
        </Group>
    );
}