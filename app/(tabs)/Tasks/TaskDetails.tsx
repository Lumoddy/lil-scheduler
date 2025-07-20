import { Group } from "@/components/Flex";
import { TaskAttributeListItem } from "@/components/TaskAttributeListItem";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedDropdown } from "@/components/ThemedDropdown";
import { themedHeader, themedHeaderButton } from "@/components/ThemedHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextField } from "@/components/ThemedTextField";
import { ThemeColors } from "@/constants/ThemeColors";
import { FirebaseAuthContext, FirebaseFirestoreContext } from "@/contexts/Firebase";
import { UserDataContext } from "@/contexts/UserData";
import { NativeFirestore, WebFirestore } from "@/library/FirebaseMerge/Firestore";
import { over } from "@/library/IteratorExtensions";
import { nativeOrWebMap } from "@/library/PlatformExtensions";
import { TaskAttribute, TaskDefinition } from "@/library/Task";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

export const pickerOptions:
{
    name: string,
    alreadyAdded?(attribute: TaskAttribute): boolean,
    add(): TaskAttribute,
}[] =
[
    {
        name: "1 Hour Duration",
        alreadyAdded: (attribute) => attribute.type === "duration",
        add: () => ({ type: "duration", durationTicks: 3600000 }),
    },
    {
        name: "30 Minute Duration",
        alreadyAdded: (attribute) => attribute.type === "duration",
        add: () => ({ type: "duration", durationTicks: 1800000 }),
    },
    {
        name: "10 Minute Duration",
        alreadyAdded: (attribute) => attribute.type === "duration",
        add: () => ({ type: "duration", durationTicks: 600000 }),
    },

    {
        name: "Fixed Date",
        alreadyAdded: (attribute) => attribute.type === "fixed-date",
        add: () => ({ type: "fixed-date", date: new Date() }),
    },

    {
        name: "Low Priority",
        alreadyAdded: (attribute) => attribute.type === "priority",
        add: () => ({ type: "priority", priority: 0 }),
    },
    {
        name: "High Priority",
        alreadyAdded: (attribute) => attribute.type === "priority",
        add: () => ({ type: "priority", priority: 1 }),
    },
    {
        name: "Highest Priority",
        alreadyAdded: (attribute) => attribute.type === "priority",
        add: () => ({ type: "priority", priority: 2 }),
    },
];

// Can't pass data back! React sucks!
export let addAttributeIndex = { current: undefined as number | undefined };

export default function()
{
    const { "task-id": taskId } = useLocalSearchParams<{ "task-id"?: string }>();

    const userData = useContext(UserDataContext);

    do
    {
        if (userData !== undefined
            && userData.tasks !== undefined)
        {
            if (taskId !== undefined
                && userData.tasks[Number(taskId)] !== undefined)
                break;

            if (taskId === "new")
                break;
        }

        return (
            <Group>
                <Stack.Screen options={
                {
                    contentStyle:
                    {
                        backgroundColor: ThemeColors.background,
                    },
                    headerLargeTitle: true,
                    title: "Task",
                    header: themedHeader(),
                    headerBackTitle: "Back",
                }}/>
                <ThemedText
                    type="error"
                    children="Invalid task id."/>
            </Group>
        );
    }
    while (false);

    const firebaseAuth = useContext(FirebaseAuthContext);
    const firebaseFirestore = useContext(FirebaseFirestoreContext);
    const router = useRouter();

    const [taskTitle, setTaskTitle] = useState(() =>
        taskId === "new" ? "New Task" : userData.tasks![Number(taskId)].title);
    const [taskDescription, setTaskDescription] = useState(() =>
        taskId === "new" ? "" : userData.tasks![Number(taskId)].description);
    const [taskColor, setTaskColor] = useState(() =>
        taskId === "new" ? "#FFFFFF" : userData.tasks![Number(taskId)].color);
    const [taskAttributes, setTaskAttributes] = useState(() =>
        taskId === "new" ? [] : [...userData.tasks![Number(taskId)].attributes]);

    useEffect(
        () =>
        {
            if (addAttributeIndex.current === undefined)
                return;

            setTaskAttributes(
                taskAttributes.concat(
                    [pickerOptions[addAttributeIndex.current].add()]));

            addAttributeIndex.current = undefined;
        },
        [taskAttributes, addAttributeIndex.current]);

    return (
        <Group>
            <Stack.Screen options={
            {
                contentStyle:
                {
                    backgroundColor: ThemeColors.background,
                },
                headerLargeTitle: true,
                title: "Task",
                header: themedHeader(),
                headerBackTitle: "Cancel",
                headerRight: themedHeaderButton(
                    "Done",
                    {
                        onPress()
                        {
                            const copyListCopy = [...userData.tasks!];
                            copyListCopy[taskId === "new" ? copyListCopy.length : Number(taskId)] =
                            {
                                title: taskTitle,
                                description: taskDescription,
                                color: taskColor,
                                attributes: taskAttributes,
                            }

                            nativeOrWebMap(
                                [firebaseAuth!, firebaseFirestore!],
                                {
                                    async native([firebaseAuth, firebaseFirestore])
                                    {
                                        if (firebaseAuth.currentUser === null)
                                            throw new Error("");

                                        await NativeFirestore.updateDoc(
                                            NativeFirestore.doc(
                                                firebaseFirestore,
                                                `/users/${firebaseAuth.currentUser.uid}`),
                                            {
                                                "tasks": copyListCopy.map(TaskDefinition.toDocValue),
                                            });
                                    },

                                    async web([firebaseAuth, firebaseFirestore])
                                    {
                                        if (firebaseAuth.currentUser === null)
                                            return;

                                        await WebFirestore.updateDoc(
                                            WebFirestore.doc(
                                                firebaseFirestore,
                                                `/users/${firebaseAuth.currentUser.uid}`),
                                            {
                                                "tasks": copyListCopy.map(TaskDefinition.toDocValue),
                                            });
                                    },
                                })
                                .then(() =>
                                {
                                    userData.setTasks(copyListCopy);
                                    router.back();
                                })
                                .catch((e) =>
                                {
                                    alert("Failed to save task.");
                                    console.error(e);
                                });
                        },
                    }),
            }}/>
            <ScrollView
                contentContainerStyle={
                {
                    paddingBottom: 200,
                }}>
                <View
                    style={
                    {
                        paddingInline: 24,
                    }}>
                    <ThemedText
                        type="label"
                        children="Title"/>
                    <ThemedTextField
                        onChangeText={setTaskTitle}
                        style="outline"
                        placeholder="Title"
                        value={taskTitle}/>
                    <ThemedText
                        type="label"
                        children="Description"/>
                    <ThemedTextField
                        onChangeText={setTaskDescription}
                        style="outline"
                        placeholder="Description"
                        value={taskDescription}/>
                    <ThemedText
                        type="label"
                        children="Color"/>
                    <ThemedDropdown
                        onChange={setTaskColor}
                        style="outline"
                        color="more"
                        size="small"
                        options={
                        [
                            { name: "White", value: "#FFFFFF" },
                            { name: "Red", value: "#FF514B" },
                            { name: "Yellow", value: "#FFD426" },
                            { name: "Green", value: "#32E07A" },
                            { name: "Blue", value: "#4BA8FF" },
                        ]}
                        value={taskColor}/>
                </View>
                <ThemedText
                    type="header2"
                    children="Attributes"/>
                <View
                    style={
                    {
                        paddingInline: 24,
                        gap: 8,
                    }}>
                    {taskAttributes.map((attribute, i) => <TaskAttributeListItem
                        key={i}
                        onRemove={() => setTaskAttributes(taskAttributes.toSpliced(i, 1))}
                        onModify={(attribute) => setTaskAttributes(taskAttributes.toSpliced(i, 1, attribute))}
                        attribute={attribute}/>)}
                </View>
                <View
                    style={
                    {
                        paddingInline: 24,
                    }}>
                    <ThemedButton
                        onPress={() =>
                        {
                            router.push(`/(tabs)/Tasks/TaskAttributePicker${""
                                }?task-id=${taskId
                                }&selection=${over(pickerOptions)
                                    .map((option, i) => ({ option, i }))
                                    .filter((pair) => pair.option.alreadyAdded === undefined
                                        || !taskAttributes.some(pair.option.alreadyAdded))
                                    .map((pair) => pair.i)
                                    .join("-")}`);
                        }}
                        children="New Attribute"/>
                    <ThemedButton
                        styleOverride={
                        {
                            marginTop: 28,
                        }}
                        onPress={() =>
                        {
                            if (taskId === "new")
                            {
                                router.back();
                                return;
                            }

                            const copyListCopy = [...userData.tasks!];
                            copyListCopy.splice(Number(taskId), 1);

                            nativeOrWebMap(
                                [firebaseAuth!, firebaseFirestore!],
                                {
                                    async native([firebaseAuth, firebaseFirestore])
                                    {
                                        if (firebaseAuth.currentUser === null)
                                            throw new Error("");

                                        await NativeFirestore.updateDoc(
                                            NativeFirestore.doc(
                                                firebaseFirestore,
                                                `/users/${firebaseAuth.currentUser.uid}`),
                                            {
                                                "tasks": copyListCopy.map(TaskDefinition.toDocValue),
                                            });
                                    },

                                    async web([firebaseAuth, firebaseFirestore])
                                    {
                                        if (firebaseAuth.currentUser === null)
                                            return;

                                        await WebFirestore.updateDoc(
                                            WebFirestore.doc(
                                                firebaseFirestore,
                                                `/users/${firebaseAuth.currentUser.uid}`),
                                            {
                                                "tasks": copyListCopy.map(TaskDefinition.toDocValue),
                                            });
                                    },
                                })
                                .then(() =>
                                {
                                    userData.setTasks(copyListCopy);
                                    router.back();
                                })
                                .catch((e) =>
                                {
                                    alert("Failed to delete task.");
                                    console.error(e);
                                });
                        }}
                        style="outline"
                        color="more"
                        children="Delete Task"/>
                </View>
            </ScrollView>
        </Group>
    );
}