import type { EntitySchemaColumnOptions } from 'typeorm';

export interface BaseColumnSchemaInterface {
	id: string
	createdAt: string
	updatedAt: string
}

export type SchemaWithMetadata<DataSchema> = DataSchema & BaseColumnSchemaInterface;

export const BaseColumnSchemaPart = {
	id: {
		type: String,
		primary: true,
		generated: 'uuid',
	} as EntitySchemaColumnOptions,
	createdAt: {
		name: 'created_at',
		type: 'datetime',
		createDate: true,
	} as EntitySchemaColumnOptions,
	updatedAt: {
		name: 'updated_at',
		type: 'datetime',
		updateDate: true,
	} as EntitySchemaColumnOptions,
};
