
export type IterateOver<T, TReturn = any, TNext = any> =
    | Iterable<T, TReturn, TNext>
    | Iterator<T, TReturn, TNext>
    | Iterator<T, TReturn, TNext>["next"];

class _Iterator<T, TReturn, TNext> implements IteratorObject<T, TReturn, TNext>
{
    private readonly _from: Iterator<T, TReturn, TNext>;

    public constructor(from: IterateOver<T, TReturn, TNext>)
    {
        this._from =
            "next" in from ? from :
            from instanceof Function ? { next: from } :
            from[Symbol.iterator]();
    }

    map<U>(callbackfn: (value: T, index: number) => U)
        : IteratorObject<U, undefined, unknown>
    {
        let i = -1;
        return new _Iterator<U, undefined, unknown>((nextValue) =>
        {
            const { value, done } = this._from.next(nextValue as TNext);

            if (done)
                return { value: undefined, done: true };

            return { value: callbackfn(value, ++i), done: false };
        });
    }

    filter<S extends T>(predicate: (value: T, index: number) => value is S)
        : IteratorObject<S, undefined, unknown>;
    filter(predicate: (value: T, index: number) => unknown)
        : IteratorObject<T, undefined, unknown>
    {
        let i = -1;
        return new _Iterator<T, undefined, unknown>((next) =>
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

    take(limit: number): IteratorObject<T, undefined, unknown>
    {
        return new _Iterator<T, undefined, unknown>((next) =>
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

    drop(count: number): IteratorObject<T, undefined, unknown>
    {
        return new _Iterator<T, undefined, unknown>((next) =>
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

    flatMap<U>(
        callback: (value: T, index: number) =>
            IterateOver<U, unknown, undefined>)
        : IteratorObject<U, undefined, unknown>
    {
        let currentNext: Iterator<U, unknown, undefined>["next"] | undefined;

        let i = -1;
        return new _Iterator<U, undefined, unknown>((next) =>
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

    reduce(callbackfn: (
        previousValue: T,
        currentValue: T,
        currentIndex: number) => T): T;
    reduce(callbackfn: (
        previousValue: T,
        currentValue: T,
        currentIndex: number) => T, initialValue: T): T;
    reduce<U>(callbackfn: (
        previousValue: U,
        currentValue: T,
        currentIndex: number) => U, initialValue: U): U;
    reduce<U>(callbackfn: (
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
                previousValue = value as any as U; // T === U here.
            else
                previousValue = callbackfn(
                    previousValue as U,
                    value,
                    currentIndex);
        }
    }

    toArray(): T[] { return [...this as any] }

    forEach(callbackfn: (value: T, index: number) => void): void
    {
        let i = -1;
        for (const value of this as any)
            callbackfn(value, ++i);
    }

    some(predicate: (value: T, index: number) => unknown): boolean
    {
        let i = -1;
        for (const value of this as any)
            if (predicate(value, ++i))
                return true;

        return false;
    }

    every(predicate: (value: T, index: number) => unknown): boolean
    {
        let i = -1;
        for (const value of this as any)
            if (!predicate(value, ++i))
                return false;

        return true;
    }

    find<S extends T>(predicate: (value: T, index: number) => value is S): S | undefined;
    find(predicate: (value: T, index: number) => unknown): T | undefined;
    find(predicate: (value: T, index: number) => unknown): T | undefined
    {
        let i = -1;
        for (const value of this as any)
            if (!predicate(value, ++i))
                return value;

        return undefined;
    }

    [Symbol.iterator](): IteratorObject<T, TReturn, TNext> { return this }

    get [Symbol.toStringTag](): string { return "IteratorObject" };

    next(...[value]: [] | [TNext]): IteratorResult<T, TReturn>
    {
        return this._from.next(value as any);
    }

    return(value?: TReturn | undefined): IteratorResult<T, TReturn>
    {
        if (this._from.return === undefined)
            return { value: undefined as TReturn, done: true };

        return this._from.return(value);
    }

    throw(e?: any): IteratorResult<T, TReturn>
    {
        if (this._from.throw === undefined)
            return { value: undefined as TReturn, done: true };

        return this._from.throw(e);
    }

    [Symbol.dispose](): void
    {
        if (!(Symbol.dispose in this._from))
            return;

        const dispose = this._from[Symbol.dispose];
        if (dispose instanceof Function)
            dispose();
    }
}

export function over<T, TReturn = any, TNext = any>(
    collection:
        | Iterable<T, TReturn, TNext>
        | Iterator<T, TReturn, TNext>
        | Iterator<T, TReturn, TNext>["next"])
    : IteratorObject<T, TReturn, TNext>
{
    const iterator =
        "next" in collection ? collection :
        collection instanceof Function ? { next: collection } :
        collection[Symbol.iterator]();

    return new _Iterator(iterator);
}

export function range(to: number)
    : IteratorObject<number, undefined, unknown>;
export function range(from: number, to: number, step?: number)
    : IteratorObject<number, undefined, unknown>;
export function range(v1: number, v2?: number, v3?: number)
    : IteratorObject<number, undefined, unknown>
{
    if (v2 === undefined)
    {
        v2 = v1;
        v1 = 0;
    }

    v3 ??= 1;

    return function*()
    {
        for (let i = v1; i < v2; i += v3)
            yield i;

        return undefined;
    }()
}