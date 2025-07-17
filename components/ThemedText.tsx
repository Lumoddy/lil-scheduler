import { ThemeColors } from "@/constants/ThemeColors";
import { Color } from "@/library/Color";
import { ReactNode, useMemo } from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

export interface ThemedTextProps
    extends Omit<TextProps, "children" | "style">
{
    children: ReactNode,
    type?:
        | "header1"
        | "header2"
        | "header3"
        | "header4"
        | "label"
        | "paragraph"
        | "note"
        | "question"
        | "error";
    centered?: boolean;
    styleOverride?: TextProps["style"];
}

/**
 * A styled text component whose appearance and options derive from the Figma
 * design seen
 * [here](https://www.figma.com/design/P1BbYTpp52F5FC76qzVuGZ/Lil--Scheduler-2?node-id=1-40&t=G38GCyINp03LERn2-1).
 */
export function ThemedText(
{
    children,
    type = "paragraph",
    centered,
    styleOverride,
    ...rest
}
: ThemedTextProps)
{
    const styleSheet = useMemo(
        () =>
        {
            const styleSheet = getThemedTextStyle(type, centered);

            if (styleOverride === undefined)
                return styleSheet;

            return (
            [
                styleSheet,
                styleOverride,
            ]);
        },
        [type, centered, styleOverride]);

    return (
        <Text
            style={styleSheet}
            {...rest}>
            {children}
        </Text>
    )
}

const _themedTextStyleCache
    : (TextStyle | undefined)[] = new Array(8 * 2);

export function getThemedTextStyle(
    type:
        | "header1"
        | "header2"
        | "header3"
        | "header4"
        | "label"
        | "paragraph"
        | "note"
        | "question"
        | "error",
    centered?: boolean): TextStyle
{
    let cacheKey = 0;
    switch (type)
    {
        case "header1": cacheKey += 0; centered ??= true; break;
        case "header2": cacheKey += 1; centered ??= true; break;
        case "header3": cacheKey += 2; centered ??= true; break;
        case "header4": cacheKey += 3; centered ??= true; break;
        case "label": cacheKey += 4; centered ??= false; break;
        case "paragraph": cacheKey += 5; centered ??= false; break;
        case "note": cacheKey += 6; centered ??= true; break;
        case "question": cacheKey += 7; centered ??= true; break;
        case "error": cacheKey += 8; centered ??= true; break;
    }
    cacheKey = (cacheKey * 9) + (centered ? 1 : 0);

    const cachedValue = _themedTextStyleCache[cacheKey];
    if (cachedValue !== undefined)
        return cachedValue;

    let styleSheet;

    switch (type)
    {
        case "header1":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 32,
                    marginBottom: 16,
                    marginInline: 8,
                    textAlign: centered ? "center" : "auto",
                    verticalAlign: "middle",
                    fontSize: 40,
                    fontWeight: 600,
                    color: ThemeColors.text,
                },
            });
            break;
        case "header2":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 28,
                    marginBottom: 12,
                    marginInline: 8,
                    textAlign: centered ? "center" : "auto",
                    verticalAlign: "middle",
                    fontSize: 32,
                    fontWeight: 600,
                    color: ThemeColors.text,
                },
            });
            break;
        case "header3":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 24,
                    marginBottom: 8,
                    marginInline: 8,
                    textAlign: centered ? "center" : "auto",
                    verticalAlign: "middle",
                    fontSize: 26,
                    fontWeight: 600,
                    color: Color.blendHex(ThemeColors.text, ThemeColors.less),
                },
            });
            break;
        case "header4":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 18,
                    marginBottom: 4,
                    marginInline: 8,
                    textAlign: centered ? "center" : "auto",
                    verticalAlign: "middle",
                    fontSize: 20,
                    fontWeight: 600,
                    color: Color.blendHex(Color.blend(
                        ThemeColors.text,
                        ThemeColors.less),
                        ThemeColors.less),
                },
            });
            break;
        case "label":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 24,
                    marginBottom: 4,
                    marginInline: 4,
                    textAlign: centered ? "center" : "auto",
                    verticalAlign: "bottom",
                    fontSize: 20,
                    fontWeight: 500,
                    color: ThemeColors.text,
                },
            });
            break;
        case "paragraph":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 8,
                    marginBottom: 8,
                    marginInline: 4,
                    textAlign: centered ? "center" : "auto",
                    verticalAlign: "top",
                    fontSize: 20,
                    fontWeight: 400,
                    color: ThemeColors.text,
                },
            });
            break;
        case "note":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 16,
                    marginBottom: 16,
                    marginInline: 8,
                    textAlign: centered ? "center" : "auto",
                    verticalAlign: "top",
                    fontSize: 16,
                    fontWeight: 400,
                    color: Color.blendHex(Color.blend(Color.blend(
                        ThemeColors.text,
                        ThemeColors.less),
                        ThemeColors.less),
                        ThemeColors.less),
                },
            });
            break;
        case "question":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 16,
                    marginBottom: 16,
                    marginInline: 8,
                    textAlign: centered ? "center" : "auto",
                    verticalAlign: "middle",
                    fontSize: 24,
                    fontWeight: 500,
                    color: ThemeColors.text,
                },
            });
            break;
        case "error":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    marginTop: 16,
                    marginBottom: 16,
                    marginInline: 8,
                    textAlign: centered ? "center" : "auto",
                    verticalAlign: "bottom",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#E03838",
                },
            });
            break;
    }

    _themedTextStyleCache[cacheKey] = styleSheet.text;
    return styleSheet.text;
}