'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { WeddingConfig } from '@/types/wedding';
import { translations as defaultTranslations } from '@/config/translations';

/* ───────── helpers ───────── */
const SECTION_KEYS = [
  'general', 'couple', 'location', 'event', 'gift',
  'social', 'videos', 'metadata', 'wedshoots', 'timeline', 'translations',
] as const;
type Section = typeof SECTION_KEYS[number];

const SECTION_LABELS: Record<Section, string> = {
  general: '⚙️ General',
  couple: '💑 Couple',
  location: '📍 Location',
  event: '📅 Event',
  gift: '🎁 Gift',
  social: '📱 Social & Instagram',
  videos: '🎬 Videos',
  metadata: '🖼️ OG / Metadata',
  wedshoots: '📸 WedShoots',
  timeline: '🕒 Timeline',
  translations: '🌐 Translations',
};

const TRANSLATION_KEYS = [
  'title', 'countdownTitle', 'formTitle', 'location', 'date',
  'intro', 'futureUpdates', 'addHomeTitle', 'addHomeIntro',
  'iosSteps', 'androidSteps', 'signature',
  'btnLocation', 'btnDate', 'btnGift',
  'giftTitle', 'giftText', 'iban', 'copy', 'closeButton', 'name',
  'footer', 'tagAdvice', 'shareOnInstagram', 'publishedPhotos',
  'hashtagGalleryTitle', 'wedshoots_btn', 'formRevealed',
  'timeline', 'navGift', 'navFAQ', 'navWedshoots',
  'backHome', 'programTitle', 'programIntro',
  'nowLabel', 'nextPrefix', 'timelineTitle',
  'e_takeSeat', 'e_takeSeat_d', 'e_ceremony', 'e_ceremony_d',
  'e_lamp', 'e_lamp_d', 'e_aperitif', 'e_aperitif_d',
  'e_room', 'e_room_d', 'e_dinner', 'e_dinner_d',
  'e_speeches', 'e_speeches_d', 'e_cake', 'e_cake_d',
  'e_sweets', 'e_sweets_d', 'e_party', 'e_party_d',
  'copied', 'waiting', 'nextEnd',
] as const;

/* ───────── styles ───────── */
const S = {
  page: { maxWidth: 960, margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, sans-serif', color: '#1a1a1a' } as React.CSSProperties,
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '2px solid #e5e7eb', paddingBottom: 16 } as React.CSSProperties,
  nav: { display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 24 } as React.CSSProperties,
  navBtn: (active: boolean) => ({
    padding: '8px 14px', borderRadius: 8, border: active ? '2px solid #2563eb' : '1px solid #d1d5db',
    background: active ? '#eff6ff' : '#fff', color: active ? '#2563eb' : '#374151',
    fontWeight: active ? 600 : 400, cursor: 'pointer', fontSize: 13, transition: 'all .15s',
  }) as React.CSSProperties,
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,.06)' } as React.CSSProperties,
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 } as React.CSSProperties,
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 } as React.CSSProperties,
  field: { marginBottom: 0 } as React.CSSProperties,
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '.5px', marginBottom: 4 } as React.CSSProperties,
  input: { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const } as React.CSSProperties,
  textarea: { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, minHeight: 100, resize: 'vertical' as const, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' } as React.CSSProperties,
  btnPrimary: { padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' } as React.CSSProperties,
  btnDanger: { padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 } as React.CSSProperties,
  btnSecondary: { padding: '8px 16px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: 8, cursor: 'pointer', fontSize: 13 } as React.CSSProperties,
  toast: (type: 'error' | 'success') => ({
    position: 'fixed' as const, top: 20, right: 20, padding: '14px 20px', borderRadius: 10, zIndex: 9999, fontSize: 14, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,.15)',
    background: type === 'error' ? '#fef2f2' : '#f0fdf4', color: type === 'error' ? '#991b1b' : '#166534', border: `1px solid ${type === 'error' ? '#fecaca' : '#bbf7d0'}`,
  }) as React.CSSProperties,
  loginWrap: { maxWidth: 380, margin: '120px auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,.08)' } as React.CSSProperties,
  uploadZone: { border: '2px dashed #d1d5db', borderRadius: 8, padding: 20, textAlign: 'center' as const, cursor: 'pointer', background: '#fafafa', transition: 'border-color .2s' } as React.CSSProperties,
};

/* ═══════════ COMPONENT ═══════════ */
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
  const [activeSection, setActiveSection] = useState<Section>('couple');
  const [uploadingVideo, setUploadingVideo] = useState<'it' | 'en' | null>(null);
  const [translationLang, setTranslationLang] = useState<'it' | 'en'>('it');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── auth ── */
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setToken(data.token);
      localStorage.setItem('admin_token', data.token);
      setIsAuthenticated(true);
      loadConfigs(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── config CRUD ── */
  const loadConfigs = async (authToken: string) => {
    try {
      const res = await fetch('/api/config/list', { headers: { Authorization: `Bearer ${authToken}` } });
      const data = await res.json();
      if (res.ok) {
        setConfigs(data.configs);
        if (data.configs.length > 0 && !selectedConfig) setSelectedConfig(data.configs[0]);
      }
    } catch (err) { console.error('Failed to load configs:', err); }
  };

  const loadConfig = async (coupleId: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/config?coupleId=${coupleId}`);
      const data = await res.json();
      if (res.ok) setConfig(data);
      else setError(data.error || 'Failed to load config');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const saveConfig = async () => {
    if (!token || !config || !selectedConfig) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/config/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ coupleId: selectedConfig, config }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSuccess('Configuration saved ✓');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (isAuthenticated && selectedConfig) loadConfig(selectedConfig);
  }, [selectedConfig, isAuthenticated]);

  /* ── deep config setter ── */
  const set = (path: string, value: any) => {
    if (!config) return;
    const c = JSON.parse(JSON.stringify(config)) as WeddingConfig;
    const keys = path.split('.');
    let target: any = c;
    for (let i = 0; i < keys.length - 1; i++) {
      if (target[keys[i]] === undefined) target[keys[i]] = {};
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
    setConfig(c);
  };

  const get = (path: string, fallback: any = '') => {
    if (!config) return fallback;
    const keys = path.split('.');
    let target: any = config;
    for (const k of keys) {
      if (target == null || target[k] === undefined) return fallback;
      target = target[k];
    }
    return target;
  };

  /* ── video upload ── */
  const handleVideoUpload = async (lang: 'it' | 'en', file: File) => {
    if (!token) return;
    setUploadingVideo(lang);
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('coupleId', selectedConfig);
      formData.append('lang', lang);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      set(`couple.videos.${lang}`, data.path);
      setSuccess(`Video (${lang.toUpperCase()}) uploaded ✓`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) { setError(err.message); }
    finally { setUploadingVideo(null); }
  };

  /* ── timeline helpers ── */
  const addTimelineEvent = () => {
    const timeline = [...(config?.couple?.timeline || [])];
    timeline.push({ start: '12:00', end: '13:00', key: 'newEvent' });
    set('couple.timeline', timeline);
  };

  const removeTimelineEvent = (idx: number) => {
    const timeline = [...(config?.couple?.timeline || [])];
    timeline.splice(idx, 1);
    set('couple.timeline', timeline);
  };

  const updateTimelineEvent = (idx: number, field: string, value: string) => {
    const timeline = JSON.parse(JSON.stringify(config?.couple?.timeline || []));
    timeline[idx][field] = value;
    set('couple.timeline', timeline);
  };

  /* ── translation helpers ── */
  const getCustomTranslation = (lang: 'it' | 'en', key: string): string => {
    return get(`customTranslations.${lang}.${key}`, '');
  };

  const setCustomTranslation = (lang: 'it' | 'en', key: string, value: string) => {
    set(`customTranslations.${lang}.${key}`, value);
  };

  const getDefaultTranslation = (lang: 'it' | 'en', key: string): string => {
    return (defaultTranslations[lang] as any)?.[key] || '';
  };

  /* ════════════════ RENDER ════════════════ */

  // Toast messages
  const toasts = (
    <>
      {error && <div style={S.toast('error')} onClick={() => setError(null)}>❌ {error}</div>}
      {success && <div style={S.toast('success')}>✅ {success}</div>}
    </>
  );

  /* ── Login ── */
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {toasts}
        <div style={S.loginWrap}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>🔐 Admin</h1>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: 24, fontSize: 14 }}>Enter password to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ ...S.input, marginBottom: 16 }}
              required
              autoFocus
            />
            <button type="submit" disabled={loading} style={{ ...S.btnPrimary, width: '100%', opacity: loading ? .6 : 1 }}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!config) return <div style={S.page}>{toasts}<p>Loading configuration…</p></div>;

  /* ── Section renderers ── */
  const renderField = (label: string, path: string, opts?: { type?: string; placeholder?: string; rows?: number; wide?: boolean }) => (
    <div style={{ ...S.field, gridColumn: opts?.wide ? '1 / -1' : undefined }}>
      <label style={S.label}>{label}</label>
      {opts?.rows ? (
        <textarea
          value={get(path)}
          onChange={(e) => set(path, e.target.value)}
          placeholder={opts?.placeholder}
          style={S.textarea}
          rows={opts.rows}
        />
      ) : (
        <input
          type={opts?.type || 'text'}
          value={get(path)}
          onChange={(e) => set(path, e.target.value)}
          placeholder={opts?.placeholder}
          style={S.input}
        />
      )}
    </div>
  );

  const sections: Record<Section, JSX.Element> = {
    general: (
      <div style={S.card}>
        <h3 style={S.sectionTitle}>{SECTION_LABELS.general}</h3>
        <div style={S.grid}>
          <div>
            <label style={S.label}>Configuration</label>
            <select
              value={selectedConfig}
              onChange={(e) => setSelectedConfig(e.target.value)}
              style={S.input}
            >
              {configs.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => {
                const newId = prompt('Enter new configuration ID (e.g. couple-name):');
                if (newId) {
                  setConfigs([...configs, newId]);
                  setSelectedConfig(newId);
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
              style={S.btnSecondary}
            >
              + New Config
            </button>
          </div>
        </div>
      </div>
    ),

    couple: (
      <div style={S.card}>
        <h3 style={S.sectionTitle}>{SECTION_LABELS.couple}</h3>
        <div style={S.grid}>
          <div>
            <label style={S.label}>Bride Name</label>
            <input
              type="text"
              value={config.couple.names[0]}
              onChange={(e) => set('couple.names', [e.target.value, config.couple.names[1]])}
              style={S.input}
              placeholder="e.g. Erandika"
            />
          </div>
          <div>
            <label style={S.label}>Groom Name</label>
            <input
              type="text"
              value={config.couple.names[1]}
              onChange={(e) => set('couple.names', [config.couple.names[0], e.target.value])}
              style={S.input}
              placeholder="e.g. Federico"
            />
          </div>
          {renderField('Hashtag', 'couple.hashtag', { placeholder: '#YourWedding2026' })}
        </div>
      </div>
    ),

    location: (
      <div style={S.card}>
        <h3 style={S.sectionTitle}>{SECTION_LABELS.location}</h3>
        <div style={S.grid}>
          {renderField('Venue Name', 'couple.location.name', { placeholder: 'Villa Rosa' })}
          {renderField('Address', 'couple.location.address', { placeholder: 'Via Roma 1, Milano' })}
          {renderField('Google Maps URL', 'couple.location.mapsUrl', { type: 'url', placeholder: 'https://maps.app.goo.gl/...' , wide: true })}
        </div>
      </div>
    ),

    event: (
      <div style={S.card}>
        <h3 style={S.sectionTitle}>{SECTION_LABELS.event}</h3>
        <div style={S.grid}>
          <div>
            <label style={S.label}>Wedding Date & Time</label>
            <input
              type="datetime-local"
              value={config.couple.weddingDate.slice(0, 16)}
              onChange={(e) => set('couple.weddingDate', new Date(e.target.value).toISOString())}
              style={S.input}
            />
          </div>
          <div>
            <label style={S.label}>RSVP Deadline</label>
            <input
              type="datetime-local"
              value={(config.couple.formEndingDate || '').slice(0, 16)}
              onChange={(e) => set('couple.formEndingDate', new Date(e.target.value).toISOString())}
              style={S.input}
            />
          </div>
          {renderField('RSVP Form URL', 'couple.formUrl', { type: 'url', placeholder: 'https://docs.google.com/forms/...', wide: true })}
          {renderField('Calendar .ics file path', 'couple.calendarIcs', { placeholder: '/wedding.ics' })}
        </div>
      </div>
    ),

    gift: (
      <div style={S.card}>
        <h3 style={S.sectionTitle}>{SECTION_LABELS.gift}</h3>
        <div style={S.grid}>
          {renderField('IBAN', 'couple.gift.iban', { placeholder: 'IT60 X054 2811 1010 0000 0123 456' })}
          {renderField('Account Holder', 'couple.gift.accountHolder', { placeholder: 'Mario Rossi' })}
        </div>
      </div>
    ),

    social: (
      <div style={S.card}>
        <h3 style={S.sectionTitle}>{SECTION_LABELS.social}</h3>
        <div style={S.grid}>
          {renderField('Instagram Bride', 'couple.instagram.bride', { placeholder: '@bride' })}
          {renderField('Instagram Groom', 'couple.instagram.groom', { placeholder: '@groom' })}
        </div>
      </div>
    ),

    videos: (
      <div style={S.card}>
        <h3 style={S.sectionTitle}>{SECTION_LABELS.videos}</h3>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>
          Upload videos or paste a URL path. Uploaded videos are saved to <code>/public/uploads/{selectedConfig}/</code>
        </p>
        <div style={S.grid}>
          {/* IT video */}
          <div>
            <label style={S.label}>Video IT</label>
            <input
              type="text"
              value={get('couple.videos.it')}
              onChange={(e) => set('couple.videos.it', e.target.value)}
              placeholder="/assets/video-it.mp4"
              style={{ ...S.input, marginBottom: 8 }}
            />
            <div
              style={{ ...S.uploadZone, borderColor: uploadingVideo === 'it' ? '#2563eb' : '#d1d5db' }}
              onClick={() => { fileInputRef.current?.setAttribute('data-lang', 'it'); fileInputRef.current?.click(); }}
            >
              {uploadingVideo === 'it' ? '⏳ Uploading…' : '📤 Click to upload IT video'}
            </div>
          </div>
          {/* EN video */}
          <div>
            <label style={S.label}>Video EN</label>
            <input
              type="text"
              value={get('couple.videos.en')}
              onChange={(e) => set('couple.videos.en', e.target.value)}
              placeholder="/assets/video-en.mp4"
              style={{ ...S.input, marginBottom: 8 }}
            />
            <div
              style={{ ...S.uploadZone, borderColor: uploadingVideo === 'en' ? '#2563eb' : '#d1d5db' }}
              onClick={() => { fileInputRef.current?.setAttribute('data-lang', 'en'); fileInputRef.current?.click(); }}
            >
              {uploadingVideo === 'en' ? '⏳ Uploading…' : '📤 Click to upload EN video'}
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            const lang = (e.target.getAttribute('data-lang') || 'it') as 'it' | 'en';
            if (file) handleVideoUpload(lang, file);
            e.target.value = '';
          }}
        />
      </div>
    ),

    metadata: (
      <div style={S.card}>
        <h3 style={S.sectionTitle}>{SECTION_LABELS.metadata}</h3>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>
          Open Graph metadata for social sharing previews (WhatsApp, Facebook, Twitter, etc.)
        </p>
        <div style={S.grid}>
          {renderField('Site Name', 'metadata.siteName', { placeholder: 'Wedding Day 💍' })}
          {renderField('OG Image URL', 'metadata.ogImage', { type: 'url', placeholder: 'https://example.com/preview.jpg' })}
          {renderField('OG URL', 'metadata.ogUrl', { type: 'url', placeholder: 'https://yoursite.com' })}
        </div>
        {get('metadata.ogImage') && (
          <div style={{ marginTop: 16, padding: 12, background: '#f9fafb', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>OG Image Preview:</p>
            <img
              src={get('metadata.ogImage')}
              alt="OG preview"
              style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid #e5e7eb' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
      </div>
    ),

    wedshoots: (
      <div style={S.card}>
        <h3 style={S.sectionTitle}>{SECTION_LABELS.wedshoots}</h3>
        <div style={S.grid}>
          <div>
            <label style={S.label}>WedShoots Code</label>
            <input
              type="text"
              value={get('couple.wedshoots.code', '')}
              onChange={(e) => set('couple.wedshoots.code', e.target.value)}
              placeholder="IT218643e8"
              style={S.input}
            />
          </div>
          <div>
            <label style={S.label}>WedShoots URL</label>
            <input
              type="url"
              value={get('couple.wedshoots.url', '')}
              onChange={(e) => set('couple.wedshoots.url', e.target.value)}
              placeholder="https://www.matrimonio.com/web/..."
              style={S.input}
            />
          </div>
        </div>
      </div>
    ),

    timeline: (
      <div style={S.card}>
        <h3 style={S.sectionTitle}>{SECTION_LABELS.timeline}</h3>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>
          Define the event schedule. Use keys like <code>takeSeat</code>, <code>ceremony</code>, <code>aperitif</code>, etc.
          for built‑in translation support.
        </p>
        {(config.couple.timeline || []).map((evt, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <input
              type="time"
              value={evt.start}
              onChange={(e) => updateTimelineEvent(i, 'start', e.target.value)}
              style={{ ...S.input, width: 110, flex: 'none' }}
            />
            <span style={{ color: '#9ca3af' }}>→</span>
            <input
              type="time"
              value={evt.end}
              onChange={(e) => updateTimelineEvent(i, 'end', e.target.value)}
              style={{ ...S.input, width: 110, flex: 'none' }}
            />
            <input
              type="text"
              value={evt.key}
              onChange={(e) => updateTimelineEvent(i, 'key', e.target.value)}
              placeholder="Event key"
              style={{ ...S.input, flex: 1, minWidth: 140 }}
            />
            <button onClick={() => removeTimelineEvent(i)} style={{ ...S.btnDanger, padding: '8px 12px', fontSize: 12 }}>✕</button>
          </div>
        ))}
        <button onClick={addTimelineEvent} style={{ ...S.btnSecondary, marginTop: 8 }}>+ Add Event</button>
      </div>
    ),

    translations: (
      <div style={S.card}>
        <h3 style={S.sectionTitle}>{SECTION_LABELS.translations}</h3>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>
          Override default translations. Leave a field empty to use the built‑in default.
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setTranslationLang('it')}
            style={S.navBtn(translationLang === 'it')}
          >
            🇮🇹 Italiano
          </button>
          <button
            onClick={() => setTranslationLang('en')}
            style={S.navBtn(translationLang === 'en')}
          >
            🇬🇧 English
          </button>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {TRANSLATION_KEYS.map((key) => {
            const def = getDefaultTranslation(translationLang, key);
            const custom = getCustomTranslation(translationLang, key);
            const isLong = typeof def === 'string' && def.length > 80;
            return (
              <div key={key} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 12 }}>
                <label style={{ ...S.label, marginBottom: 2 }}>{key}</label>
                {isLong ? (
                  <textarea
                    value={custom}
                    onChange={(e) => setCustomTranslation(translationLang, key, e.target.value)}
                    placeholder={typeof def === 'string' ? def.replace(/<[^>]*>/g, '').trim().slice(0, 120) + '…' : ''}
                    style={S.textarea}
                    rows={3}
                  />
                ) : (
                  <input
                    type="text"
                    value={custom}
                    onChange={(e) => setCustomTranslation(translationLang, key, e.target.value)}
                    placeholder={typeof def === 'string' ? def.replace(/<[^>]*>/g, '').trim() : ''}
                    style={S.input}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    ),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {toasts}
      <div style={S.page}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>💒 Wedding Admin</h1>
            <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>
              Editing: <strong>{selectedConfig}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveConfig} disabled={loading} style={{ ...S.btnPrimary, opacity: loading ? .6 : 1 }}>
              {loading ? 'Saving…' : '💾 Save'}
            </button>
            <button
              onClick={() => { localStorage.removeItem('admin_token'); setIsAuthenticated(false); setToken(null); }}
              style={S.btnDanger}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Section Nav */}
        <nav style={S.nav}>
          {SECTION_KEYS.map((key) => (
            <button key={key} onClick={() => setActiveSection(key)} style={S.navBtn(activeSection === key)}>
              {SECTION_LABELS[key]}
            </button>
          ))}
        </nav>

        {/* Active Section */}
        {sections[activeSection]}

        {/* Floating save at bottom */}
        <div style={{ position: 'sticky', bottom: 16, display: 'flex', justifyContent: 'flex-end', paddingTop: 16 }}>
          <button onClick={saveConfig} disabled={loading} style={{ ...S.btnPrimary, boxShadow: '0 4px 12px rgba(37,99,235,.3)', opacity: loading ? .6 : 1 }}>
            {loading ? 'Saving…' : '💾 Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
