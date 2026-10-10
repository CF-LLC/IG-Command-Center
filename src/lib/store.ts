import { promises as fs } from "fs";
import path from "path";
import { seed } from "./seed";
import type { DB } from "./types";

/**
 * Production-safe path:
 * - Local / Node: ./data/db.json
 * - Netlify / serverless: /tmp/igcc-db.json (ephemeral per instance —
 *   set DATABASE_URL / Neon for durable multi-instance production)
 */
function resolveDbPath() {
  if (process.env.IGCC_DATA_PATH) return process.env.IGCC_DATA_PATH;
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "igcc-db.json");
  }
  return path.join(process.cwd(), "data", "db.json");
}

async function ensure(): Promise<string> {
  const dbPath = resolveDbPath();
  const dir = path.dirname(dbPath);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify(seed, null, 2));
  }
  return dbPath;
}

export async function readDB(): Promise<DB> {
  const dbPath = await ensure();
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw) as DB;
}

export async function writeDB(db: DB) {
  const dbPath = await ensure();
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export async function mutate(fn: (db: DB) => void | Promise<void>) {
  const db = await readDB();
  await fn(db);
  await writeDB(db);
  return db;
}

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isServerless() {
  return Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
}
