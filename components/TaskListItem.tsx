import { Color } from "@/library/Color";
import { TaskDefinition } from "@/library/Task";
import { Pressable, PressableProps, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

export interface TaskListItemProps
    extends Omit<PressableProps, "children">
{
    task: TaskDefinition,
}

export function TaskListItem(
{
    task,
    ...rest
}
: TaskListItemProps)
{
    return (
        <Pressable
            style={StyleSheet.flatten<ViewStyle>(
            [
                _taskListItemStyle.container,
                {
                    backgroundColor: Color.blendHex(
                        task.color,
                        new Color(1, 1, 1, 0.2),
                        "*"),
                },
            ])}
            {...rest}>
            <View
                style={StyleSheet.flatten<ViewStyle>(
                [
                    _taskListItemStyle.paddingLine,
                    {
                        backgroundColor: task.color,
                    },
                ])}/>
            <View style={_taskListItemStyle.contentContainer}>
                <Text
                    style={StyleSheet.flatten<TextStyle>(
                    [
                        _taskListItemStyle.title,
                        {
                            color: task.color,
                        },
                    ])}
                    children={task.title}/>
                <Text
                    style={StyleSheet.flatten<TextStyle>(
                    [
                        _taskListItemStyle.description,
                        {
                            color: task.color,
                        },
                    ])}
                    children={task.description}/>
                {
                    task.attributes.map((attribute) =>
                    {
                        let text;

                        switch (attribute.type)
                        {
                            case "duration":
                                text = `- Lasts ${attribute.durationTicks / 60000} minutes`;
                                break;
                            case "fixed-date":
                                text = `- ${attribute.date.toLocaleDateString()}`;
                                break;
                            case "priority":
                                text = `- ${["Low", "High", "Highest"][attribute.priority]} Priority`;
                                break;
                        }

                        return (
                            <Text
                                style={StyleSheet.flatten<TextStyle>(
                                [
                                    _taskListItemStyle.title,
                                    {
                                        color: Color.blendHex(
                                            task.color,
                                            new Color(1, 1, 1, 0.6),
                                            "*"),
                                    },
                                ])}
                                children={text}/>
                        );
                    })
                }
            </View>
        </Pressable>
    );
}

const _taskListItemStyle = StyleSheet.create(
{
    container:
    {
        padding: 3,
        borderRadius: 4,
        flexDirection: "row",
        gap: 10,
    },
    paddingLine:
    {
        width: 3,
        height: 24,
        borderRadius: 4,
    },
    contentContainer:
    {
        flex: 1,
    },
    title:
    {
        fontSize: 20,
        fontWeight: "600",
    },
    description:
    {
        fontSize: 14,
        fontWeight: "400",
    },
    attribute:
    {
        fontSize: 16,
        fontWeight: "400",
    },
});