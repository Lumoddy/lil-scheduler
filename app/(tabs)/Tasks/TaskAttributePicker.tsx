import { Group } from "@/components/Flex";
import { ThemedButton } from "@/components/ThemedButton";
import { themedHeader } from "@/components/ThemedHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColors } from "@/constants/ThemeColors";
import { UserDataContext } from "@/contexts/UserData";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useMemo } from "react";
import { View } from "react-native";
import { addAttributeIndex, pickerOptions } from "./TaskDetails";

export default function()
{
    const
    {
        "task-id": taskId,
        "selection": selection,
    }
    = useLocalSearchParams<{ "task-id"?: string, "selection"?: string }>();

    const selectionChecklist = useMemo(
        () =>
        {
            if (!selection)
                return {};

            const checklist: { [K in number]?: true } = {};
            for (const index of selection?.split("-"))
                checklist[Number(index)] = true;

            return checklist;
        },
        [selection]);

    const userData = useContext(UserDataContext);

    if (userData === undefined
        || userData.tasks === undefined
        || taskId === undefined
        || userData.tasks[Number(taskId)] === undefined)
        return (
            <Group>
                <Stack.Screen options={
                {
                    contentStyle:
                    {
                        backgroundColor: ThemeColors.background,
                    },
                    headerLargeTitle: true,
                    title: "Add Attribute",
                    header: themedHeader(),
                    headerBackTitle: "Back",
                }}/>
                <ThemedText
                    type="error"
                    children="Invalid task id."/>
            </Group>
        );

    const router = useRouter();

    return (
        <Group>
            <Stack.Screen options={
            {
                contentStyle:
                {
                    backgroundColor: ThemeColors.background,
                },
                headerLargeTitle: true,
                title: "Add Attribute",
                header: themedHeader(),
                headerBackTitle: "Cancel",
            }}/>
            <View
                style={
                {
                    paddingInline: 24,
                    gap: 8,
                }}>
                {
                    pickerOptions.map((option, i) =>
                    {
                        if (!selectionChecklist[i])
                            return undefined;

                        if (option.alreadyAdded !== undefined
                            && userData.tasks![Number(taskId)].attributes
                                .some(option.alreadyAdded))
                            return undefined;

                        return (
                            <ThemedButton
                                onPress={() =>
                                {
                                    addAttributeIndex.current = i;
                                    router.back();
                                }}
                                style="fill"
                                children={option.name}/>
                        );
                    })
                }
            </View>
        </Group>
    );
}