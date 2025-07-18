import * as Web from "@firebase/app";
import * as Native from "@react-native-firebase/app";
import { nativeOrWebImport, nativeOrWebMap, NativeOrWebResult } from "../PlatformExtensions";
export { nativeOrWebMap as firebaseMap, Native as NativeApp, Web as WebApp };

export type FirebaseApp = Web.FirebaseApp & Native.ReactNativeFirebase.FirebaseApp;

export type FirebaseAppOptions = Web.FirebaseOptions & Native.ReactNativeFirebase.FirebaseAppOptions;

export const defaultAppName = "[DEFAULT]";

export const initializeApp = firebaseAppImport(
{
    native: (n) => (
        options: Native.ReactNativeFirebase.FirebaseAppOptions,
        name?: string) => n.initializeApp(options, name),
    web: (n) => async (
        options: Web.FirebaseOptions,
        name?: string) => n.initializeApp(options, name),
});

export const getApp = firebaseAppImport("getApp");

export const getApps = firebaseAppImport("getApps");

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