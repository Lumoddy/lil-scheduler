import { over } from "@/library/IteratorExtensions";
import { Link, LinkProps } from "expo-router";
import { ReactNode, RefAttributes, useMemo } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { getThemedButtonColorStyle, getThemedButtonLayoutStyle } from "./ThemedButton";

export interface ThemedLinkProps
    extends Omit<LinkProps, "children" | "style">,
    RefAttributes<View>
{
    children: ReactNode;
    style?: "fill" | "outline" | "textonly";
    color?: "more" | "bold";
    size?: "large" | "small" | "tiny";
    styleOverride?: ViewStyle;
}

/**
 * A styled link component whose appearance and options derive from the button
 * in the Figma design seen
 * [here](https://www.figma.com/design/P1BbYTpp52F5FC76qzVuGZ/Lil--Scheduler-2?node-id=1-7&t=3GOgjufC8vZUIfJo-1).
 */
export function ThemedLink(
{
    children,
    style = "fill",
    color = "more",
    size = "small",
    disabled = false,
    styleOverride,
    ...rest
}
: ThemedLinkProps)
{
    const containerStyleSheet = useMemo(
        () =>
        {
            const styleSheet = StyleSheet.flatten(
            [
                getThemedButtonColorStyle(
                    style,
                    color,
                    "none",
                    disabled).container,
                getThemedButtonLayoutStyle(size).container,
            ]);

            if (styleOverride === undefined)
                return styleSheet;

            return (
            {
                ...styleSheet,
                ...styleOverride,
            });
        },
        [style, color, size, styleOverride]);

    const textStyleSheet = useMemo(
        () =>
        {
            return StyleSheet.flatten(
            [
                getThemedButtonColorStyle(
                    style,
                    color,
                    "none",
                    disabled).text,
                getThemedButtonLayoutStyle(size).text,
            ]);
        },
        [style, color, size, styleOverride]);

    const processedChildren = useMemo(
        () =>
        {
            function postProcessElements(
                elements: ReactNode): ReactNode
            {
                if (elements === null
                    || elements === undefined
                    || typeof elements === "number"
                    || typeof elements === "boolean"
                    || typeof elements === "bigint")
                    return elements;
                else if (typeof elements === "string")
                    return <Text style={textStyleSheet}>{elements}</Text>;
                else if (Symbol.iterator in elements)
                    return [...over(elements).map(postProcessElements)];
                else
                    return elements;
            }

            return postProcessElements(children);
        },
        [children, textStyleSheet]);

    return (
        <Link
            style={containerStyleSheet as any}
            {...rest}>
            {processedChildren}
        </Link>
    )
}