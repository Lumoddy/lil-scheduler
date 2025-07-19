import { BackgroundPressableContext } from "@/contexts/BackgroundPressable";
import { IterateOver, over } from "@/library/IteratorExtensions";
import { ReactNode, RefAttributes, useContext, useEffect, useMemo, useState } from "react";
import { PressableProps, StyleSheet, View, ViewStyle } from "react-native";
import { Expand } from "./Flex";
import { getThemedButtonColorStyle, getThemedButtonLayoutStyle, ThemedButton } from "./ThemedButton";

export interface ThemedDropdownProps<T>
    extends Omit<PressableProps, "children" | "style">,
    RefAttributes<View>
{
    options: IterateOver<{ name?: ReactNode, value: T }>;
    index?: number,
    value?: T,
    style?: "fill" | "outline" | "textonly";
    color?: "more" | "bold";
    size?: "large" | "small" | "tiny";
    styleOverride?: ViewStyle;
    onChange?: (value: T, index: number) => void;
}

/**
 * A styled link component whose appearance and options derive from the button
 * in the Figma design seen
 * [here](https://www.figma.com/design/P1BbYTpp52F5FC76qzVuGZ/Lil--Scheduler-2?node-id=1-7&t=3GOgjufC8vZUIfJo-1).
 */
export function ThemedDropdown<T>(
{
    options,
    index: propIndex,
    value: propValue,
    style = "fill",
    color = "more",
    size = "small",
    disabled = false,
    styleOverride,
    onChange,
    ...rest
}
: ThemedDropdownProps<T>)
{
    if (propIndex !== undefined && propValue !== undefined)
        throw new Error("Cannot define both index and value for ThemedDropdown.");

    const [index, setIndex] = useState(0);
    useEffect(
        () =>
        {
            if (propIndex === undefined || propIndex === index)
                return;

            setIndex(propIndex);
        },
        [propIndex, index]);
    useEffect(
        () =>
        {
            if (propValue === undefined)
                return;

            let i = 0;
            for (const option of over(options))
            {
                if (option.value === propValue)
                {
                    setIndex(i);
                    return;
                }

                ++i;
            }

            setIndex(-1);
        },
        [propValue, index, options]);

    const [optionsShown, setOptionsShown] = useState(false);

    const chosenOption = useMemo(
        () =>
        {
            let i = index;
            for (const option of over(options))
                if (i-- == 0)
                    return option;

            return { value: undefined, name: [] };
        },
        [index, options]);

    const processedOptions = useMemo(
        () =>
        {
            return [...over(options).map((option, i) =>
                <ThemedButton
                    onPress={() =>
                    {
                        setIndex(i);
                        setOptionsShown(false);
                        onChange?.(option.value!, i);
                    }}
                    style="fill"
                    color="bold"
                    size={size}
                    children={option.name ?? String(option.value)}/>)];
        },
        [setIndex, setOptionsShown, style, color, size, options]);

    const background = useContext(BackgroundPressableContext);

    useEffect(
        () =>
        {
            const callback = () => setOptionsShown(false);
            background.addEventListener("press", callback);
            return () => background.removeEventListener("press", callback);
        });

    return (
        <View>
            <ThemedButton
                onPress={() =>
                {
                    setOptionsShown(true);
                }}
                style={style}
                color={color}
                size={size}
                styleOverride={StyleSheet.flatten(
                [
                    styleOverride,
                    {
                        flex: 1,
                    },
                ])}
                {...rest}>
                {chosenOption.name ?? String(chosenOption.value)}
                <Expand/>
                {"v"}
            </ThemedButton>
            <View
                style={StyleSheet.flatten(
                [
                    getThemedButtonColorStyle("fill", "bold").container,
                    getThemedButtonLayoutStyle(size).container,
                    {
                        padding: 0,
                        flexDirection: "column",
                        display: optionsShown ? "flex" : "none",
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                    },
                ])}>
                {processedOptions}
            </View>
        </View>
    )
}