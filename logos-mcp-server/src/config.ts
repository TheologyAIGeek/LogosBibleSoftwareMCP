import { homedir } from "os";
import { join } from "path";
import { readdirSync, statSync, existsSync } from "fs";

// ─── Logos Data Paths ────────────────────────────────────────────────────────

// Find the most-recently-modified *.w14 or *.4bh style install-ID folder
function findInstallId(parentDir: string): string | null {
  if (!existsSync(parentDir)) return null;
  try {
    const entries = readdirSync(parentDir)
      .filter(e => /^[a-z0-9]+\.[a-z0-9]+$/i.test(e))
      .map(e => ({ name: e, mtime: statSync(join(parentDir, e)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    return entries[0]?.name ?? null;
  } catch {
    return null;
  }
}

// Return candidate Logos root directories in preference order
function getLogosRoots(): string[] {
  if (process.platform === "win32") {
    const local = process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local");
    const roaming = process.env.APPDATA ?? join(homedir(), "AppData", "Roaming");
    return [
      join(local, "Logos"),
      join(roaming, "Logos"),
      join(roaming, "Logos4"),
      join(local, "Logos4"),
    ];
  }
  return [
    join(homedir(), "Library", "Application Support", "Logos"),
    join(homedir(), "Library", "Application Support", "Logos4"),
  ];
}

function findLogosDir(subPath: string): string | null {
  for (const root of getLogosRoots()) {
    const candidate = join(root, subPath);
    const id = findInstallId(candidate);
    if (id) return join(candidate, id);
  }
  return null;
}

const LOGOS_BASE = findLogosDir("Documents") ?? join(homedir(), "AppData", "Roaming", "Logos4", "Documents", "unknown");
const LOGOS_CATALOG_BASE = findLogosDir("Data") ?? join(homedir(), "AppData", "Roaming", "Logos4", "Data", "unknown");

export const LOGOS_DATA_DIR = process.env.LOGOS_DATA_DIR ?? LOGOS_BASE;
export const LOGOS_CATALOG_DIR = process.env.LOGOS_CATALOG_DIR ?? LOGOS_CATALOG_BASE;

export const DB_PATHS = {
  visualMarkup: join(LOGOS_DATA_DIR, "VisualMarkup", "visualmarkup.db"),
  favorites: join(LOGOS_DATA_DIR, "FavoritesManager", "favorites.db"),
  workflows: join(LOGOS_DATA_DIR, "Workflows", "Workflows.db"),
  readingLists: join(LOGOS_DATA_DIR, "ReadingLists", "ReadingLists.db"),
  shortcuts: join(LOGOS_DATA_DIR, "ShortcutsManager", "shortcuts.db"),
  guides: join(LOGOS_DATA_DIR, "Guides", "guides.db"),
  notes: join(LOGOS_DATA_DIR, "NotesToolManager", "notestool.db"),
  clippings: join(LOGOS_DATA_DIR, "Documents", "Clippings", "Clippings.db"),
  passageLists: join(LOGOS_DATA_DIR, "Documents", "PassageList", "PassageList.db"),
  catalog: join(LOGOS_CATALOG_DIR, "LibraryCatalog", "catalog.db"),
} as const;

// ─── Biblia API ──────────────────────────────────────────────────────────────

export const BIBLIA_API_KEY = process.env.BIBLIA_API_KEY ?? "";
export const BIBLIA_API_BASE = "https://api.biblia.com/v1/bible";
export const DEFAULT_BIBLE = "LEB";

// ─── Logos URL Schemes ───────────────────────────────────────────────────────

export const LOGOS_URL_BASE = "logos4:";

// ─── Server Info ─────────────────────────────────────────────────────────────

export const SERVER_NAME = "logos-bible";
export const SERVER_VERSION = "1.0.0";
