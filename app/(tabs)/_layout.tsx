import { CalenderStateContext } from "@/contexts/CalendarState";
import { Tabs } from "expo-router";
import { useState } from "react";

export default function()
{
    return (
        <CalenderStateContext value={
            {
                date: useState(new Date()),
            }}>
            <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen/>
            </Tabs>
        </CalenderStateContext>
    );
}