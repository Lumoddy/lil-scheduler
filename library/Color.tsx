type ColorHex = `#${string}`;

export class Color
{
    private static readonly _toColorPattern = new RegExp(
        + "^(?:#?(?<r1>[0-9a-zA-Z])(?<g1>[0-9a-zA-Z])(?<b1>[0-9a-zA-Z])(?<a1>[0-9a-zA-Z])?)"
        + "|(?:#?(?<r2>[0-9a-zA-Z]{2})(?<g2>[0-9a-zA-Z]{2})(?<b2>[0-9a-zA-Z]{2})(?<a2>[0-9a-zA-Z]{2})?)"
        + "$");

    public r: number;
    public g: number;
    public b: number;
    public a: number;

    public constructor(r: number, g: number, b: number, a?: number);
    public constructor(value:
        | [r: number, g: number, b: number, a?: number]
        | string
        | { r: number, g: number, b: number, a?: number });
    public constructor(v1: any, v2?: any, v3?: any, v4?: any)
    {
        if (typeof v1 === "number")
        {
            this.r = v1;
            this.g = v2;
            this.b = v3;
            this.a = v4 ?? 1;
        }
        else if (v1 instanceof Array)
        {
            this.r = v1[0];
            this.g = v1[1];
            this.b = v1[2];
            this.a = v1[3] ?? 1;
        }
        else if (typeof v1 === "string")
        {
            const match = Color._toColorPattern.exec(v1);
            if (match === null || match.groups === undefined)
                throw new SyntaxError(
                    `Could not convert string "${v1}" into Color.`);

            if (match.groups.r1 !== undefined)
            {
                this.r = Number.parseInt(match.groups.r1, 0x10) / 0xF;
                this.g = Number.parseInt(match.groups.g1, 0x10) / 0xF;
                this.b = Number.parseInt(match.groups.b1, 0x10) / 0xF;
                this.a = match.groups.a1 === undefined ? 1 :
                    Number.parseInt(match.groups.a1, 0x10) / 0xF;
                return;
            }

            if (match.groups.r2 !== undefined)
            {
                this.r = Number.parseInt(match.groups.r2, 0x10) / 0xFF;
                this.g = Number.parseInt(match.groups.g2, 0x10) / 0xFF;
                this.b = Number.parseInt(match.groups.b2, 0x10) / 0xFF;
                this.a = match.groups.a2 === undefined ? 1 :
                    Number.parseInt(match.groups.a2, 0x10) / 0xFF;
                return;
            }

            throw new SyntaxError(
                `Could not convert string "${v1}" into Color.`);
        }
        else
        {
            this.r = v1.r;
            this.g = v1.g;
            this.b = v1.b;
            this.a = v1.a ?? 1;
        }
    }

    public toHex(): ColorHex
    {
        const r = Math.round(this.r * 0xFF) & 0xFF;
        const b = Math.round(this.b * 0xFF) & 0xFF;
        const g = Math.round(this.g * 0xFF) & 0xFF;
        const a = Math.round(this.a * 0xFF) & 0xFF;

        return `#${
            digit((r >> 4) & 0xF)}${digit((r >> 0) & 0xF)}${
            digit((g >> 4) & 0xF)}${digit((g >> 0) & 0xF)}${
            digit((b >> 4) & 0xF)}${digit((b >> 0) & 0xF)}${
            a === 0xFF ? "" : digit((a >> 4) & 0xF) + digit((a >> 0) & 0xF)}`;

        function digit(digit: number): string
        {
            switch (digit)
            {
                case 0x0: return "0";
                case 0x1: return "1";
                case 0x2: return "2";
                case 0x3: return "3";
                case 0x4: return "4";
                case 0x5: return "5";
                case 0x6: return "6";
                case 0x7: return "7";
                case 0x8: return "8";
                case 0x9: return "9";
                case 0xA: return "A";
                case 0xB: return "B";
                case 0xC: return "C";
                case 0xD: return "D";
                case 0xE: return "E";
                case 0xF: return "F";
                default:
                    throw new Error();
            }
        }
    }

    public static blend(
        from:
            | Color
            | [r: number, g: number, b: number, a?: number]
            | string
            | { r: number, g: number, b: number, a?: number },
        to:
            | Color
            | [r: number, g: number, b: number, a?: number]
            | string
            | { r: number, g: number, b: number, a?: number },
        method?:
            | "linear" | "normal" | undefined
            | "multiply" | "*"
            | "screen"
            | "additive" | "+"
            | "subtractive" | "-"): Color
    {
        return new Color(from).blend(to, method);
    }
    public blend(
        other:
            | Color
            | [r: number, g: number, b: number, a?: number]
            | string
            | { r: number, g: number, b: number, a?: number },
        method?:
            | "linear" | "normal" | undefined
            | "multiply" | "*"
            | "screen"
            | "additive" | "+"
            | "subtractive" | "-"): Color
    {
        if (!(other instanceof Color))
            other = new Color(other);

        let { r, g, b, a } = other;
        a ??= 1;

        switch (method)
        {
            case "multiply":
            case "*":
                return new Color(
                    this.r * r,
                    this.g * g,
                    this.b * b,
                    this.a * a);
            case "screen":
                return new Color(
                    1 - (1 - this.r) * (1 - r),
                    1 - (1 - this.g) * (1 - g),
                    1 - (1 - this.b) * (1 - b),
                    this.a + a - (this.a * a));
            case "additive":
            case "+":
                return new Color(
                    Math.min(this.r + r, 1),
                    Math.min(this.g + g, 1),
                    Math.min(this.b + b, 1),
                    Math.min(this.a + a, 1));
            case "subtractive":
            case "-":
                return new Color(
                    Math.max(this.r - r, 0),
                    Math.max(this.g - g, 0),
                    Math.max(this.b - b, 0),
                    Math.max(this.a - a, 0));
            case "linear":
            case "normal":
            case undefined:
            default:
            {
                const outA = a + (this.a * (1 - a));
                if (outA === 0)
                    return new Color(0, 0, 0, 0);

                return new Color(
                    ((r * a) + (this.r * this.a * (1 - a))) / outA,
                    ((g * a) + (this.g * this.a * (1 - a))) / outA,
                    ((b * a) + (this.b * this.a * (1 - a))) / outA,
                    outA);
            }
        }
    }

    public toString(): string { return this.toHex() }
    public get [Symbol.toStringTag](): string { return "Color" }
}