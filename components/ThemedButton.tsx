import { ThemeColors } from "@/constants/ThemeColors";
import { Color } from "@/library/Color";
import { over } from "@/library/IteratorExtensions";
import { ReactNode } from "react";
import { Pressable, PressableProps, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

export interface ThemedButtonProps
    extends Omit<PressableProps, "children" | "style">
{
    children: ReactNode;
    style?: "fill" | "outline" | "textonly";
    color?: "more" | "bold";
    size?: "large" | "small" | "tiny";
    styleOverride?: PressableProps["style"];
}

/**
 * A styled button component whose appearance and options derive from the Figma
 * design seen
 * [here](https://www.figma.com/design/P1BbYTpp52F5FC76qzVuGZ/Lil--Scheduler-2?node-id=1-7&t=3GOgjufC8vZUIfJo-1).
 */
export function ThemedButton(
{
    children,
    style = "fill",
    color = "more",
    size = "small",
    styleOverride,
    ...rest
}
: ThemedButtonProps)
{
    return (
        <Pressable
            style={(state) =>
            {
                const styleSheet = StyleSheet.flatten(
                [
                    getThemedButtonColorStyle(
                        style,
                        color,
                        state.pressed ? "pressed" :
                            state.hovered ? "hover" :
                            "none").container,
                    getThemedButtonLayoutStyle(size).container,
                ]);

                if (styleOverride === undefined)
                    return styleSheet;

                return (
                [
                    styleSheet,
                    styleOverride instanceof Function
                        ? styleOverride(state)
                        : styleOverride,
                ]);
            }}
            {...rest}>
            {(state) =>
            {
                const styleSheet = StyleSheet.flatten(
                [
                    getThemedButtonColorStyle(
                        style,
                        color,
                        state.pressed ? "pressed" :
                            state.hovered ? "hover" :
                            "none").text,
                    getThemedButtonLayoutStyle(size).text,
                ]);

                function postProcessElements(
                    elements: ReactNode): ReactNode
                {
                    if (elements === undefined)
                        return undefined;
                    else if (elements === null
                        || typeof elements === "string"
                        || typeof elements === "number"
                        || typeof elements === "boolean"
                        || typeof elements === "bigint")
                        return <Text style={styleSheet}>{elements}</Text>;
                    else if (Symbol.iterator in elements)
                        return over(elements).map(postProcessElements);
                    else
                        return elements;
                }

                return postProcessElements(children);
            }}
        </Pressable>
    )
}

const _themedButtonColorStyleCache
    : ({
        container: ViewStyle,
        text: TextStyle,
    }
    | undefined)[] = new Array(3 * 2 * 3);

export function getThemedButtonColorStyle(
    style: "fill" | "outline" | "textonly",
    color: "more" | "bold",
    state: "none" | "hover" | "pressed" = "none")
    : {
        container: ViewStyle,
        text: TextStyle,
    }
{
    let cacheKey = 0;
    switch (style)
    {
        case "fill": cacheKey += 0; break;
        case "outline": cacheKey += 1; break;
        case "textonly": cacheKey += 2; break;
    }
    switch (color)
    {
        case "more": cacheKey = (cacheKey * 3) + 0; break;
        case "bold": cacheKey = (cacheKey * 3) + 1; break;
    }
    switch (state)
    {
        case "none": cacheKey = (cacheKey * 2) + 0; break;
        case "hover": cacheKey = (cacheKey * 2) + 1; break;
        case "pressed": cacheKey = (cacheKey * 2) + 2; break;
    }

    const cachedValue = _themedButtonColorStyleCache[cacheKey];
    if (cachedValue !== undefined)
        return cachedValue;

    const OUTLINE_BORDER_WIDTH = 1;
    let styleSheet;

    switch (style)
    {
        case "fill":
            switch (state)
            {
                case "none":
                    styleSheet = StyleSheet.create(
                    {
                        container:
                        {
                            borderWidth: 0,
                            backgroundColor: ThemeColors[color],
                        },
                        text:
                        {
                            color: ThemeColors.text,
                            fontWeight: "600",
                        },
                    });
                    break;
                case "hover":
                    styleSheet = StyleSheet.create(
                    {
                        container:
                        {
                            borderWidth: 0,
                            backgroundColor: Color.blendHex(ThemeColors[color], ThemeColors.more),
                        },
                        text:
                        {
                            color: Color.blendHex(ThemeColors.text, ThemeColors.more),
                            fontWeight: "600",
                        },
                    });
                    break;
                case "pressed":
                    styleSheet = StyleSheet.create(
                    {
                        container:
                        {
                            borderWidth: 0,
                            backgroundColor: Color.blendHex(ThemeColors[color], ThemeColors.less),
                        },
                        text:
                        {
                            color: Color.blendHex(ThemeColors.text, ThemeColors.less),
                            fontWeight: "600",
                        },
                    });
                    break;
            }
            break;
        case "outline":
            switch (color)
            {
                case "more":
                    switch (state)
                    {
                        case "none":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: OUTLINE_BORDER_WIDTH,
                                    borderColor: Color.blendHex(ThemeColors.more, ThemeColors.more),
                                    backgroundColor: "#00000000",
                                },
                                text:
                                {
                                    color: ThemeColors.text,
                                    fontWeight: "400",
                                },
                            });
                            break;
                        case "hover":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: OUTLINE_BORDER_WIDTH,
                                    borderColor: Color.blendHex(ThemeColors.more, ThemeColors.more),
                                    backgroundColor: Color.blendHex(ThemeColors.more, ThemeColors.more),
                                },
                                text:
                                {
                                    color: Color.blendHex(ThemeColors.text, ThemeColors.more),
                                    fontWeight: "400",
                                },
                            });
                            break;
                        case "pressed":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: OUTLINE_BORDER_WIDTH,
                                    borderColor: Color.blendHex(ThemeColors.more, ThemeColors.more),
                                    backgroundColor: ThemeColors.less,
                                },
                                text:
                                {
                                    color: Color.blendHex(ThemeColors.text, ThemeColors.less),
                                    fontWeight: "400",
                                },
                            });
                            break;
                    }
                    break;
                case "bold":
                    switch (state)
                    {
                        case "none":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: OUTLINE_BORDER_WIDTH,
                                    borderColor: ThemeColors.bold,
                                    backgroundColor: "#00000000",
                                },
                                text:
                                {
                                    color: ThemeColors.bold,
                                    fontWeight: "400",
                                },
                            });
                            break;
                        case "hover":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: OUTLINE_BORDER_WIDTH,
                                    borderColor: ThemeColors.bold,
                                    backgroundColor: Color.blendHex(ThemeColors.more, ThemeColors.more),
                                },
                                text:
                                {
                                    color: ThemeColors.bold,
                                    fontWeight: "400",
                                },
                            });
                            break;
                        case "pressed":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: OUTLINE_BORDER_WIDTH,
                                    borderColor: ThemeColors.bold,
                                    backgroundColor: ThemeColors.less,
                                },
                                text:
                                {
                                    color: ThemeColors.bold,
                                    fontWeight: "400",
                                },
                            });
                            break;
                    }
                    break;
            }
            break;
        case "textonly":
            switch (color)
            {
                case "more":
                    switch (state)
                    {
                        case "none":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: 0,
                                    backgroundColor: "#00000000",
                                },
                                text:
                                {
                                    color: ThemeColors.text,
                                    fontWeight: "600",
                                },
                            });
                            break;
                        case "hover":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: 0,
                                    backgroundColor: ThemeColors.more,
                                },
                                text:
                                {
                                    color: Color.blendHex(ThemeColors.text, ThemeColors.more),
                                    fontWeight: "600",
                                },
                            });
                            break;
                        case "pressed":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: 0,
                                    backgroundColor: ThemeColors.less,
                                },
                                text:
                                {
                                    color: Color.blendHex(ThemeColors.text, ThemeColors.less),
                                    fontWeight: "600",
                                },
                            });
                            break;
                    }
                    break;
                case "bold":
                    switch (state)
                    {
                        case "none":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: 0,
                                    backgroundColor: "#00000000",
                                },
                                text:
                                {
                                    color: ThemeColors.bold,
                                    fontWeight: "600",
                                },
                            });
                            break;
                        case "hover":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: 0,
                                    backgroundColor: ThemeColors.more,
                                },
                                text:
                                {
                                    color: ThemeColors.bold,
                                    fontWeight: "600",
                                },
                            });
                            break;
                        case "pressed":
                            styleSheet = StyleSheet.create(
                            {
                                container:
                                {
                                    borderWidth: 0,
                                    backgroundColor: ThemeColors.less,
                                },
                                text:
                                {
                                    color: ThemeColors.bold,
                                    fontWeight: "600",
                                },
                            });
                            break;
                    }
                    break;
            }
            break;
    }

    _themedButtonColorStyleCache[cacheKey] = styleSheet;
    return styleSheet;
}

const _themedButtonLayoutStyleCache
    : ({
        container: ViewStyle,
        text: TextStyle,
    }
    | undefined)[] = new Array(3);

export function getThemedButtonLayoutStyle(
    size: "large" | "small" | "tiny")
    : {
        container: ViewStyle,
        text: TextStyle,
    }
{
    let cacheKey = 0;
    switch (size)
    {
        default:
        case "large": cacheKey += 0; break;
        case "small": cacheKey += 1; break;
        case "tiny": cacheKey += 2; break;
    }

    const cachedValue = _themedButtonLayoutStyleCache[cacheKey];
    if (cachedValue !== undefined)
        return cachedValue;

    let styleSheet;

    switch (size)
    {
        case "large":
            styleSheet = StyleSheet.create(
            {
                container:
                {
                    padding: 16,
                    margin: 8,
                    borderRadius: 16,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    userSelect: "none",
                },
                text:
                {
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontSize: 32,
                },
            });
            break;
        case "small":
            styleSheet = StyleSheet.create(
            {
                container:
                {
                    padding: 6,
                    margin: 6,
                    borderRadius: 16,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    userSelect: "none",
                },
                text:
                {
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontSize: 20,
                },
            });
            break;
        case "tiny":
            styleSheet = StyleSheet.create(
            {
                container:
                {
                    padding: 6,
                    margin: 4,
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    userSelect: "none",
                },
                text:
                {
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontSize: 16,
                },
            });
            break;
    }

    _themedButtonLayoutStyleCache[cacheKey] = styleSheet;
    return styleSheet;
}