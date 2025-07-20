import { Group } from "@/components/Flex";
import { TaskListItem } from "@/components/TaskListItem";
import { ThemedButton } from "@/components/ThemedButton";
import { themedHeader } from "@/components/ThemedHeader";
import { ThemeColors } from "@/constants/ThemeColors";
import { FirebaseAuthContext, FirebaseFirestoreContext } from "@/contexts/Firebase";
import { UserDataContext } from "@/contexts/UserData";
import { NativeFirestore, WebFirestore } from "@/library/FirebaseMerge/Firestore";
import { over } from "@/library/IteratorExtensions";
import { nativeOrWebMap } from "@/library/PlatformExtensions";
import { TaskDefinition } from "@/library/Task";
import { Stack, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { View } from "react-native";

export default function()
{
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

                        const doc = NativeFirestore.doc(
                            firebaseFirestore,
                            `/users/${firebaseAuth.currentUser.uid}`);

                        const userDoc = await NativeFirestore.getDoc(doc);

                        if (!userDoc.exists())
                        {
                            await NativeFirestore.setDoc(doc, {});
                            userData.setTasks([]);

                            return;
                        }

                        const userTasks = userDoc.get("tasks");
                        if (!(userTasks instanceof Array))
                        {
                            userData.setTasks([]);
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

                        const doc = WebFirestore.doc(
                            firebaseFirestore,
                            `/users/${firebaseAuth.currentUser.uid}`);

                        const userDoc = await WebFirestore.getDoc(doc);

                        if (!userDoc.exists())
                        {
                            await WebFirestore.setDoc(doc, {});
                            userData.setTasks([]);

                            return;
                        }

                        const userTasks = userDoc.get("tasks");
                        if (!(userTasks instanceof Array))
                        {
                            userData.setTasks([]);
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
                title: "Tasks",
                header: themedHeader(),
            }}/>
            <View
                style={
                {
                    paddingInline: 24,
                    gap: 8,
                }}>
                {userData?.tasks?.map((task, i) => <TaskListItem
                    key={i}
                    onPress={() =>
                    {
                        router.push(`/(tabs)/Tasks/TaskDetails?task-id=${i}`);
                    }}
                    task={task}/>)}
                <ThemedButton
                    onPress={() =>
                    {
                        router.push(`/(tabs)/Tasks/TaskDetails${""
                            }?task-id=new`);
                    }}
                    children="New Task"/>
            </View>
        </Group>
    );
}