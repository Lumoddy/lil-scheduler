import { CalenderStateContext } from "@/contexts/CalendarState";
import { useRouter } from "expo-router";
import { RefAttributes, useContext } from "react";
import { View, ViewStyle } from "react-native";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

export interface ThemedCalendarDayProps
    extends RefAttributes<View>
{
    date: Date;
    styleOverride: ViewStyle;
}

export function ThemedCalendarDay(
{
    date,
    styleOverride,
    ...rest
}
: ThemedCalendarDayProps)
{
    const { date: [contextDate, setContextDate] }
        = useContext(CalenderStateContext)!;

    return <ThemedButton
        {
            ...contextDate.getDate() === date.getDate()
            && contextDate.getMonth() === date.getMonth()
            && contextDate.getFullYear() === date.getFullYear()
                ? { style: "fill", color: "bold", size: "small" }
                : { style: "fill", color: "more", size: "small" }
        }
        styleOverride={styleOverride}
        children={date.getDate()}
        onPress={() =>
        {
            setContextDate(date);

            useRouter().dismissTo("/(tabs)/Calendar/Day");
        }}
        {...rest}/>;
}

export interface ThemedCalendarMonthProps
    extends RefAttributes<View>
{
    date: Date;
}

export function ThemedCalendarMonth(
{
    date,
    ...rest
}
: ThemedCalendarMonthProps)
{
    const year = date.getFullYear();
    const month = date.getMonth();

    const days: (number | undefined)[][] = [];

    for (let day = 1, i = new Date(year, month, day), week = 0, lastWeekDay = -1;
        i.getMonth() === month;
        i.setDate(++day))
    {
        const weekDay = i.getDay();

        if (weekDay < lastWeekDay)
            ++week;

        days[week] ??= new Array(7).fill(undefined);
        days[week][weekDay] = day;

        lastWeekDay = weekDay;
    }

    return (
        <View {...rest}>
            <ThemedText
                type="header2"
                centered={false}
                children={new Date(year, month, 1)
                    .toLocaleString("default", { month: "long" })}/>
            <View
                style={
                {
                    gap: 8,
                }}>
                {
                    days.map((week, weekKey) => <View
                        key={weekKey}
                        style={
                        {
                            marginInline: 16,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 4,
                        }}>
                        {
                            week.map((day, dayKey) => day
                                ? <ThemedCalendarDay
                                    key={dayKey}
                                    date={new Date(year, month, day)}
                                    styleOverride={
                                    {
                                        margin: 0,
                                        width: 42,
                                        height: 42,
                                    }}/>
                                : <View
                                    key={dayKey}
                                    style={
                                    {
                                        margin: 0,
                                        width: 42,
                                        height: 42,
                                    }}/>)
                        }
                    </View>)
                }
            </View>
        </View>
    );
}