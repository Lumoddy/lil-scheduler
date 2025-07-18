import * as Web from "@firebase/firestore";
import * as Native from "@react-native-firebase/firestore";
import { nativeOrWebImport, NativeOrWebResult } from "../PlatformExtensions";
export { Native as NativeFirestore, Web as WebFirestore };

export type Firestore = Web.Firestore & Native.FirebaseFirestoreTypes.Module;

export const getFirestore = firebaseFirestoreImport("getFirestore");

export function firebaseFirestoreImport<
    const K extends keyof typeof Native & keyof typeof Web>(
    mapper: K)
    : NativeOrWebResult<typeof Native[K], typeof Web[K]>;
export function firebaseFirestoreImport<const TNative extends keyof typeof Native, const TWeb extends keyof typeof Web>(
    mapper:
    {
        readonly native: TNative,
        readonly web: TWeb,
    })
    : NativeOrWebResult<typeof Native[TNative], typeof Web[TWeb]>;
export function firebaseFirestoreImport<const TNative extends keyof typeof Native, const TWeb>(
    mapper:
    {
        readonly native: TNative,
        readonly web: ((value: typeof Web) => TWeb),
    })
    : NativeOrWebResult<typeof Native[TNative], TWeb>;
export function firebaseFirestoreImport<const TNative, const TWeb extends keyof typeof Web>(
    mapper:
    {
        readonly native: ((value: typeof Native) => TNative),
        readonly web: TWeb,
    })
    : NativeOrWebResult<TNative, typeof Web[TWeb]>;
export function firebaseFirestoreImport<const TNative, const TWeb = TNative>(
    mapper:
    {
        readonly native: ((value: typeof Native) => TNative),
        readonly web: ((value: typeof Web) => TWeb),
    })
    : NativeOrWebResult<TNative, TWeb>;
export function firebaseFirestoreImport(mapper: any): any
{
    return nativeOrWebImport(Native, Web, mapper);
}