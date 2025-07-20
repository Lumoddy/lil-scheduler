import { Group } from "@/components/Flex";
import { ThemedCalendarMonth } from "@/components/ThemedCalendar";
import { themedHeader, themedHeaderButton } from "@/components/ThemedHeader";
import { ThemeColors } from "@/constants/ThemeColors";
import { CalenderStateContext } from "@/contexts/CalendarState";
import { Stack, useRouter } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import { FlatList } from "react-native";

export default function()
{
    const { date: [date, setDate] } = useContext(CalenderStateContext)!;

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
                header: themedHeader(),
                headerLeft: themedHeaderButton(
                    "Today",
                    {
                        onPress()
                        {
                            setDate(new Date());

                            useRouter()
                                .dismissTo("/(tabs)/Calendar/Day");
                        },
                    }),
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