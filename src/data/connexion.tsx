import type { PropsWithChildren } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator } from 'react-native';
import type { Connection } from 'typeorm';
import { createConnection } from 'typeorm';

import { NotesEntity } from './entities/NoteModel';
import { CreateNotesTable1625349274225 } from './migrations/1625349274225-CreateNotesTable';
import { CreateNotesTableFr1625451146451 } from './migrations/1625451146451-CreateNotesTableFr';

import { NotesRepository } from './repositories/NoteRepository';

interface DatabaseConnectionContextData {
  notesRepository: NotesRepository
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData,
);

type Props = PropsWithChildren<{}>;
export const DatabaseConnectionProvider: React.FC<Props> = ({ children }: Props) => {
  const [connection, setConnection] = useState<Connection | null>(null);

  const connect = useCallback(async() => {
    const createdConnection = await createDatabaseConnection();
    setConnection(createdConnection);
  }, []);

  useEffect(() => {
    if (!connection)
      connect();
  }, [connect, connection]);

  if (!connection)
    return (<ActivityIndicator />);

  return (
    <DatabaseConnectionContext.Provider
      value={{
        notesRepository: new NotesRepository(connection),
      }}
    >
      {children}
    </DatabaseConnectionContext.Provider>
  );
};

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext);
  return context;
}

export const createDatabaseConnection = () => createConnection({
  type: 'expo',
  database: 'notes',
  driver: require('expo-sqlite'),
  entities: [NotesEntity],
  // migrationsRun: true,
  // migrations: [CreateNotesTableFr1625451146451],
  // synchronize: false,
  synchronize: true,
});
