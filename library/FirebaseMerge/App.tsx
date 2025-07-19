import * as Web from "@firebase/app";
import * as Native from "@react-native-firebase/app";
import { nativeOrWebImport, NativeOrWebResult } from "../PlatformExtensions";
export { Native as NativeApp, Web as WebApp };

export type NativeFirebaseApp = Native.ReactNativeFirebase.FirebaseApp;
export type WebFirebaseApp = Web.FirebaseApp;

export type FirebaseApp = NativeFirebaseApp & WebFirebaseApp;

export type FirebaseAppOptions = Web.FirebaseOptions & Native.ReactNativeFirebase.FirebaseAppOptions;

export const defaultAppName = "[DEFAULT]";

export function firebaseAppImport<
    const K extends keyof typeof Native & keyof typeof Web>(
    mapper: K)
    : NativeOrWebResult<typeof Native[K], typeof Web[K]>;
export function firebaseAppImport<
    const TNative extends keyof typeof Native,
    const TWeb extends keyof typeof Web>(
    mapper:
    {
        readonly native: TNative,
        readonly web: TWeb,
    })
    : NativeOrWebResult<typeof Native[TNative], typeof Web[TWeb]>;
export function firebaseAppImport<
    const TNative extends keyof typeof Native,
    const TWeb>(
    mapper:
    {
        readonly native: TNative,
        readonly web: ((value: typeof Web) => typeof Web[keyof typeof Web]),
    })
    : NativeOrWebResult<typeof Native[TNative], TWeb>;
export function firebaseAppImport<
    const TNative,
    const TWeb extends keyof typeof Web>(
    mapper:
    {
        readonly native: ((value: typeof Native) => typeof Native[keyof typeof Native]),
        readonly web: TWeb,
    })
    : NativeOrWebResult<TNative, typeof Web[TWeb]>;
export function firebaseAppImport<
    const TNative,
    const TWeb = TNative>(
    mapper:
    {
        readonly native: ((value: typeof Native) => TNative),
        readonly web: ((value: typeof Web) => TWeb),
    })
    : NativeOrWebResult<TNative, TWeb>;
export function firebaseAppImport(mapper: any): any
{
    return nativeOrWebImport(Native, Web, mapper);
}