import { TaskDefinition } from "@/library/Task";
import { View, ViewProps } from "react-native";

export interface TaskListItemProps
    extends Omit<ViewProps, "children">
{
    task: TaskDefinition,
    onPress: (task: TaskDefinition) => void,
}

export function TaskListItem(props: TaskListItemProps)
{
    return (
        <View>
            
        </View>
    );
}