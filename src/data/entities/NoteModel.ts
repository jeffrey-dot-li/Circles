import { Column, CreateDateColumn, Entity, EntitySchema, EntitySchemaColumnOptions, PrimaryGeneratedColumn } from 'typeorm';
import { DeepPartial } from 'redux';
import type { SchemaWithMetadata } from './base';
import { BaseColumnSchemaInterface, BaseColumnSchemaPart } from './base';
import type { PartialCircle, SavedCircleData } from '~/types/Circles';
import { CircleData } from '~/types/Circles';
import { Color, fromHex, toHex } from '~/utils/color';
import { Vec } from '~/utils/svg';
import type { MandateProps } from '~/types/utils';

export type PartialSchema = MandateProps<Partial<NoteSchema>, 'id'>;

export const SchemaToDataPartial = <D extends PartialSchema>({ content, radius, title, id, popped, color, ...note }: D) => ({
  content,
  radius,
  title,
  color: typeof color === 'string' ? fromHex(color) : undefined,
  metadata:
  {
    createdAt: note.createdAt && Date.parse(note.createdAt),
    updatedAt: note.updatedAt && Date.parse(note.updatedAt),
    id,
  },
  position: Vec(note.positionX, note.positionY),
  velocity: Vec(note.velocityX, note.velocityY),
  popped,
});

export const SchemaToData = ({ content, radius, title, id, popped, ...note }: NoteSchema): SavedCircleData => ({
  content,
  radius,
  title,
  color: fromHex(note.color),
  metadata:
  {
    createdAt: Date.parse(note.createdAt),
    updatedAt: Date.parse(note.updatedAt),
    id,
  },
  position: Vec(note.positionX, note.positionY),
  velocity: Vec(note.velocityX, note.velocityY),
  popped,
});

export const DataToSchema = <D extends PartialCircle = PartialCircle>({ content, radius, title, color, position, velocity }: D) => ({
  content,
  radius,
  title,
  color: color && toHex(color),
  positionX: position?.x,
  positionY: position?.y,
  velocityX: velocity?.x,
  velocityY: velocity?.y,
});

export interface NoteDataSchema {
  title: string
  content: string

  radius: number

  positionX: number
  positionY: number
  velocityX: number
  velocityY: number

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
    positionX:
    {
      type: 'double',
      name: 'position_x',
    },
    positionY:
    {
      type: 'double',
      name: 'position_y',
    },
    velocityX:
    {
      type: 'double',
      name: 'velocity_x',
    },
    velocityY:
    {
      type: 'double',
      name: 'velocity_y',
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
