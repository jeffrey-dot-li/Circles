import { Column, CreateDateColumn, Entity, EntitySchema, EntitySchemaColumnOptions, PrimaryGeneratedColumn } from 'typeorm';
import { DeepPartial } from 'redux';
import type { SchemaWithMetadata } from './base';
import { BaseColumnSchemaInterface, BaseColumnSchemaPart } from './base';
import type { CircleMetadata, PartialCircle, SavedCircleData } from '~/types/Circles';
import { CircleData } from '~/types/Circles';
import { Color, fromHex, toHex } from '~/utils/color';
import { Vec } from '~/utils/svg';
import type { MandateProps } from '~/types/utils';
import { deepRequired } from '~/utils/core';

export type PartialSchema = MandateProps<Partial<NoteSchema>, 'id'>;

export const SchemaToDataPartial = <D extends PartialSchema>({ content, radius, title, id, popped, color, ...note }: D) => deepRequired({
	content,
	radius,
	title,
	color: typeof color === 'string' ? fromHex(color) : undefined,
	metadata:
	{
		createdAt: note.createdAt,
		updatedAt: note.updatedAt,
		id,
	},
	popped,
});

export const SchemaToData = ({ content, radius, title, id, popped, ...note }: NoteSchema): SavedCircleData => ({
	content,
	radius,
	title,
	color: fromHex(note.color),
	metadata:
	{
		createdAt: note.createdAt,
		updatedAt: note.updatedAt,
		id,
	},
	popped,
});

export const DataToSchema
	= <D extends PartialCircle = PartialCircle>	({ content, radius, title, color, popped }: D, { createdAt, updatedAt, id }: Partial<CircleMetadata> = {}): Partial<NoteSchema> => ({
		content,
		radius,
		title,
		popped,
		color: color && toHex(color),

		createdAt,
		updatedAt,
		id,
	});

export interface NoteDataSchema {
	title: string
	content: string

	radius: number

	color: string
	popped: boolean
}
export type NoteSchema = SchemaWithMetadata<NoteDataSchema>;

export const NotesEntity = new EntitySchema<NoteSchema>({
	name: 'notes',
	columns:
{
	...BaseColumnSchemaPart,
	title:
{
	type: 'text',
	default: '',
},
	content:
{
	type: 'text',
	default: '',
},
	color:
{
	type: 'varchar',
},
	radius:
{
	type: 'double',
},
	popped:
{
	type: 'boolean',
	default: false,
},
},
});
