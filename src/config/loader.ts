import { WeddingConfig } from '@/types/wedding';
import defaultConfig from '../../config/weddings/default.json';

// Server-side only functions
export function getWeddingConfig(coupleId: string = 'default'): WeddingConfig {
  // For now, only default config is supported via static import
  // This ensures the config is bundled with the serverless function on Vercel
  if (coupleId !== 'default') {
    throw new Error(`Configuration not found for coupleId: ${coupleId}`);
  }

  const config = defaultConfig as WeddingConfig;

  // Validazione base
  if (!config.couple) {
    throw new Error('Invalid configuration: missing couple data');
  }

  return config;
}

export function getAllWeddingConfigs(): string[] {
  return ['default'];
}

export function saveWeddingConfig(coupleId: string, config: WeddingConfig): void {
  // Saving is not supported on Vercel's read-only filesystem
  throw new Error('Saving configuration is not supported in this deployment');
}
