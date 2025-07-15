
export function iteratorMap<T, U>(
    collection: Iterable<T>,
    callbackfn: (value: T, index: number) => U,
    thisArg?: any): Iterable<U>;
export function iteratorMap<T, U>(
    collection: Iterator<T>,
    callbackfn: (value: T, index: number) => U,
    thisArg?: any): Iterator<U>;
export function iteratorMap<T, U>(
    collection: Iterable<T> | Iterator<T>,
    callbackfn: (value: T, index: number) => U,
    thisArg?: any): Iterable<U> | Iterator<U>;
export function iteratorMap<T, U>(
    collection: Iterable<T> | Iterator<T>,
    callbackfn: (value: T, index: number) => U,
    thisArg?: any): Iterable<U> | Iterator<U>
{
    if ("next" in collection)
    {
        let i = 0;
        return (
        {
            next()
            {
                const { value, done } = collection.next();
                if (done)
                    return { value: undefined, done: true };

                return { value: callbackfn.call(thisArg, value, i++) };
            }
        });
    }
    else
        return (
        {
            [Symbol.iterator]: () =>
                iteratorMap(collection[Symbol.iterator](), callbackfn, thisArg),
        });
}

export function iteratorFilter<T>(
    collection: Iterable<T>,
    predicate: (value: T, index: number) => unknown,
    thisArg?: any): Iterable<T>;
export function iteratorFilter<T>(
    collection: Iterator<T>,
    predicate: (value: T, index: number) => unknown,
    thisArg?: any): Iterator<T>;
export function iteratorFilter<T>(
    collection: Iterable<T> | Iterator<T>,
    predicate: (value: T, index: number) => unknown,
    thisArg?: any): Iterable<T> | Iterator<T>;
export function iteratorFilter<T, S extends T>(
    collection: Iterable<T>,
    predicate: (value: T, index: number) => value is S,
    thisArg?: any): Iterable<T>;
export function iteratorFilter<T, S extends T>(
    collection: Iterator<T>,
    predicate: (value: T, index: number) => value is S,
    thisArg?: any): Iterator<T>;
export function iteratorFilter<T, S extends T>(
    collection: Iterable<T> | Iterator<T>,
    predicate: (value: T, index: number) => value is S,
    thisArg?: any): Iterable<T> | Iterator<T>;
export function iteratorFilter<T>(
    collection: Iterable<T> | Iterator<T>,
    predicate: (value: T, index: number) => unknown,
    thisArg?: any): Iterable<T> | Iterator<T>
{
    if ("next" in collection)
    {
        let i = 0;
        return (
        {
            next()
            {
                while (true)
                {
                    const { value, done } = collection.next();
                    if (done)
                        return { value: undefined, done: true };

                    if (!predicate.call(thisArg, value, i++))
                        continue;

                    return { value };
                }
            }
        });
    }
    else
        return (
        {
            [Symbol.iterator]: () =>
                iteratorFilter(collection[Symbol.iterator](), predicate, thisArg),
        });
}

export function iteratorReduce<T>(
    collection: Iterable<T> | Iterator<T>,
    callbackfn: (previousValue: T, currentValue: T, currentIndex: number) => T)
    : T;
export function iteratorReduce<T>(
    collection: Iterable<T> | Iterator<T>,
    callbackfn: (previousValue: T, currentValue: T, currentIndex: number) => T,
    initialValue: T): T;
export function iteratorReduce<T, U>(
    collection: Iterable<T> | Iterator<T>,
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U,
    initialValue: U): U;
export function iteratorReduce<T, U>(
    collection: Iterable<T> | Iterator<T>,
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U,
    initialValue?: U): U
{
    const iterator = "next" in collection
        ? collection
        : collection[Symbol.iterator]();

    let isFirst = true;
    let result = initialValue;

    let i = 0;
    while (true)
    {
        const { value, done } = iterator.next();
        if (done)
        {
            if (isFirst && result === undefined)
                throw new TypeError(
                    "Reduce of empty array with no initial value");

            return result as U; // U extends undefined here.
        }

        if (isFirst && result === undefined)
        {
            isFirst = false;
            result = value as any as U; // U equals T here.
            ++i;
        }
        else
            result = callbackfn(result as U, value, i++); // initialValue is not undefined here.
    }
}