import { WeddingConfig } from '@/types/wedding';
import defaultConfig from './default-wedding.json';
import { put, list, head } from '@vercel/blob';

const BLOB_PREFIX = 'wedding-configs/';

/**
 * Load a wedding config.
 * 1. Try Vercel Blob storage first (works in dev + prod when BLOB_READ_WRITE_TOKEN is set)
 * 2. Fall back to the bundled default-wedding.json
 */
export async function getWeddingConfig(coupleId: string = 'default'): Promise<WeddingConfig> {
  // Try loading from Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blobKey = `${BLOB_PREFIX}${coupleId}.json`;
      const blobs = await list({ prefix: blobKey, token: process.env.BLOB_READ_WRITE_TOKEN });
      const match = blobs.blobs.find(b => b.pathname === blobKey);
      if (match) {
        const res = await fetch(match.url);
        if (res.ok) {
          const config = await res.json() as WeddingConfig;
          if (config.couple) return config;
        }
      }
    } catch (err) {
      console.error(`[loader] Blob read error for "${coupleId}":`, err);
    }
  }

  // Fall back to bundled default config
  if (coupleId === 'default') {
    return defaultConfig as WeddingConfig;
  }

  throw new Error(`Configuration not found for coupleId: ${coupleId}`);
}

/**
 * List all available config IDs.
 * Always includes "default". Adds any configs found in Vercel Blob.
 */
export async function getAllWeddingConfigs(): Promise<string[]> {
  const ids = new Set<string>(['default']);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blobs = await list({ prefix: BLOB_PREFIX, token: process.env.BLOB_READ_WRITE_TOKEN });
      for (const blob of blobs.blobs) {
        // pathname is "wedding-configs/coupleId.json"
        const name = blob.pathname.replace(BLOB_PREFIX, '').replace('.json', '');
        if (name) ids.add(name);
      }
    } catch (err) {
      console.error('[loader] Blob list error:', err);
    }
  }

  return Array.from(ids);
}

/**
 * Save a wedding config to Vercel Blob.
 * Works in both dev and production when BLOB_READ_WRITE_TOKEN is set.
 */
export async function saveWeddingConfig(coupleId: string, config: WeddingConfig): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not set. Add it to .env.local (for dev) or Vercel Environment Variables (for production). ' +
      'Get it from: Vercel Dashboard → Storage → Create Blob Store.'
    );
  }

  if (!config.couple) {
    throw new Error('Invalid configuration: missing couple data');
  }

  const blobKey = `${BLOB_PREFIX}${coupleId}.json`;
  await put(blobKey, JSON.stringify(config, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}
