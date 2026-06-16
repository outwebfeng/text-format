import * as fs from 'fs';
import * as path from 'path';

export const isProduction = process.env.NODE_ENV === 'production';

export const isCloudflareWorker =
  typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;

/**
 * Load env files for Vite config and server entrypoints:
 * .env.local > .env.{development,production} > .env
 *
 * Earlier files win — if a key is already set, later files don't overwrite.
 */
export function loadEnvFiles() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const files = ['.env.local', `.env.${nodeEnv}`, '.env'];

  for (const file of files) {
    const envPath = path.resolve(file);
    if (!fs.existsSync(envPath)) continue;
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      // Strip surrounding quotes (single or double)
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}
