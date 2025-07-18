import { ColorHex } from "./Color";

export interface TaskDefinition
{
    title: string,
    description: string,
    color: ColorHex,
    attributes: TaskAttribute[];
}

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