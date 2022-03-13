import type { DeepPartial } from 'typeorm';

export type Entries<T> = {
	[K in keyof T]: [K, T[K]]
}[keyof T][];
export type DeepRequired<T> = T extends undefined ? never : T extends object ? {
	// [MK in keyof T]?: DeepRequired<T[MK]>
	[MK in keyof T]-?: DeepRequired<T[MK]>
} : T;
export type Optional<T> = {
	[K in keyof T]: T[K]
};

export const TypedEntries = <T>(obj: T) => Object.entries(obj) as Entries<T>;

export const isObject = (v: any) => typeof v === 'object' && v !== null && !Array.isArray(v) && v !== undefined;

export const deepRequired = <T extends Object>(obj: T): DeepRequired<T> =>
	Object.fromEntries((Object.entries(obj) as (Entries<T>))
		.filter(([, v]) => typeof v !== 'undefined')
		.map(([k, v]) => [k, isObject(v) ? deepRequired(v) : v])) as DeepRequired<T>;

// Incorrect return type: should be like Some<T> - like some of the keys of T mapped to T[K]
// Right now its just like hard required I think?

// Maps the entries of an object with the correct typings.

export const MapEntries = <T extends Object>(obj: T) =>
	<V>(f: (k: keyof T, v: T[keyof T],) => V) =>
		Object.fromEntries(TypedEntries(obj).map(([k, v]) => [k, f(k, v)] as [keyof T, V])) as { [K in keyof T]: V };

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

export const UpdateObject = <T>(orig: T, update: DeepPartial<T>): T =>
	!isObject(update)
		? (update as any as T)
		: MapEntries(orig)((k, v) => update[k] !== undefined
			? UpdateObject(v, update[k] as any as typeof v)
			: v) as T;

// const orig
// = {
// 	dog:
// {
// 	name: 'Fido',
// 	age: 3,
// },
// 	name: 'Joe',
// };

// const updateData
// = {
// 	dog:
// {
// 	age: 4,
// },
// };

// const updated = UpdateObject(orig, updateData);

// console.log({ updated });

// updated = {
// 	dog:
// {
// 	name: 'Fido',
// 	age: 4,
// },
// 	name: 'Joe',
// };
