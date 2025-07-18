import { ThemeColors } from "@/constants/ThemeColors";
import { Color } from "@/library/Color";
import { TaskAttribute } from "@/library/Task";
import { View, ViewProps } from "react-native";
import { Expand, Group, Row } from "./Flex";
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

export function TaskAttributeListItem(props: TaskAttributeListItemProps)
{
    let name, options;

    switch (props.attribute.type)
    {
        case "duration":
            name = "Duration";
            options = (
                <Group>
                    <ThemedTextField
                        style="outline"/>
                    <ThemedDropdown options={
                    [
                        { name: "Test1", value: 0 },
                        { name: "Test2", value: 1 },
                    ]}/>
                </Group>
            );
            break;
        case "fixed-date":
            name = "Fixed Date";
            options = (
                <Group>
                    <ThemedText
                        type="label"
                        children="date"/>
                    <ThemedTextField
                        style="outline"/>
                </Group>
            );
            break;
        case "priority":
            name = "Priority";
            options = (
                <Group>
                    <ThemedTextField
                        style="outline"/>
                </Group>
            );
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
                <ThemedText type="header3" children={name}/>
                <Expand/>
                <ThemedText type="header3" children={"v"}/>
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