import { WeddingConfig } from '@/types/wedding';
import fs from 'fs';
import path from 'path';

const CONFIG_DIR = path.join(process.cwd(), 'config', 'weddings');

// Server-side only functions
export function getWeddingConfig(coupleId: string = 'default'): WeddingConfig {
  if (typeof window !== 'undefined') {
    throw new Error('getWeddingConfig can only be called server-side');
  }

  const configPath = path.join(CONFIG_DIR, `${coupleId}.json`);
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  const configContent = fs.readFileSync(configPath, 'utf-8');
  const config: WeddingConfig = JSON.parse(configContent);

  // Validazione base
  if (!config.couple) {
    throw new Error('Invalid configuration: missing couple data');
  }

  return config;
}

export function getAllWeddingConfigs(): string[] {
  if (typeof window !== 'undefined') {
    return [];
  }

  if (!fs.existsSync(CONFIG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONFIG_DIR);
  return files
    .filter(file => file.endsWith('.json') && file !== 'default.json.example')
    .map(file => file.replace('.json', ''));
}

export function saveWeddingConfig(coupleId: string, config: WeddingConfig): void {
  if (typeof window !== 'undefined') {
    throw new Error('saveWeddingConfig can only be called server-side');
  }

  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  const configPath = path.join(CONFIG_DIR, `${coupleId}.json`);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
}
