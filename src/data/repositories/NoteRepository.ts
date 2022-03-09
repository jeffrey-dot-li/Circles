import type { Connection, Repository } from 'typeorm';
import type { NoteSchema, PartialSchema } from '../entities/NoteModel';
import { DataToSchema, NotesEntity } from '../entities/NoteModel';
import type { CircleData, PartialCircle } from '~/types/Circles';
import { deepRequired as removeUndefined } from '~/utils/core';

const ReturnError = (error: string, args = {}) => ({
  ...args,
  error: Error(error),
  result: null,
} as const);

const ReturnResult = <T, K extends {} = {}>(result: T, args = {}) => ({
  ...args,
  error: null,
  result,
} as const);
export class NotesRepository {
  private ormRepository: Repository<NoteSchema>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(NotesEntity);
  }

  public async getAll(): Promise<NoteSchema[]> {
    const notes = await this.ormRepository.find();

    return notes;
  }

  public async create(c: CircleData): Promise<NoteSchema> {
    const note = this.ormRepository.create(DataToSchema(c));
    await this.ormRepository.save(note);
    return note;
  }

  public async update(c: PartialCircle, id: string) {
    const note = await this.ormRepository.findOne(id);
    // TODO: Handle errors
    if (!note)
      return ReturnError('ID reference not found.');
    const updateNote: PartialSchema = await this.ormRepository.save({ id: note.id, ...removeUndefined(DataToSchema(c)) });
    return ReturnResult(updateNote);
  }

  public async delete(id: string) {
    return this.ormRepository.delete(id);
  }
}
