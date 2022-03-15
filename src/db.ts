import Dexie, { Table } from 'dexie';

type TaskStatus = "TODO" | "DONE"
export interface Task {
  id?: number;
  name: string;
  domain: string;
  status: TaskStatus;
  link: string;
  dateAdded: Date;
}

export class TasksDexie extends Dexie {
  tasks!: Table<Task>; 

  constructor() {
    super('tasks');
    this.version(2).stores({
      tasks: '++id, name, domain, status' // Primary key and indexed props
    });
  }
}

export const db = new TasksDexie();

