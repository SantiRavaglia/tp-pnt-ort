import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "data");

export const ALBUMS_FILE = path.join(dataDir, "albums.json");
export const ALBUM_LISTENS_FILE = path.join(dataDir, "albumListens.json");

async function ensureFile(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    // Si el archivo no existe, lo inicializamos como un array vacío
    await fs.writeFile(filePath, "[]", "utf-8");
  }
}

export async function initStorage() {
  await fs.mkdir(dataDir, { recursive: true });
  await ensureFile(ALBUMS_FILE);
  await ensureFile(ALBUM_LISTENS_FILE);
}

export async function readJson(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error parseando JSON en ${filePath}:`, err);
    // Si algo está corrupto, devolvemos array vacío
    return [];
  }
}

export async function writeJson(filePath, data) {
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, json, "utf-8");
}
