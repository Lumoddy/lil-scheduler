import { ReactNativeFirebase } from "@react-native-firebase/app";
import { createContext } from "react";

export { initializeApp } from "@react-native-firebase/app";

export const FirebaseAppContext
    = createContext<ReactNativeFirebase.FirebaseApp | undefined>(undefined!);

export const firebaseAppOptions =
{
    apiKey: "AIzaSyC1stMS6T-1lrQMfuHTOtNK-PxPrbHtbww",
    authDomain: "lil-scheduler.firebaseapp.com",
    databaseURL: 'https://lil-scheduler.firebaseio.com',
    projectId: "lil-scheduler",
    storageBucket: "lil-scheduler.firebasestorage.app",
    messagingSenderId: "585357721558",
    appId: "1:585357721558:web:59358d17758788827dee77",
} as ReactNativeFirebase.FirebaseAppOptions;