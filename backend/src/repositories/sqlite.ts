import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

export type SqliteDatabase = Database.Database;

export function createSqliteDatabase(filename: string): SqliteDatabase {
  if (filename !== ':memory:') fs.mkdirSync(path.dirname(filename), { recursive: true });
  const database = new Database(filename);
  database.pragma('journal_mode = WAL');
  database.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      conversation_id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      vehicle_json TEXT,
      location_json TEXT,
      status TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS messages (
      message_id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      assessment_json TEXT,
      request_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
    );
    CREATE TABLE IF NOT EXISTS assessments (
      assessment_id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      message_id TEXT NOT NULL,
      assessment_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  return database;
}
