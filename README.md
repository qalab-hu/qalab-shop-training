# QALab Shop - Magyar Dokumentáció

> 🇺🇸 **English version**: See [README_EN.md](./README_EN.md) for English documentation focused on Playwright testing scenarios.

## 📖 Tartalom

1. [Áttekintés](#áttekintés)
2. [Telepítés](#telepítés)
3. [Használat](#használat)
4. [Funkciók](#funkciók)
5. [API Dokumentáció](#api-dokumentáció)
6. [Fejlesztői Információk](#fejlesztői-információk)
7. [Hibaelhárítás](#hibaelhárítás)

---

## 🎯 Áttekintés

A **QALab Shop** egy modern e-kereskedelmi demó alkalmazás, amely Next.js 15 technológiával készült. Az alkalmazás célja, hogy átfogó tanulási környezetet biztosítson QA mérnökök számára a Playwright automatizált tesztelés elsajátításához.

### Technológiai Stack

| Technológia | Verzió | Leírás |
|-------------|--------|---------|
| **Next.js** | 15.5.2 | React-alapú full-stack framework |
| **React** | 19.1.1 | Frontend könyvtár |
| **TypeScript** | 5.x | Típusos JavaScript |
| **Prisma** | 6.15.0 | Adatbázis ORM |
| **SQLite** | 5.1.7 | Fejlesztői adatbázis |
| **Tailwind CSS** | 4.1.13 | Utility-first CSS framework |
| **JWT** | 9.0.2 | Autentikáció |
| **bcryptjs** | 3.0.2 | Jelszó titkosítás |

---

## 💻 Telepítés

### Előfeltételek

- **Node.js** 18+ verzió
- **npm**, **yarn** vagy **pnpm** csomagkezelő
- **Git** verziókezelő

### Lépésről lépésre telepítés

#### 1. Repository klónozása
```bash
git clone <repository-url>
cd qalab-shop-training
```

#### 2. Függőségek telepítése
```bash
npm install
```

#### 3. Adatbázis inicializálása
```bash
# Prisma séma alkalmazása
npx prisma db push

# Minta adatok betöltése
npm run db:seed
```

#### 4. Fejlesztői szerver indítása
```bash
npm run dev
```

#### 5. Böngészőben megnyitás
Nyisd meg a [http://localhost:3000](http://localhost:3000) címet a böngésződben.

### Production Build

```bash
# Build létrehozása
npm run build

# Production szerver indítása
npm start
```

---

## 🎮 Használat

### Demó Felhasználók

| Felhasználó | Email | Jelszó | Szerepkör |
|-------------|-------|--------|-----------|
| **Admin** | admin@qalab.hu | admin123 | ADMIN |
| **User** | user@qalab.hu | user123 | USER |

### Főbb Funkciók

#### 🏠 Főoldal
- **Termékek böngészése**: Katalógus megtekintése
- **Keresés és szűrés**: Kategória, ár, értékelés szerint
- **Termék részletek**: Kép, leírás, ár megtekintése

#### 🔐 Autentikáció
- **Bejelentkezés**: Email/jelszó kombináció
- **Regisztráció**: Új felhasználó létrehozása
- **Profil kezelés**: Személyes adatok, API token generálás

#### 🛒 Rendelések
- **Rendelés leadás**: Termékek megrendelése
- **Rendelés történet**: Korábbi rendelések megtekintése
- **Státusz követés**: Rendelés állapotának nyomon követése

#### 📞 Kapcsolat
- **Kapcsolati űrlap**: Többlépcsős form validációval
- **Üzenet küldés**: Visszajelzés és kérdések

---

## 🚀 Funkciók

### Felhasználói Felület

#### Navigation
- **Reszponzív menü**: Mobil és desktop nézet
- **Breadcrumb**: Navigációs útvonal jelzés
- **Keresősáv**: Azonnali termék keresés

#### Termék Katalógus
- **Szűrők**:
  - Kategória (Software, Hardware, Books, Electronics)
  - Árszint (csúszka)
  - Értékelés (1-5 csillag)
  - Készlet állapot
- **Rendezés**: Név, ár, értékelés szerint
- **Lapozás**: Teljesítmény optimalizált betöltés

#### Autentikáció Rendszer
- **JWT token alapú**: Biztonságos munkamenet kezelés
- **Szerepkör alapú hozzáférés**: Admin/User jogosultságok
- **Cookie kezelés**: Automatikus bejelentkezés megőrzés

#### Form Validáció
- **Frontend validáció**: Azonnali visszajelzés
- **Backend validáció**: Biztonságos adatellenőrzés
- **Zod schema**: Típusbiztos validáció

---

## 🔌 API Dokumentáció

### Autentikáció Módok

#### 1. JWT Token (Ajánlott)
```bash
# Bejelentkezés
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@qalab.hu", "password": "admin123"}'

# API hívás tokennel
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/orders"
```

#### 2. Legacy API Key
```bash
# API hívás X-API-Key headerrel
curl -H "X-API-Key: qalab-api-key-2024" \
  "http://localhost:3000/api/products"
```

**Érvényes API kulcsok:**
- `qalab-api-key-2024`
- `student-demo-key`
- `test-api-key-123`

### Endpoint Kategóriák

#### 🌐 Nyilvános Endpointok

##### GET /api/products
**Termékek listázása szűrési lehetőségekkel**

```bash
curl "http://localhost:3000/api/products?category=Software&minPrice=10&maxPrice=100&rating=4"
```

**Query paraméterek:**
- `category`: Kategória szűrés
- `search`: Termék név keresés
- `minPrice`: Minimum ár
- `maxPrice`: Maximum ár
- `rating`: Minimum értékelés
- `inStock`: Készleten van (true/false)

**Válasz:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cm...",
      "name": "Termék neve",
      "description": "Leírás",
      "price": 49.99,
      "category": "Software",
      "rating": 4.5,
      "inStock": true,
      "imageUrl": "/uploads/termek.png"
    }
  ]
}
```

##### GET /api/products/[id]
**Termék részletek lekérése**

```bash
curl "http://localhost:3000/api/products/cm123..."
```

##### POST /api/auth/login
**Felhasználó bejelentkeztetés**

```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@qalab.hu", "password": "admin123"}'
```

**Válasz:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "cm...",
    "email": "admin@qalab.hu",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

##### POST /api/auth/register
**Új felhasználó regisztrálás**

#### 🔒 Védett Endpointok

##### GET /api/orders
**Rendelések listázása (szerepkör alapú)**

- **Admin**: Összes rendelés
- **User**: Csak saját rendelések

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/orders"
```

##### GET /api/orders/[id]
**Rendelés részletek**

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/orders/cm123..."
```

##### POST /api/orders
**Új rendelés leadása**

```bash
curl -X POST "http://localhost:3000/api/orders" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": "cm123...", "quantity": 2}
    ],
    "shippingAddress": "1234 Budapest, Példa utca 1."
  }'
```

##### GET /api/users/profile
**Felhasználói profil adatok**

### Hibakezelés

**Standard hiba válasz:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  },
  "timestamp": "2025-01-06T10:30:00.000Z"
}
```

**HTTP Státusz kódok:**
- `200`: Sikeres kérés
- `400`: Hibás kérés (validáció)
- `401`: Nincs autentikáció
- `403`: Nincs jogosultság
- `404`: Nem található
- `500`: Szerver hiba

---

## 👩‍💻 Fejlesztői Információk

### Projekt Struktúra

```
qalab-learning-app/
├── 📁 src/
│   ├── 📁 app/                     # Next.js App Router
│   │   ├── 📁 api/                 # API endpointok
│   │   │   ├── 📁 auth/            # Autentikáció
│   │   │   ├── 📁 orders/          # Rendelések
│   │   │   ├── 📁 products/        # Termékek
│   │   │   └── 📁 users/           # Felhasználók
│   │   ├── 📁 contact/             # Kapcsolat oldal
│   │   ├── 📁 login/               # Bejelentkezés
│   │   ├── 📁 orders/              # Rendelések UI
│   │   ├── 📁 products/            # Termékek UI
│   │   ├── 📁 profile/             # Profil oldal
│   │   └── 📄 globals.css          # Globális stílusok
│   ├── 📁 components/              # React komponensek
│   │   ├── 📁 ui/                  # Alap UI komponensek
│   │   ├── 📄 Header.tsx           # Fejléc
│   │   └── 📄 Footer.tsx           # Lábléc
│   ├── 📁 lib/                     # Segéd könyvtárak
│   │   ├── 📄 auth.ts              # Autentikáció logika
│   │   ├── 📄 auth-utils.ts        # JWT segédek
│   │   ├── 📄 prisma.ts            # Adatbázis kapcsolat
│   │   └── 📄 utils.ts             # Közös segédek
│   └── 📁 types/                   # TypeScript típusok
├── 📁 prisma/                      # Adatbázis séma és seed
│   ├── 📄 schema.prisma            # Adatbázis séma
│   ├── 📄 seed.js                  # Minta adatok
│   └── 📄 dev.db                   # SQLite adatbázis
├── 📁 public/                      # Statikus fájlok
│   └── 📁 uploads/                 # Termék képek
├── 📄 package.json                 # NPM konfiguráció
├── 📄 tailwind.config.ts           # Tailwind beállítások
├── 📄 tsconfig.json                # TypeScript konfiguráció
└── 📄 .env                         # Környezeti változók
```

### Környezeti Változók

Hozz létre egy `.env` fájlt a projekt gyökerében:

```env
# JWT titkosítási kulcs
JWT_SECRET=your-super-secret-jwt-key-here

# Adatbázis URL
DATABASE_URL="file:./dev.db"

# Next.js környezet
NODE_ENV=development
```

### Adatbázis Séma

#### Users tábla
```sql
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  orders    Order[]
}

enum Role {
  USER
  ADMIN
}
```

#### Products tábla
```sql
model Product {
  id          String  @id @default(cuid())
  name        String
  description String?
  price       Float
  category    String
  rating      Float   @default(0)
  inStock     Boolean @default(true)
  imageUrl    String?
  createdAt   DateTime @default(now())
}
```

#### Orders tábla
```sql
model Order {
  id               String      @id @default(cuid())
  userId           String
  user             User        @relation(fields: [userId], references: [id])
  status           OrderStatus @default(PENDING)
  totalAmount      Float
  shippingAddress  String
  createdAt        DateTime    @default(now())
  items            OrderItem[]
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### NPM Scriptek

```json
{
  "scripts": {
    "dev": "next dev --turbopack",           // Fejlesztői szerver
    "build": "next build",                   // Production build
    "start": "next start",                   // Production szerver
    "lint": "next lint",                     // Kód ellenőrzés
    "db:seed": "node prisma/seed.js",        // Adatbázis feltöltés
    "db:reset": "node scripts/reset-database.js --clean",        // Teljes DB reset
    "db:reset-orders": "node scripts/reset-database.js --orders-only",   // Csak rendelések törlése
    "db:reset-user": "node scripts/reset-database.js --user-orders"      // Csak user rendelések törlése
  }
}
```

### Adatbázis Kezelés

**⚠️ FONTOS: A teljes reset az ÖSSZES egyéni adatot eltávolítja!**

```bash
# Cross-platform Node.js scriptek (Windows, macOS, Linux)

# Teljes adatbázis reset (CSAK eredeti állapot marad)
npm run db:reset
# Ez törli:
# • Összes manuálisan regisztrált felhasználót
# • Összes egyéni terméket
# • Összes rendelést
# • Minden egyéni adatot
# 
# Ez megmarad:
# • admin@qalab.hu (ADMIN jogosultság)
# • user@qalab.hu (USER jogosultság)
# • 8 eredeti demo termék

# Csak rendelések törlése (felhasználók és termékek megmaradnak)
npm run db:reset-orders

# Felhasználó-specifikus rendelés törlés
npm run db:reset-user

# Manuális módszerek (cross-platform)
node scripts/reset-database.js --help    # Összes opció megtekintése
node scripts/reset-database.js --clean   # Teljes reset (interaktív megerősítéssel)

# Windows-specifikus helperek
scripts\reset-db.bat help                # Batch file Windows-ra
.\scripts\reset-db.ps1 help              # PowerShell script Windows-ra

# Régi bash script (csak Unix/macOS/Linux)
./scripts/reset-database.sh --help       # Bash verzió
```

### Cross-Platform Támogatás

A rendszer teljes mértékben támogatja a **Windows**, **macOS** és **Linux** operációs rendszereket:

#### Windows felhasználóknak:
```cmd
# Command Prompt / PowerShell
npm run db:reset
npm run db:reset-orders  
npm run db:reset-user

# Batch file helper
scripts\reset-db.bat clean
scripts\reset-db.bat orders

# PowerShell helper  
.\scripts\reset-db.ps1 clean
.\scripts\reset-db.ps1 orders
```

#### macOS/Linux felhasználóknak:
```bash
# NPM scripts (ajánlott)
npm run db:reset
npm run db:reset-orders
npm run db:reset-user

# Direct Node.js
node scripts/reset-database.js --clean

# Bash script
./scripts/reset-database.sh --clean
```

### Prisma Parancsok

```bash
# Adatbázis séma push
npx prisma db push

# Minta adatok betöltése
npx prisma db seed

# Adatbázis böngésző
npx prisma studio

# Prisma kliens újragenerálása
npx prisma generate
```

---

## 🔧 Hibaelhárítás

### Gyakori Problémák

#### ❌ Port már használatban van
```bash
# Port 3000 ellenőrzése
lsof -ti:3000

# Process leállítása
kill -9 $(lsof -ti:3000)

# Vagy másik porton indítás
npm run dev -- -p 3001
```

#### ❌ Adatbázis hiba
```bash
# Adatbázis törlése és újralétrehozása
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

#### 🧹 Tiszta adatbázis létrehozása (teszt adatok nélkül)
```bash
# 1. Teljes reset: Adatbázis törlése és újralétrehozása
rm prisma/dev.db
npx prisma db push
npm run db:seed

# 2. Csak rendelések törlése (felhasználók és termékek megőrzése)
sqlite3 prisma/dev.db "DELETE FROM order_items; DELETE FROM orders;"

# 3. Csak saját rendelések törlése (admin@qalab.hu rendelései megmaradnak)
sqlite3 prisma/dev.db "DELETE FROM order_items WHERE orderId IN (SELECT id FROM orders WHERE userId = (SELECT id FROM users WHERE email = 'user@qalab.hu'));"
sqlite3 prisma/dev.db "DELETE FROM orders WHERE userId = (SELECT id FROM users WHERE email = 'user@qalab.hu');"
```

#### ❌ JWT token problémák
- Ellenőrizd a `.env` fájlban a `JWT_SECRET` változót
- Böngésző cookie-k törlése: DevTools → Application → Cookies

#### ❌ Dependency hibák
```bash
# Node modules törlése és újratelepítés
rm -rf node_modules package-lock.json
npm install

# Vagy tiszta telepítés
npm ci
```

#### ❌ Build hibák
```bash
# TypeScript hibák ellenőrzése
npx tsc --noEmit

# Linting futtatása
npm run lint

# Cache törlése
rm -rf .next
npm run build
```

### Debug Módok

#### Fejlesztői Tools
```bash
# Verbose mód
DEBUG=* npm run dev

# Prisma debug
DEBUG=prisma:* npm run dev
```

#### Logolás
```typescript
// API hibakezelés
console.error('API Error:', error);

// Adatbázis lekérdezések
console.log('DB Query:', query);
```

### Performance Optimalizáció

#### Next.js Turbopack
```bash
# Gyorsabb fejlesztési build
npm run dev --turbopack
```

#### Adatbázis indexelés
```sql
-- Gyakran keresett mezők indexelése
@@index([category])
@@index([price])
@@index([rating])
```

---

## 🎓 Tanulási Célok

Ez az alkalmazás a következő készségek elsajátítását támogatja:

### QA/Testing
- **Playwright automatizált tesztek** írása
- **API tesztelés** REST endpointokkal
- **Form validáció** tesztelése
- **Autentikáció flow** tesztelése
- **Responsív design** tesztelése
- **Cross-browser tesztelés**

### Fejlesztés
- **Next.js App Router** használata
- **TypeScript** fejlesztés
- **Prisma ORM** adatbázis kezelés
- **JWT autentikáció** implementálás
- **RESTful API** tervezés
- **React komponensek** fejlesztése

---

## 🚀 Deployment

### Vercel (Ajánlott)
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Netlify
```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"
```

---

## 📚 További Források

- [Next.js Dokumentáció](https://nextjs.org/docs)
- [Prisma Dokumentáció](https://www.prisma.io/docs)
- [Playwright Dokumentáció](https://playwright.dev/)
- [Tailwind CSS Dokumentáció](https://tailwindcss.com/docs)

---

## 🤝 Közreműködés

Ez egy oktatási projekt. Szívesen fogadunk:
- Új tesztelési forgatókönyveket
- UI komponensek fejlesztését
- API endpoint bővítéseket
- Dokumentáció javításokat

---

## 📝 Licenc

Ez a projekt oktatási célokra készült. Szabadon felhasználható a Playwright tanulási folyamatban!

---

**Boldog Tesztelést!** 🎭🧪

*Készítve ❤️ -tel a QA közösség számára*
