# Setup Completo del Progetto

## Passo 1: Installazione Dipendenze

```bash
npm install
```

## Passo 2: Copia degli Asset

Copia manualmente i file necessari nella cartella `public`:

```bash
# Crea le directory necessarie
mkdir -p public/assets/img
mkdir -p public/assets/js

# Copia immagini
cp -r assets/img/* public/assets/img/

# Copia JavaScript (se necessario)
cp -r assets/js/* public/assets/js/

# Copia video
cp assets/video-*.mp4 public/assets/

# Copia file ICS
cp wedding.ics public/
```

Su Windows PowerShell:
```powershell
New-Item -ItemType Directory -Force -Path public\assets\img
New-Item -ItemType Directory -Force -Path public\assets\js
Copy-Item -Recurse assets\img\* public\assets\img\
Copy-Item -Recurse assets\js\* public\assets\js\
Copy-Item assets\video-*.mp4 public\assets\
Copy-Item wedding.ics public\
```

## Passo 3: Configurazione Environment Variables

1. Copia `.env.example` in `.env.local`:
```bash
cp .env.example .env.local
```

2. Genera l'hash della password admin:
```bash
npm run generate-password
```

3. Modifica `.env.local` con:
   - `JWT_SECRET`: una stringa casuale sicura
   - `ADMIN_PASSWORD_HASH`: l'hash generato al passo precedente

## Passo 4: Configurazione Iniziale

1. La configurazione di default è in `config/weddings/default.json`
2. Puoi modificarla direttamente o usare l'admin panel dopo il login

## Passo 5: Avvio

```bash
# Sviluppo
npm run dev

# Build produzione
npm run build

# Export statico (per GitHub Pages)
npm run export
```

## Passo 6: Accesso Admin Panel

1. Vai su `http://localhost:3000/admin`
2. Login con la password che hai usato per generare l'hash
3. Modifica le configurazioni direttamente dall'interfaccia

## Note Importanti

- I file in `config/weddings/` NON devono essere committati nel repository (sono nel .gitignore)
- Solo `default.json.example` viene committato come template
- Per ogni nuova coppia, crea un nuovo file JSON in `config/weddings/`
- Gli asset (video, immagini) vanno nella cartella `public/assets/`
