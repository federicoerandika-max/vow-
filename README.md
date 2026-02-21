# Wedding Day - Sito Matrimonio Configurabile

Sito web per partecipazioni/inviti matrimoniali completamente configurabile, costruito con Next.js e TypeScript.

## Caratteristiche

- ✅ **Completamente configurabile** - Sistema di configurazione JSON per gestire diverse coppie
- ✅ **TypeScript** - Type-safety completo per tutte le configurazioni
- ✅ **Admin Panel** - Interfaccia protetta per gestire le configurazioni
- ✅ **Multi-lingua** - Supporto italiano e inglese
- ✅ **Responsive** - Design ottimizzato per mobile e desktop
- ✅ **Static Site Generation** - Perfetto per GitHub Pages

## Setup

### Prerequisiti

- Node.js 20+
- npm o yarn

### Installazione

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build

# Export statico (per GitHub Pages)
npm run export
```

## Configurazione

### Creare una nuova configurazione

1. Copia `config/weddings/default.json.example` in `config/weddings/[couple-id].json`
2. Modifica i valori nel file JSON
3. Il sito caricherà automaticamente la configurazione

### Struttura della configurazione

Vedi `config/weddings/default.json.example` per un esempio completo.

### Admin Panel

1. Vai su `/admin`
2. Login con la password configurata (vedi sezione Environment Variables)
3. Modifica le configurazioni direttamente dall'interfaccia web

## Environment Variables

Crea un file `.env.local`:

```env
JWT_SECRET=your-secret-jwt-key-here
ADMIN_PASSWORD_HASH=your-bcrypt-hash-here
```

Per generare l'hash della password:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"
```

## Deploy su GitHub Pages

Il progetto è configurato per deploy automatico su GitHub Pages tramite GitHub Actions.

1. Abilita GitHub Pages nel repository settings
2. Seleziona "GitHub Actions" come source
3. Push su `main` triggererà automaticamente il deploy

## Struttura Progetto

```
weddingDay-test/
├── config/
│   └── weddings/          # Configurazioni JSON per coppie
├── public/
│   └── assets/           # Video, immagini, etc.
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── admin/        # Admin panel
│   │   ├── api/          # API routes
│   │   ├── gift/         # Pagina regali
│   │   └── timeline/     # Pagina timeline
│   ├── components/       # Componenti React
│   ├── config/           # Configurazione e traduzioni
│   ├── hooks/            # React hooks
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
└── package.json
```

## Sviluppo

### Aggiungere nuove traduzioni

Modifica `src/config/translations.ts` per aggiungere nuove chiavi di traduzione.

### Aggiungere nuovi componenti

Crea nuovi componenti in `src/components/` e importali dove necessario.

## Licenza

Progetto privato per uso personale.
