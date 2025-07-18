import { ThemeColors } from "@/constants/ThemeColors";
import { Href, Stack } from "expo-router";
import { Platform, View } from "react-native";
import { Expand, Row } from "./Flex";
import { ThemedButton, ThemedButtonProps } from "./ThemedButton";
import { ThemedLink } from "./ThemedLink";
import { ThemedLogo, ThemedLogoProps } from "./ThemedLogo";
import { ThemedText } from "./ThemedText";

export type ThemedHeaderProps = typeof Stack.Screen extends (
    props:
    {
        options:
        {
            header: ((props: infer T) => any) | undefined,
        },
    }) => any ? T : never;

export function themedLogoTag(type?: ThemedLogoProps["type"]): string
{
    if (type === undefined)
        return "$logo";
    else
        return `$logo-${type}`;
}

export function themedHeader(props?: { lockUI: boolean })
{
    const { lockUI } = props ?? {};

    return (props: ThemedHeaderProps) => (
        <View
            style={
            {
                backgroundColor: ThemeColors.background,
                minHeight: 90,
                paddingBottom: 20,
                paddingTop: Platform.OS === "ios" ? 20 : 0,
                position: "relative",
            }}>
            {
                (props.options.headerTitle ?? props.options.title) === "$logo"
                    ? <ThemedLogo
                        type={props.options.headerLargeTitle
                            ? "large-text"
                            : "faded-text"}/> :
                (props.options.headerTitle ?? props.options.title) === "$logo-large-text"
                    ? <ThemedLogo type="large-text"/> :
                (props.options.headerTitle ?? props.options.title) === "$logo-small-text"
                    ? <ThemedLogo type="small-text"/> :
                (props.options.headerTitle ?? props.options.title) === "$logo-faded-text"
                    ? <ThemedLogo type="faded-text"/> :
                props.options.headerTitle instanceof Function
                    ? props.options.headerTitle({ children: props.route.name }) :
                <ThemedText
                    type={props.options.headerLargeTitle
                        ? "header1"
                        : "header3"}
                    children={props.options.headerTitle ?? props.options.title ?? props.route.name}/>
            }
            <Row
                style={
                {
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}>
                {
                    props.options.headerLeft !== undefined
                        ? <props.options.headerLeft
                            canGoBack={props.back !== undefined}
                            href={props.back?.href}
                            label={props.back?.title}
                            tintColor={ThemeColors.bold}/>
                        : props.back === undefined
                            || props.back.href === undefined
                            ? undefined
                            : <ThemedLink
                                disabled={lockUI}
                                href={props.back.href as Href}
                                children={props.back.title ?? "Back"}/>
                }
                <Expand/>
                {
                    props.options.headerRight !== undefined
                        ? <props.options.headerRight
                            canGoBack={props.back !== undefined}
                            tintColor={ThemeColors.bold}/>
                        : undefined
                }
            </Row>
        </View>
    );
}

type ThemedHeaderButtonProps = typeof Stack.Screen extends (
    props:
    {
        options:
        {
            headerLeft: ((props: infer T) => any) | undefined,
            headerRight: ((props: infer T) => any) | undefined,
        },
    }) => any
        ? T
        : never;

export function themedHeaderButton(
    text: string,
    buttonProps?: Omit<ThemedButtonProps, "children">)
{
    return (props: ThemedHeaderButtonProps) => (
        <ThemedButton
            style="textonly"
            color="bold"
            size="small"
            {...buttonProps}
            children={text}/>
    );
}