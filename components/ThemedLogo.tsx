import { ThemeColors } from "@/constants/ThemeColors";
import { Color } from "@/library/Color";
import { RefAttributes, useMemo } from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

export interface ThemedLogoProps
    extends Omit<TextProps, "children" | "style">,
    RefAttributes<Text>
{
    type?:
        | "large-text"
        | "small-text"
        | "faded-text";
    styleOverride?: TextStyle;
}

/**
 * A styled text component whose appearance and options derive from the Figma
 * design seen
 * [here](https://www.figma.com/design/P1BbYTpp52F5FC76qzVuGZ/Lil--Scheduler-2?node-id=1-40&t=G38GCyINp03LERn2-1).
 */
export function ThemedLogo(
{
    type = "large-text",
    styleOverride,
    ...rest
}
: ThemedLogoProps)
{
    const styleSheet = useMemo(
        () =>
        {
            const styleSheet = getThemedLogoStyle(type);

            if (styleOverride === undefined)
                return styleSheet;

            return (
            [
                styleSheet,
                styleOverride,
            ]);
        },
        [type, styleOverride]);

    return (
        <Text
            style={styleSheet}
            {...rest}>
            Lil' Scheduler
        </Text>
    )
}

const _themedTextStyleCache
    : (TextStyle | undefined)[] = new Array(3);

export function getThemedLogoStyle(
    type:
        | "large-text"
        | "small-text"
        | "faded-text"): TextStyle
{
    let cacheKey = 0;
    switch (type)
    {
        case "large-text": cacheKey += 0; break;
        case "small-text": cacheKey += 1; break;
        case "faded-text": cacheKey += 2; break;
    }

    const cachedValue = _themedTextStyleCache[cacheKey];
    if (cachedValue !== undefined)
        return cachedValue;

    let styleSheet;

    switch (type)
    {
        case "large-text":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 32,
                    marginBottom: 16,
                    marginInline: 16,
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontSize: 40,
                    fontWeight: 600,
                    color: ThemeColors.text,
                },
            });
            break;
        case "small-text":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 32,
                    marginBottom: 16,
                    marginInline: 16,
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontSize: 32,
                    fontWeight: 600,
                    color: Color.blendHex(ThemeColors.text, ThemeColors.less),
                },
            });
            break;
        case "faded-text":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 32,
                    marginBottom: 16,
                    marginInline: 16,
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontSize: 24,
                    fontWeight: 600,
                    color: Color.blendHex(Color.blend(Color.blend(Color.blend(
                        ThemeColors.text,
                        ThemeColors.less),
                        ThemeColors.less),
                        ThemeColors.less),
                        ThemeColors.less),
                },
            });
            break;
    }

    _themedTextStyleCache[cacheKey] = styleSheet.text;
    return styleSheet.text;
}