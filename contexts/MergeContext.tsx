import { Context, ReactNode } from "react";

type _ReverseTupleOfContexts<T extends readonly Context<any>[]> =
    T extends readonly [Context<infer F>, ...infer R extends readonly Context<any>[]] ? readonly [F, ..._ReverseTupleOfContexts<R>] :
    T extends readonly [...infer R extends readonly Context<any>[], Context<infer F>] ? readonly [..._ReverseTupleOfContexts<R>, F] :
    T extends readonly [] ? readonly [] :
    T extends readonly Context<infer V>[] ? readonly V[] :
    never;

export interface MergeContextProps<T extends readonly any[]>
{
    children?: ReactNode;
    values: _ReverseTupleOfContexts<T>;
    contexts: T;
}

export function MergeContext<const T extends readonly Context<any>[]>(
{
    children,
    values,
    contexts,
}
: MergeContextProps<T>)
{
    let result = children;

    const length = Math.min(contexts.length, values.length);

    for (let i = 0; i < length; ++i)
    {
        const Context = contexts[i];
        result = <Context value={values[i]} children={result}/>
    }

    return result;
}