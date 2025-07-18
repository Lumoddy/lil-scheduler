import { Group } from "@/components/Flex";
import { themedHeader } from "@/components/ThemedHeader";
import { ThemeColors } from "@/constants/ThemeColors";
import { Stack } from "expo-router";

export default function()
{
    return (
        <Group>
            <Stack.Screen options={
            {
                contentStyle:
                {
                    backgroundColor: ThemeColors.background,
                },
                headerLargeTitle: true,
                title: "Tasks",
                header: themedHeader(),
            }}/>
            
        </Group>
    );
}