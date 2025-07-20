
export type IterateOver<T, TReturn = any, TNext = any> =
    | Iterable<T, TReturn, TNext>
    | Iterator<T, TReturn, TNext>
    | Iterator<T, TReturn, TNext>["next"];

export class IteratorOver<T, TReturn = any, TNext = any>
    implements IteratorObject<T, TReturn, TNext>,
    Pick<Array<T>, "join" | "toSorted">
{
    private readonly _from: Iterator<T, TReturn, TNext>;

    public constructor(from: IterateOver<T, TReturn, TNext>)
    {
        this._from =
            "next" in from ? from :
            from instanceof Function ? { next: from } :
            from[Symbol.iterator]();
    }

    public map<U>(callbackfn: (value: T, index: number) => U)
        : IteratorOver<U, undefined, unknown>
    {
        let i = -1;
        return new IteratorOver<U, undefined, unknown>((nextValue) =>
        {
            const { value, done } = this._from.next(nextValue as TNext);

            if (done)
                return { value: undefined, done: true };

            return { value: callbackfn(value, ++i), done: false };
        });
    }

    public filter<S extends T>(predicate: (value: T, index: number) => value is S)
        : IteratorOver<S, undefined, unknown>;
    public filter(predicate: (value: T, index: number) => unknown)
        : IteratorOver<T, undefined, unknown>;
    public filter(predicate: (value: T, index: number) => unknown)
        : IteratorOver<T, undefined, unknown>
    {
        let i = -1;
        return new IteratorOver<T, undefined, unknown>((next) =>
        {
            while (true)
            {
                const { value, done } = this._from.next(next as TNext);

                if (done)
                    return { value: undefined, done: true };

                if (predicate(value, ++i))
                    return { value, done: false };
            }
        });
    }

    public take(limit: number): IteratorOver<T, undefined, unknown>
    {
        return new IteratorOver<T, undefined, unknown>((next) =>
        {
            if (limit > 0)
            {
                --limit;

                const { value, done } = this._from.next(next as TNext);

                if (done)
                    return { value: undefined, done: true };

                return { value, done: false };
            }
            else
                return { value: undefined, done: true };
        });
    }

    public drop(count: number): IteratorOver<T, undefined, unknown>
    {
        return new IteratorOver<T, undefined, unknown>((next) =>
        {
            while (count > 0)
            {
                --count;

                const { done } = this._from.next(next as TNext);

                if (done)
                    return { value: undefined, done: true };
            }

            const { value, done } = this._from.next(next as TNext);

            if (done)
                return { value: undefined, done: true };

            return { value, done: false };
        });
    }

    public flatMap<U>(
        callback: (value: T, index: number) =>
            IterateOver<U, unknown, undefined>)
        : IteratorOver<U, undefined, unknown>
    {
        let currentNext: Iterator<U, unknown, undefined>["next"] | undefined;

        let i = -1;
        return new IteratorOver<U, undefined, unknown>((next) =>
        {
            while (true)
            {
                if (currentNext !== undefined)
                {
                    const result = currentNext();

                    if (!result.done)
                        return result;
                }

                const { value, done } = this._from.next(next as TNext);

                if (done)
                    return { value: undefined, done: true };

                const iterator = callback(value, ++i);
                currentNext =
                    "next" in iterator ? iterator.next :
                    iterator instanceof Function ? iterator :
                    iterator[Symbol.iterator]().next;
            }
        });
    }

    public reduce(callbackfn: (
        previousValue: T,
        currentValue: T,
        currentIndex: number) => T): T;
    public reduce(callbackfn: (
        previousValue: T,
        currentValue: T,
        currentIndex: number) => T, initialValue: T): T;
    public reduce<U>(callbackfn: (
        previousValue: U,
        currentValue: T,
        currentIndex: number) => U, initialValue: U): U;
    public reduce<U>(callbackfn: (
        previousValue: U,
        currentValue: T,
        currentIndex: number) => U, initialValue?: U): U
    {
        let previousValue = initialValue;

        for (let currentIndex = 0;; ++currentIndex)
        {
            const { value, done } = this._from.next();

            if (done)
            {
                if (previousValue === undefined && currentIndex === 0)
                    throw new TypeError(
                        "Reduce of empty array with no initial value");

                return previousValue as U; // initialValue !== undefined here.
            }

            if (previousValue === undefined && currentIndex === 0)
                previousValue = value! as U; // T === U here.
            else
                previousValue = callbackfn(
                    previousValue as U,
                    value,
                    currentIndex);
        }
    }

    public toArray(): T[] { return [...this] }

    public forEach(callbackfn: (value: T, index: number) => void, thisArg?: any): void
    {
        let i = -1;
        for (const value of this)
            callbackfn.call(thisArg, value, ++i);
    }

    public some(predicate: (value: T, index: number) => unknown, thisArg?: any): boolean
    {
        let i = -1;
        for (const value of this)
            if (predicate.call(thisArg, value, ++i))
                return true;

        return false;
    }

    public every<S extends T>(predicate: (value: T, index: number) => value is S, thisArg?: any): this is IteratorOver<S, TReturn, TNext>;
    public every(predicate: (value: T, index: number) => unknown, thisArg?: any): boolean;
    public every(predicate: (value: T, index: number) => unknown, thisArg?: any): boolean
    {
        let i = -1;
        for (const value of this)
            if (!predicate.call(thisArg, value, ++i))
                return false;

        return true;
    }

    public find<S extends T>(predicate: (value: T, index: number) => value is S, thisArg?: any): S | undefined;
    public find(predicate: (value: T, index: number) => unknown, thisArg?: any): T | undefined;
    public find(predicate: (value: T, index: number) => unknown, thisArg?: any): T | undefined
    {
        let i = -1;
        for (const value of this)
            if (!predicate.call(thisArg, value, ++i))
                return value;

        return undefined;
    }

    public join(separator: string = ","): string
    {
        let result = "";
        let isFirst = true;
        for (const value of this)
        {
            if (isFirst)
                isFirst = false;
            else
                result += separator;

            result += value;
        }

        return result;
    }

    public toSorted(compareFn?: (a: T, b: T) => number): T[]
    {
        return [...this].sort(compareFn);
    }

    public [Symbol.iterator](): this { return this }

    public get [Symbol.toStringTag](): string { return "IteratorObject" };

    public next(...[value]: [] | [TNext]): IteratorResult<T, TReturn>
    {
        return this._from.next(value as TNext);
    }

    public return(value?: TReturn | undefined): IteratorResult<T, TReturn>
    {
        if (this._from.return === undefined)
            return { value: undefined as TReturn, done: true };

        return this._from.return(value);
    }

    public throw(e?: any): IteratorResult<T, TReturn>
    {
        if (this._from.throw === undefined)
            return { value: undefined as TReturn, done: true };

        return this._from.throw(e);
    }

    public [Symbol.dispose](): void
    {
        if (!(Symbol.dispose in this._from))
            return;

        const dispose = this._from[Symbol.dispose];
        if (dispose instanceof Function)
            dispose();
    }
}

export function over<T, TReturn = undefined, TNext = unknown>(
    collection:
        | Iterable<T, TReturn, TNext>
        | Iterator<T, TReturn, TNext>
        | Iterator<T, TReturn, TNext>["next"]
        | null
        | undefined)
    : IteratorOver<T, TReturn, TNext>
{
    if (collection === null
        || collection === undefined)
        return new IteratorOver([]) as any;

    const iterator =
        "next" in collection ? collection :
        collection instanceof Function ? { next: collection } :
        collection[Symbol.iterator]();

    return new IteratorOver(iterator);
}

export function range(to: number)
    : IteratorOver<number, undefined, unknown>;
export function range(from: number, to: number, step?: number)
    : IteratorOver<number, undefined, unknown>;
export function range(v1: number, v2?: number, v3?: number)
    : IteratorOver<number, undefined, unknown>
{
    if (v2 === undefined)
    {
        v2 = v1;
        v1 = 0;
    }

    v3 ??= 1;

    return over<number, undefined, unknown>(() =>
    {
        if (v1 < v2)
            return { value: undefined, done: true };

        const value = v1;
        v1 += v3;

        return { value, done: false };
    });
}