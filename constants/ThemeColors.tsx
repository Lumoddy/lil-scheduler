import { Color, ColorHex } from "@/library/Color";

const _rootColors =
{
    base: "#272727" as ColorHex,
    less: "#00000014" as ColorHex,
    more: "#FFFFFF0A" as ColorHex,
    minimum: "#000000" as ColorHex,
    maximum: "#FFFFFF" as ColorHex,
    bold: "#516FD3" as ColorHex,
    glow: "#FFFFFF" as ColorHex,
    text: "#FFFFFF" as ColorHex,
};

export const ThemeColors =
{
    ..._rootColors,
    background: Color.blendHex(Color.blend(
        _rootColors.base,
        _rootColors.less),
        _rootColors.less),
} as const