# Action Plan Management

Workspace internal untuk Action Plan harian dan mingguan, monitoring Admin, serta lampiran Google Drive. Data utama tetap disimpan pada Google Spreadsheet.

## Menjalankan lokal

```bash
cp .env.example .env.local
npm ci
npm run bootstrap:admin
npm run dev
```

Lengkapi environment dan langkah Google terlebih dahulu di [docs/SETUP.md](docs/SETUP.md).

## Pemeriksaan

```bash
npx tsc --noEmit
npm run lint
npm test
```

## Dokumentasi

- [Tech Stack](docs/TECH_STACK.md)
- [Database Design](docs/DATABASE_DESIGN.md)
- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [Setup dan operasional](docs/SETUP.md)
