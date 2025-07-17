import { ReactNode } from "react";
import { View, ViewProps, ViewStyle } from "react-native";

export interface ExpandProps extends ViewProps { }

/**
 * An invisible element that has it's `style.flex` set to `1`.
 */
export function Expand(
{
    style,
    ...rest
}
: ExpandProps)
{
    return (
        <View
            style={
            [
                { flex: 1 },
                style,
            ]}
            {...rest}/>
    );
}

export interface FlexProps
    extends ViewProps,
    Pick<ViewStyle, "justifyContent" | "alignContent" | "alignItems"> { }

/**
 * A {@linkcode View} that is set to flex as a row.
 */
export function Row(
{
    style,
    justifyContent = "space-between",
    alignContent = "stretch",
    alignItems = "center",
    ...rest
}
: FlexProps)
{
    return (
        <View
            style={
            [
                {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent,
                    alignContent,
                    alignItems,
                },
                style,
            ]}
            {...rest}/>
    );
}

/**
 * A {@linkcode View} that is set to flex as a column.
 */
export function Column(
{
    style,
    justifyContent = "space-between",
    alignContent = "stretch",
    alignItems = "center",
    ...rest
}
: FlexProps)
{
    return (
        <View
            style={
            [
                {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent,
                    alignContent,
                    alignItems,
                },
                style,
            ]}
            {...rest}/>
    );
}

/**
 * A {@linkcode View} that is set to flex it's contents to it's center.
 */
export function Centered(
{
    style,
    justifyContent = "center",
    alignContent = "center",
    alignItems = "center",
    ...rest
}
: FlexProps)
{
    return (
        <View
            style={
            [
                {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent,
                    alignContent,
                    alignItems,
                },
                style,
            ]}
            {...rest}/>
    );
}

/**
 * An element that does not exist. It simply returns it's children and is
 * equivalent to listing them in an array.
 */
export function Group({ children }: { children: ReactNode })
{
    return children;
}