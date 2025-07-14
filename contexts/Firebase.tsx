import { FirebaseApp } from "firebase/app";
import { createContext } from "react";

export const FirebaseAppContext
    = createContext<FirebaseApp | undefined>(undefined);

export const appConfig =
{
    apiKey: "AIzaSyC1stMS6T-1lrQMfuHTOtNK-PxPrbHtbww",
    authDomain: "lil-scheduler.firebaseapp.com",
    projectId: "lil-scheduler",
    storageBucket: "lil-scheduler.firebasestorage.app",
    messagingSenderId: "585357721558",
    appId: "1:585357721558:web:59358d17758788827dee77",
} as const;