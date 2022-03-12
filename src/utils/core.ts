
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

// Maps the entries of an object with the correct typings.

export const MapEntries = <T extends Object>(obj: T) =>
	<V>(f: (k: T[keyof T]) => V) =>
		Object.fromEntries(TypedEntries(obj).map(([k, v]) => [k, f(v)] as [keyof T, V])) as { [K in keyof T]: V };

/**
 * Example:
	const mapTest = {
		1: 1,
		2: 2,
	} as const;

	const mapper = <S extends number>(i: S) => `${i}` as `${S}`;
	const mappedTest = MapEntries(mapTest)(mapper);

Result Typing:

	const mappedTest: {
			readonly 1 : "1" | "2",
			readonly 2 : "1" | "2",
	}
 */
