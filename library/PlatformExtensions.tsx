import { Platform } from "react-native";

export type NativeOrWebResult<TNative, TWeb> =
    [TNative, TWeb] extends
    [
        (...args: infer TNativeIn) => infer TNativeOut,
        (...args: infer TWebIn) => infer TWebOut,
    ]
        ? [TNativeOut, TWebOut] extends
        [
            Promise<infer TNativeOutPromiseValue>,
            Promise<infer TWebOutPromiseValue>,
        ]
            ? (...args: TNativeIn | TWebIn) => Promise<TNativeOutPromiseValue & TWebOutPromiseValue>
            : (...args: TNativeIn | TWebIn) => TNativeOut & TWebOut
        : TNative & TWeb;

export function nativeOrWebMap<const TNative, const TWeb, TNativeResult, TWebResult>(
    value: TNative | TWeb,
    mapper:
    {
        readonly native: (value: TNative) => TNativeResult,
        readonly web: (value: TWeb) => TWebResult
    })
    : NativeOrWebResult<TNativeResult, TWebResult>
{
    switch (Platform.OS)
    {
        case "web":
            return mapper.web(value as TWeb) as any;
        default:
            return mapper.native(value as TNative) as any;
    }
}

export function nativeOrWeb<const TNative, const TWeb>(
    mapper:
    {
        readonly native: TNative,
        readonly web: TWeb
    })
    : NativeOrWebResult<TNative, TWeb>
{
    switch (Platform.OS)
    {
        case "web":
            return mapper.web as any;
        default:
            return mapper.native as any;
    }
}

export function nativeOrWebImport<
    const TNative,
    const TWeb,
    const K extends keyof TNative & keyof TWeb>(
    nativeObject: TNative,
    webObject: TWeb,
    mapper: K)
    : NativeOrWebResult<TNative[K], TWeb[K]>;
export function nativeOrWebImport<
    const TNative,
    const TWeb,
    const TNativeKey extends keyof TNative,
    const TWebKey extends keyof TWeb>(
    nativeObject: TNative,
    webObject: TWeb,
    mapper:
    {
        readonly native: TNativeKey,
        readonly web: TWebKey,
    })
    : NativeOrWebResult<TNative[TNativeKey], TWeb[TWebKey]>;
export function nativeOrWebImport<
    const TNative,
    const TWeb,
    const TNativeKey extends keyof TNative,
    const TWebValue>(
    nativeObject: TNative,
    webObject: TWeb,
    mapper:
    {
        readonly native: TNativeKey,
        readonly web: ((value: TWeb) => TWeb[keyof TWeb]),
    })
    : NativeOrWebResult<TNative[TNativeKey], TWebValue>;
export function nativeOrWebImport<
    const TNative,
    const TWeb,
    const TNativeValue,
    const TWebKey extends keyof TWeb>(
    nativeObject: TNative,
    webObject: TWeb,
    mapper:
    {
        readonly native: ((value: TNative) => TNative[keyof TNative]),
        readonly web: TWebKey,
    })
    : NativeOrWebResult<TNativeValue, TWeb[TWebKey]>;
export function nativeOrWebImport<
    const TNative,
    const TWeb,
    const TNativeValue,
    const TWebValue = TNativeValue>(
    nativeObject: TNative,
    webObject: TWeb,
    mapper:
    {
        readonly native: ((value: TNative) => TNativeValue),
        readonly web: ((value: TWeb) => TWebValue),
    })
    : NativeOrWebResult<TNativeValue, TWebValue>;
export function nativeOrWebImport(
    nativeObject: any,
    webObject: any,
    mapper:
        | string
        | {
            readonly native: ((value: any) => any) | string,
            readonly web: ((value: any) => any) | string,
        })
    : any
{
    switch (Platform.OS)
    {
        case "web":
            return typeof mapper === "string"
                ? webObject[mapper]
                : mapper.web instanceof Function
                    ? mapper.web(webObject)
                    : webObject[mapper.web];
        default:
            return typeof mapper === "string"
                ? nativeObject[mapper]
                : mapper.native instanceof Function
                    ? mapper.native(nativeObject)
                    : nativeObject[mapper.native];
    }
}