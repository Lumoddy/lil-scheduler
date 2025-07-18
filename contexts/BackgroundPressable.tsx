import { createContext, ReactNode, useEffect, useState } from "react";
import { Pressable, PressableProps } from "react-native";

const _listenerTypeToPressablePropMap =
{
    "hoverIn": "onHoverIn",
    "hoverOut": "onHoverOut",
    "press": "onPress",
    "pressIn": "onPressIn",
    "pressOut": "onPressOut",
    "longPress": "onLongPress",
    "blur": "onBlur",
    "focus": "onFocus",
    "pointerEnter": "onPointerEnter",
    "pointerEnterCapture": "onPointerEnterCapture",
    "pointerLeave": "onPointerLeave",
    "pointerLeaveCapture": "onPointerLeaveCapture",
    "pointerMove": "onPointerMove",
    "pointerMoveCapture": "onPointerMoveCapture",
    "pointerCancel": "onPointerCancel",
    "pointerCancelCapture": "onPointerCancelCapture",
    "pointerDown": "onPointerDown",
    "pointerDownCapture": "onPointerDownCapture",
    "pointerUp": "onPointerUp",
    "pointerUpCapture": "onPointerUpCapture",
} as const;

export type BackgroundPressableContextListenerMap =
{
    [K in keyof typeof _listenerTypeToPressablePropMap]:
        PressableProps[typeof _listenerTypeToPressablePropMap[K]];
}

export interface BackgroundPressableContextData
{
    addEventListener<N extends keyof BackgroundPressableContextListenerMap>(
        type: N,
        listener: (event: BackgroundPressableContextListenerMap[N]) => void): void;
    removeEventListener<N extends keyof BackgroundPressableContextListenerMap>(
        type: N,
        listener: (event: BackgroundPressableContextListenerMap[N]) => void): void;
}

export const BackgroundPressableContext = createContext<BackgroundPressableContextData>(
{
    addEventListener()
    {
        throw new Error("BackgroundPressableContext is not initialized.");
    },
    removeEventListener()
    {
        throw new Error("BackgroundPressableContext is not initialized.");
    },
});

export function BackgroundPressable({ children }: { children?: ReactNode })
{
    const [listeners] = useState<
    {
        [K in keyof BackgroundPressableContextListenerMap]?:
            BackgroundPressableContextListenerMap[K][];
    }>({});

    const [callbacks] = useState<
    {
        [K in typeof _listenerTypeToPressablePropMap[keyof typeof _listenerTypeToPressablePropMap]]?:
            PressableProps[K];
    }>({});
    useEffect(
        () =>
        {
            for (const key in _listenerTypeToPressablePropMap)
            {
                const listenerType = key as keyof typeof _listenerTypeToPressablePropMap;
                const callbackName = _listenerTypeToPressablePropMap[listenerType];

                callbacks[callbackName] = (event) =>
                {
                    const listenerList = listeners[listenerType];
                    if (listenerList === undefined)
                        return;

                    for (const listener of listenerList)
                        if (listener instanceof Function)
                            listener(event as never);
                };
            }
        },
        [listeners]);

    return (
        <Pressable
            style={
            {
                flex: 1,
            }}
            {...callbacks}>
            <BackgroundPressableContext value={
                {
                    addEventListener(type, listener)
                    {
                        const listenerList = listeners[type];
                        if (listenerList === undefined || listenerList === null)
                            listeners[type] = [listener] as any;
                        else
                            listenerList.push(listener as any);
                    },
                    removeEventListener(type, listener)
                    {
                        const listenerList = listeners[type];
                        if (listenerList === undefined || listenerList === null)
                            return;

                        const index = listenerList.indexOf(listener as any);
                        if (index !== -1)
                            listenerList.splice(index, 1);
                    },
                }}>
                {children}
            </BackgroundPressableContext>
        </Pressable>
    );
}