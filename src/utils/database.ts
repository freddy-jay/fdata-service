import {Database} from 'sqlite3';

interface dbProps {
  filename: string;
}

export class Db {
  db: Database;

  constructor(props: dbProps) {
    this.db = new Database(props.filename);
  }
}
