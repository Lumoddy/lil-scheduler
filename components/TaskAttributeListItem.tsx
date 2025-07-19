import { ThemeColors } from "@/constants/ThemeColors";
import { Color } from "@/library/Color";
import { TaskAttribute, TaskDurationAttributeDefinition, TaskFixedDateAttributeDefinition, TaskPriorityAttributeDefinition } from "@/library/Task";
import { useState } from "react";
import { View, ViewProps } from "react-native";
import { Expand, Group, Row } from "./Flex";
import { ThemedButton } from "./ThemedButton";
import { ThemedDropdown } from "./ThemedDropdown";
import { ThemedText } from "./ThemedText";
import { ThemedTextField } from "./ThemedTextField";

export interface TaskAttributeListItemProps
    extends Omit<ViewProps, "children">
{
    attribute: TaskAttribute,
    onRemove?: (attribute: TaskAttribute) => void,
    onModify?: (attribute: TaskAttribute) => void,
}

export function TaskAttributeListItem(
{
    attribute,
    onRemove,
    onModify,
}
: TaskAttributeListItemProps)
{
    let name, options;

    switch (attribute.type)
    {
        case "duration":
            name = "Duration";
            options = <TaskDurationAttributeOptions
                onModify={onModify}
                attribute={attribute}/>
            break;
        case "fixed-date":
            name = "Fixed Date";
            options = <TaskFixedDateAttributeOptions
                onModify={onModify}
                attribute={attribute}/>
            break;
        case "priority":
            name = "Priority";
            options = <TaskPriorityAttributeOptions
                onModify={onModify}
                attribute={attribute}/>
            break;
    }

    return (
        <View
            style={
            {
                padding: 8,
                borderWidth: 2,
                borderRadius: 16,
                borderColor: Color.blendHex(Color.blend(Color.blend(
                    ThemeColors.more,
                    ThemeColors.more),
                    ThemeColors.more),
                    ThemeColors.more),
            }}>
            <Row>
                <ThemedText
                    type="header3"
                    children={name}/>
                <Expand/>
                <ThemedButton
                    onPress={() => onRemove?.(attribute)}
                    style="textonly"
                    color="more"
                    size="large"
                    children={"x"}/>
            </Row>
            <View
                style={
                {
                    marginInline: 24,
                    gap: 8,
                }}>
                {options}
            </View>
        </View>
    );
}

export interface TaskDurationAttributeOptionsProps
    extends Omit<ViewProps, "children">
{
    attribute: TaskDurationAttributeDefinition,
    onModify?: (attribute: TaskDurationAttributeDefinition) => void,
}

export function TaskDurationAttributeOptions(
{
    attribute,
    onModify,
}
: TaskDurationAttributeOptionsProps)
{
    const [durationText, setDurationText]
        = useState(attribute.durationTicks.toString());

    return (
        <Group>
            <ThemedTextField
                onChangeText={setDurationText}
                onBlur={() =>
                {
                    const durationTicks = Number.parseFloat(durationText);
                    setDurationText(durationTicks.toString());
                    onModify?.({ ...attribute, durationTicks });
                }}
                style="outline"
                value={durationText}/>
        </Group>
    );
}

export interface TaskFixedDateAttributeOptionsProps
    extends Omit<ViewProps, "children">
{
    attribute: TaskFixedDateAttributeDefinition,
    onModify?: (attribute: TaskFixedDateAttributeDefinition) => void,
}

export function TaskFixedDateAttributeOptions(
{
    attribute,
    onModify,
}
: TaskFixedDateAttributeOptionsProps)
{
    const [dateText, setDateText]
        = useState(attribute.date.toLocaleString());

    return (
        <Group>
            <ThemedTextField
                onChangeText={setDateText}
                onBlur={() =>
                {
                    const date = new Date(Date.parse(dateText));
                    setDateText(date.toLocaleString());
                    onModify?.({ ...attribute, date });
                }}
                style="outline"
                value={dateText}/>
        </Group>
    );
}

export interface TaskPriorityAttributeOptionsProps
    extends Omit<ViewProps, "children">
{
    attribute: TaskPriorityAttributeDefinition,
    onModify?: (attribute: TaskPriorityAttributeDefinition) => void,
}

export function TaskPriorityAttributeOptions(
{
    attribute,
    onModify,
}
: TaskPriorityAttributeOptionsProps)
{
    return (
        <Group>
            <ThemedDropdown
                onChange={(priority) => onModify?.({ ...attribute, priority })}
                options={
                [
                    { name: "Low", value: 0 },
                    { name: "High", value: 1 },
                    { name: "Highest", value: 2 },
                ]}
                value={attribute.priority}/>
        </Group>
    );
}