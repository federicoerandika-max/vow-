'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WeddingConfig } from '@/types/wedding';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [configs, setConfigs] = useState<string[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>('default');
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      loadConfigs(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.token);
      localStorage.setItem('admin_token', data.token);
      setIsAuthenticated(true);
      loadConfigs(data.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loadConfigs = async (authToken: string) => {
    try {
      const response = await fetch('/api/config/list', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();
      if (response.ok) {
        setConfigs(data.configs);
        if (data.configs.length > 0 && !selectedConfig) {
          setSelectedConfig(data.configs[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load configs:', err);
    }
  };

  const loadConfig = async (coupleId: string) => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/config?coupleId=${coupleId}`);
      const data = await response.json();
      if (response.ok) {
        setConfig(data);
      } else {
        setError(data.error || 'Failed to load config');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load config');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!token || !config || !selectedConfig) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/config/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coupleId: selectedConfig, config }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      setSuccess('Configuration saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (field: string, value: any) => {
    if (!config) return;

    const keys = field.split('.');
    const newConfig = { ...config };

    if (keys.length === 1) {
      (newConfig.couple as any)[keys[0]] = value;
    } else if (keys.length === 2) {
      (newConfig.couple as any)[keys[0]][keys[1]] = value;
    } else if (keys.length === 3) {
      (newConfig.couple as any)[keys[0]][keys[1]][keys[2]] = value;
    }

    setConfig(newConfig);
  };

  useEffect(() => {
    if (isAuthenticated && selectedConfig) {
      loadConfig(selectedConfig);
    }
  }, [selectedConfig, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                required
              />
            </label>
          </div>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Admin Panel</h1>
        <button
          onClick={() => {
            localStorage.removeItem('admin_token');
            setIsAuthenticated(false);
            setToken(null);
          }}
          style={{
            padding: '10px 20px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          {success}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label>
          Select Configuration:
          <select
            value={selectedConfig}
            onChange={(e) => setSelectedConfig(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            {configs.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => {
            const newId = prompt('Enter new configuration ID:');
            if (newId) {
              setConfigs([...configs, newId]);
              setSelectedConfig(newId);
              // Create default config
              setConfig({
                couple: {
                  names: ['', ''],
                  weddingDate: new Date().toISOString(),
                  location: { name: '', address: '', mapsUrl: '' },
                  gift: { iban: '', accountHolder: '' },
                  formUrl: '',
                  hashtag: '',
                  instagram: { bride: '', groom: '' },
                  videos: { it: '', en: '' },
                },
              });
            }
          }}
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          New Config
        </button>
      </div>

      {loading && <div>Loading...</div>}

      {config && (
        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
          <h2>Edit Configuration: {selectedConfig}</h2>

          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label>
                Couple Names (comma separated):
                <input
                  type="text"
                  value={config.couple.names.join(', ')}
                  onChange={(e) => {
                    const names = e.target.value.split(',').map(n => n.trim());
                    handleConfigChange('names', names);
                  }}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                Wedding Date:
                <input
                  type="datetime-local"
                  value={config.couple.weddingDate.slice(0, 16)}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    handleConfigChange('weddingDate', date.toISOString());
                  }}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                Location Name:
                <input
                  type="text"
                  value={config.couple.location.name}
                  onChange={(e) => handleConfigChange('location.name', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                Location Address:
                <input
                  type="text"
                  value={config.couple.location.address}
                  onChange={(e) => handleConfigChange('location.address', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                Maps URL:
                <input
                  type="url"
                  value={config.couple.location.mapsUrl}
                  onChange={(e) => handleConfigChange('location.mapsUrl', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                IBAN:
                <input
                  type="text"
                  value={config.couple.gift.iban}
                  onChange={(e) => handleConfigChange('gift.iban', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                Account Holder:
                <input
                  type="text"
                  value={config.couple.gift.accountHolder}
                  onChange={(e) => handleConfigChange('gift.accountHolder', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                Form URL:
                <input
                  type="url"
                  value={config.couple.formUrl}
                  onChange={(e) => handleConfigChange('formUrl', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                Hashtag:
                <input
                  type="text"
                  value={config.couple.hashtag}
                  onChange={(e) => handleConfigChange('hashtag', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                Instagram Bride:
                <input
                  type="text"
                  value={config.couple.instagram.bride}
                  onChange={(e) => handleConfigChange('instagram.bride', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                Instagram Groom:
                <input
                  type="text"
                  value={config.couple.instagram.groom}
                  onChange={(e) => handleConfigChange('instagram.groom', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                Video IT:
                <input
                  type="text"
                  value={config.couple.videos.it}
                  onChange={(e) => handleConfigChange('videos.it', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>

            <div>
              <label>
                Video EN:
                <input
                  type="text"
                  value={config.couple.videos.en}
                  onChange={(e) => handleConfigChange('videos.en', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </label>
            </div>
          </div>

          <button
            onClick={saveConfig}
            disabled={loading}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      )}
    </div>
  );
}
