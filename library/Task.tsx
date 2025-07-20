import { Color } from "./Color";
import { over } from "./IteratorExtensions";

export interface TaskDefinition
{
    title: string,
    description: string,
    color: string,
    attributes: TaskAttribute[];
}

export const TaskDefinition =
{
    fromDocValue(value: unknown): TaskDefinition | undefined
    {
        if (value === null
            || typeof value !== "object"
            || !("title" in value))
            return;

        return (
        {
            title: String(value["title"]),
            description: "description" in value ? String(value["description"]) : "",
            color: "color" in value ? Color.from(value["color"])?.toHex() ?? "#FFFFFF" : "#FFFFFF",
            attributes: "attributes" in value && value["attributes"] instanceof Array
                ? [
                    ...over(value["attributes"])
                        .map(TaskAttribute.fromDocValue)
                        .filter((v) => v !== undefined)
                ]
                : [],
        });
    },

    toDocValue(value: TaskDefinition): unknown
    {
        return (
        {
            title: value.title,
            description: value.description,
            color: value.color,
            attributes: value.attributes.map(TaskAttribute.toDocValue),
        });
    },
};

export type TaskAttribute =
    | TaskFixedDateAttributeDefinition
    | TaskDurationAttributeDefinition
    | TaskPriorityAttributeDefinition;

export interface TaskFixedDateAttributeDefinition
{
    type: "fixed-date",
    date: Date,
}

export interface TaskDurationAttributeDefinition
{
    type: "duration",
    durationTicks: number,
}

export interface TaskPriorityAttributeDefinition
{
    type: "priority",
    priority: number,
}

export const TaskAttribute =
{
    fromDocValue(value: unknown): TaskAttribute | undefined
    {
        if (value === null
            || typeof value !== "object"
            || !("type" in value))
            return undefined;

        switch (value["type"])
        {
            case "duration":
                return (
                {
                    type: "duration",
                    durationTicks: "duration-ticks" in value
                        ? Number(value["duration-ticks"])
                        : 0,
                });
            case "fixed-date":
            {
                if (!("date" in value))
                    return undefined;

                return (
                {
                    type: "fixed-date",
                    date: new Date(Number(value["date"])),
                });
            }
            case "priority":
                return (
                {
                    type: "priority",
                    priority: "priority" in value
                        ? Number(value["priority"])
                        : 0,
                });
            default:
                return undefined;
        }
    },

    toDocValue(value: TaskAttribute): unknown
    {
        switch (value["type"])
        {
            case "duration":
                return (
                {
                    ["type"]: "duration",
                    ["duration-ticks"]: value.durationTicks,
                });
            case "fixed-date":
                return (
                {
                    ["type"]: "fixed-date",
                    ["date"]: value.date.getTime(),
                });
            case "priority":
                return (
                {
                    ["type"]: "priority",
                    ["priority"]: value.priority,
                });
            default:
                return undefined;
        }
    },
};