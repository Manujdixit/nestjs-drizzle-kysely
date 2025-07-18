/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface DrizzleDrizzleMigrations {
  created_at: Int8 | null;
  hash: string;
  id: Generated<number>;
}

export interface Users {
  created_at: Generated<Timestamp | null>;
  email: string;
  id: Generated<number>;
  password: string;
  updated_at: Generated<Timestamp | null>;
  username: string | null;
}

export interface DB {
  "drizzle.__drizzle_migrations": DrizzleDrizzleMigrations;
  users: Users;
}
