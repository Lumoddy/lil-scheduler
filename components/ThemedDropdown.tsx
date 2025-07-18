import { BackgroundPressableContext } from "@/contexts/BackgroundPressable";
import { IterateOver, over } from "@/library/IteratorExtensions";
import { ReactNode, RefAttributes, useContext, useEffect, useMemo, useState } from "react";
import { PressableProps, View, ViewStyle } from "react-native";
import { Expand } from "./Flex";
import { ThemedButton } from "./ThemedButton";

export interface ThemedDropdownProps<T>
    extends Omit<PressableProps, "children" | "style">,
    RefAttributes<View>
{
    options: IterateOver<{ name?: ReactNode, value: T }>;
    style?: "fill" | "outline" | "textonly";
    color?: "more" | "bold";
    size?: "large" | "small" | "tiny";
    styleOverride?: ViewStyle;
    onChange?: (value: T) => void;
}

/**
 * A styled link component whose appearance and options derive from the button
 * in the Figma design seen
 * [here](https://www.figma.com/design/P1BbYTpp52F5FC76qzVuGZ/Lil--Scheduler-2?node-id=1-7&t=3GOgjufC8vZUIfJo-1).
 */
export function ThemedDropdown<T>(
{
    options,
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
    const [index, setIndex] = useState(0);
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
        [index]);

    const processedOptions = useMemo(
        () =>
        {
            return [...over(options).map((option, i) =>
                <ThemedButton
                    onPress={() =>
                    {
                        setIndex(i);
                        setOptionsShown(false);
                        onChange?.(option.value);
                    }}
                    style={style}
                    color={color}
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
                {...rest}>
                {chosenOption.name ?? String(chosenOption.value)}
                <Expand/>
                {"v"}
            </ThemedButton>
            <View
                style={
                {
                    display: optionsShown ? "flex" : "none",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                }}>
                {processedOptions}
            </View>
        </View>
    )
}