import { Group } from "@/components/Flex";
import { TaskListItem } from "@/components/TaskListItem";
import { themedHeader, themedHeaderButton } from "@/components/ThemedHeader";
import { ThemeColors } from "@/constants/ThemeColors";
import { CalenderStateContext } from "@/contexts/CalendarState";
import { FirebaseAuthContext, FirebaseFirestoreContext } from "@/contexts/Firebase";
import { UserDataContext } from "@/contexts/UserData";
import { NativeFirestore, WebFirestore } from "@/library/FirebaseMerge/Firestore";
import { over } from "@/library/IteratorExtensions";
import { nativeOrWebMap } from "@/library/PlatformExtensions";
import { TaskDefinition } from "@/library/Task";
import { router, Stack, useRouter } from "expo-router";
import { useContext, useEffect, useMemo } from "react";
import { View } from "react-native";

export default function()
{
    const calenderState = useContext(CalenderStateContext);

    if (calenderState === undefined)
        throw new Error("CalenderStateContext is not defined.");

    const {
        date: [date],
    } = calenderState;

    const firebaseAuth = useContext(FirebaseAuthContext);
    const firebaseFirestore = useContext(FirebaseFirestoreContext);
    const userData = useContext(UserDataContext);

    useEffect(
        () =>
        {
            if (userData === undefined
                || firebaseAuth === undefined
                || firebaseFirestore == undefined)
                return;

            nativeOrWebMap(
                [firebaseAuth, firebaseFirestore],
                {
                    async native([firebaseAuth, firebaseFirestore])
                    {
                        if (firebaseAuth.currentUser === null)
                            return;

                        const userDoc = await NativeFirestore.getDoc(
                            NativeFirestore.doc(
                                firebaseFirestore,
                                `/users/${firebaseAuth.currentUser.uid}`));

                        if (!userDoc.exists())
                        {
                            userData.setTasks(undefined);
                            return;
                        }

                        const userTasks = userDoc.get("tasks");
                        if (!(userTasks instanceof Array))
                        {
                            userData.setTasks(undefined);
                            return;
                        }

                        userData.setTasks(
                        [
                            ...over(userTasks)
                                .map(TaskDefinition.fromDocValue)
                                .filter((v) => v !== undefined)
                        ]);
                    },

                    async web([firebaseAuth, firebaseFirestore])
                    {
                        if (firebaseAuth.currentUser === null)
                            return;

                        const userDoc = await WebFirestore.getDoc(
                            WebFirestore.doc(
                                firebaseFirestore,
                                `/users/${firebaseAuth.currentUser.uid}`));

                        if (!userDoc.exists())
                        {
                            userData.setTasks(undefined);
                            return;
                        }

                        const userTasks = userDoc.get("tasks");
                        if (!(userTasks instanceof Array))
                        {
                            userData.setTasks(undefined);
                            return;
                        }

                        userData.setTasks(
                        [
                            ...over(userTasks)
                                .map(TaskDefinition.fromDocValue)
                                .filter((v) => v !== undefined)
                        ]);
                    },
                })
                .catch(console.error);
        },
        [userData === undefined, firebaseAuth, firebaseFirestore]);

    const tasksInOrder = useMemo( // The "algorithm":
        () =>
        {
            return over(userData?.tasks)
                .map((task, i) => ({ task, i }))
                .filter(({ task }) =>
                {
                    const fixedDate = task.attributes.find(
                        (attribute) => attribute.type === "fixed-date");

                    if (fixedDate === undefined)
                        return true;

                    const { date: [date] }
                        = useContext(CalenderStateContext)!;
                    if (fixedDate.date.getFullYear() !== date.getFullYear()
                        || fixedDate.date.getDate() !== date.getDate())
                        return true;

                    return false;
                })
                .toSorted(({ task: lhs }, { task: rhs }) =>
                {
                    const lhsPriority = lhs.attributes.find(
                        (attribute) => attribute.type === "priority");

                    const rhsPriority = rhs.attributes.find(
                        (attribute) => attribute.type === "priority");

                    return (rhsPriority?.priority ?? -1) - (lhsPriority?.priority ?? -1);
                })
                .map(({ task, i }) => <TaskListItem
                    key={i}
                    onPress={() =>
                    {
                        router.push(`/(tabs)/Tasks/TaskDetails?task-id=${i}`);
                    }}
                    task={task}/>)
        },
        [userData?.tasks]);

    return (
        <Group>
            <Stack.Screen options={
            {
                contentStyle:
                {
                    backgroundColor: ThemeColors.background,
                },
                title: date.toLocaleString(
                    "default",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }),
                header: themedHeader(),
                headerRight: themedHeaderButton(
                    "Calender",
                    {
                        onPress()
                        {
                            useRouter()
                                .navigate("/(tabs)/Calendar/DatePicker");
                        },
                    }),
            }}/>
            <View
                style={
                {
                    paddingInline: 24,
                    gap: 8,
                }}>
                {tasksInOrder}
            </View>
        </Group>
    );
}