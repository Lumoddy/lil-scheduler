import { FirebaseApp, FirebaseAppOptions } from "@/library/FirebaseMerge/App";
import { createContext } from "react";

export const FirebaseAppContext
    = createContext<FirebaseApp | undefined>(undefined!);

export const firebaseAppOptions: FirebaseAppOptions =
{
    apiKey: "AIzaSyC1stMS6T-1lrQMfuHTOtNK-PxPrbHtbww",
    authDomain: "lil-scheduler.firebaseapp.com",
    databaseURL: 'https://lil-scheduler.firebaseio.com',
    projectId: "lil-scheduler",
    storageBucket: "lil-scheduler.firebasestorage.app",
    messagingSenderId: "585357721558",
    appId: "1:585357721558:web:59358d17758788827dee77",
};