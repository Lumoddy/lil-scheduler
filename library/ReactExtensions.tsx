
export type UseStatePair<TGet, TSet extends TGet = TGet> =
    [TGet, React.Dispatch<React.SetStateAction<TSet>>];