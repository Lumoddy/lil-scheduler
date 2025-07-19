import * as Web from "@firebase/auth";
import * as Native from "@react-native-firebase/auth";
import { nativeOrWebImport, NativeOrWebResult } from "../PlatformExtensions";
export { Native as NativeAuth, Web as WebAuth };

export type NativeFirebaseAuth = Native.FirebaseAuthTypes.Module;
export type WebFirebaseAuth = Web.Auth;

export type FirebaseAuth = NativeFirebaseAuth & WebFirebaseAuth;

export const getAuth = firebaseAuthImport("getAuth");

export function firebaseAuthImport<
    const K extends keyof typeof Native & keyof typeof Web>(
    mapper: K)
    : NativeOrWebResult<typeof Native[K], typeof Web[K]>;
export function firebaseAuthImport<const TNative extends keyof typeof Native, const TWeb extends keyof typeof Web>(
    mapper:
    {
        readonly native: TNative,
        readonly web: TWeb,
    })
    : NativeOrWebResult<typeof Native[TNative], typeof Web[TWeb]>;
export function firebaseAuthImport<const TNative extends keyof typeof Native, const TWeb>(
    mapper:
    {
        readonly native: TNative,
        readonly web: ((value: typeof Web) => TWeb),
    })
    : NativeOrWebResult<typeof Native[TNative], TWeb>;
export function firebaseAuthImport<const TNative, const TWeb extends keyof typeof Web>(
    mapper:
    {
        readonly native: ((value: typeof Native) => TNative),
        readonly web: TWeb,
    })
    : NativeOrWebResult<TNative, typeof Web[TWeb]>;
export function firebaseAuthImport<const TNative, const TWeb = TNative>(
    mapper:
    {
        readonly native: ((value: typeof Native) => TNative),
        readonly web: ((value: typeof Web) => TWeb),
    })
    : NativeOrWebResult<TNative, TWeb>;
export function firebaseAuthImport(mapper: any): any
{
    return nativeOrWebImport(Native, Web, mapper);
}