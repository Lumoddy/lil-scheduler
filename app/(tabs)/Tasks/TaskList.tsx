import { Group } from "@/components/Flex";
import { TaskListItem } from "@/components/TaskListItem";
import { themedHeader } from "@/components/ThemedHeader";
import { ThemeColors } from "@/constants/ThemeColors";
import { FirebaseAuthContext, FirebaseFirestoreContext } from "@/contexts/Firebase";
import { UserDataContext } from "@/contexts/UserData";
import { NativeFirestore, WebFirestore } from "@/library/FirebaseMerge/Firestore";
import { over } from "@/library/IteratorExtensions";
import { nativeOrWebMap } from "@/library/PlatformExtensions";
import { TaskDefinition } from "@/library/Task";
import { Stack } from "expo-router";
import { useContext, useEffect } from "react";

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

                        const userDoc = await NativeFirestore.getDocFromServer(
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

                        const userDoc = await WebFirestore.getDocFromServer(
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
            {userData?.tasks?.map((task, i) => <TaskListItem key={i} task={task}/>)}
        </Group>
    );
}