
export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][];
export type DeepRequired<T> = T extends undefined ? never : T extends object ? {
  [MK in keyof T]-?: DeepRequired<T[MK]>
} : T;
export const TypedEntries = <T>(obj: T) => Object.entries(obj) as Entries<T>;
export const deepRequired = <T extends Object>(obj: T): DeepRequired<T> =>
  Object.fromEntries((Object.entries(obj) as (Entries<T>))
    .filter(([, v]) => typeof v !== 'undefined')
    .map(([k, v]) => [k, v instanceof Object && !Array.isArray(v) ? deepRequired(v) : v])) as DeepRequired<T>;