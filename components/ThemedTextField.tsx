import { ThemeColors } from "@/constants/ThemeColors";
import { Color } from "@/library/Color";
import { useMemo } from "react";
import { StyleSheet, TextInput, TextInputProps, TextStyle } from "react-native";

export interface ThemedTextFieldProps
    extends Omit<TextInputProps, "children" | "style">
{
    style?:
        | "fill"
        | "outline";
    styleOverride?: TextInputProps["style"];
}

/**
 * A styled text component whose appearance and options derive from the Figma
 * design seen
 * [here](https://www.figma.com/design/P1BbYTpp52F5FC76qzVuGZ/Lil--Scheduler-2?node-id=32-79&t=cr1ZhwGtXZ91N6rd-1).
 */
export function ThemedTextField(
{
    style = "fill",
    styleOverride,
    ...rest
}
: ThemedTextFieldProps)
{
    const styleSheet = useMemo(
        () =>
        {
            const styleSheet = getThemedTextFieldStyle(style);

            if (styleOverride === undefined)
                return styleSheet;

            return (
            [
                styleSheet,
                styleOverride,
            ]);
        },
        [style, styleOverride]);

    return (
        <TextInput
            style={styleSheet}
            placeholderTextColor={Color.blendHex(Color.blend(Color.blend(
                Color.blend(ThemeColors.more, ThemeColors.more),
                Color.blend(ThemeColors.more, ThemeColors.more)),
                Color.blend(ThemeColors.more, ThemeColors.more)),
                Color.blend(ThemeColors.more, ThemeColors.more))}
            {...rest}/>
    )
}

const _themedTextFieldStyleCache : (TextStyle | undefined)[] = new Array(2);

export function getThemedTextFieldStyle(style: "fill" | "outline"): TextStyle
{
    let cacheKey = 0;
    switch (style)
    {
        case "fill": cacheKey += 0; break;
        case "outline": cacheKey += 1; break;
    }

    const cachedValue = _themedTextFieldStyleCache[cacheKey];
    if (cachedValue !== undefined)
        return cachedValue;

    let styleSheet;

    switch (style)
    {
        case "fill":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    padding: 16,
                    margin: 6,
                    borderRadius: 16,
                    borderWidth: 0,
                    userSelect: "text",
                    backgroundColor: Color.blendHex(
                        ThemeColors.less,
                        ThemeColors.less),
                    verticalAlign: "middle",
                    fontSize: 16,
                    color: ThemeColors.text,
                    fontWeight: "400",
                },
            });
            break;
        case "outline":
            styleSheet = StyleSheet.create(
            {
                text:
                {
                    padding: 16,
                    margin: 6,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: Color.blendHex(
                        ThemeColors.more,
                        ThemeColors.more),
                    userSelect: "text",
                    backgroundColor: Color.blendHex(
                        ThemeColors.less,
                        ThemeColors.less),
                    verticalAlign: "middle",
                    fontSize: 16,
                    color: ThemeColors.text,
                    fontWeight: "400",
                },
            });
            break;
    }

    _themedTextFieldStyleCache[cacheKey] = styleSheet.text;
    return styleSheet.text;
}