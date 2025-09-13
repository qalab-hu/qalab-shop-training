# Design System Guide

Ez a projekt egy központi design konfigurációs rendszert használ a következetes szín- és stíluskezeléshez.

## Design Config Használata

### Központi Konfiguráció
A design tokenek a `/src/lib/design-config.ts` fájlban találhatók.

### Színpaletta

#### Javított Kontrasztú Színek
```typescript
// Helyett: text-gray-400 (túl halvány #EDEDED)
// Használjuk: text-gray-600 (jól látható kontrasztú)

// Példa:
import { colors, typography } from '@/lib/design-config';

// Tailwind osztályok
className="text-gray-600"      // Helyett text-gray-400
className="border-gray-400"    // Helyett border-gray-300  
className="bg-gray-100"        // Jól látható háttér
```

#### Szöveg Színek Hierarchia
- **Primary text**: `text-gray-800` - Fő szövegek
- **Secondary text**: `text-gray-600` - Másodlagos információk
- **Muted text**: `text-gray-500` - Kisebb fontosságú szövegek
- **Disabled**: `text-gray-400` - Letiltott elemek

#### Border Színek
- **Default**: `border-gray-400` - Jól látható keretezés
- **Focus**: `border-blue-500` - Fókusz állapot
- **Light**: `border-gray-200` - Finom elválasztás

### Komponens Váriantak

#### Button Komponens
```typescript
variants: {
  primary: { bg: blue-600, text: white },
  secondary: { bg: gray-100, text: gray-800 }, // Sötét szöveg
  outline: { border: gray-400, text: gray-700 } // Látható border
}
```

#### Input Komponens
```typescript
input: {
  border: gray-400,      // Látható keret
  text: gray-800,        // Sötét szöveg
  placeholder: gray-500  // Olvasható placeholder
}
```

## Accessibility & Kontraszт

### WCAG AA Megfelelőség
- Minimum 4.5:1 kontrasztarány normál szöveghez
- Minimum 3:1 kontrasztarány nagy szöveghez
- `text-gray-600` és `border-gray-400` megfelelnek ezeknek

### Tesztelés
```bash
# Kontraszт ellenőrzés online eszközökkel:
# - WebAIM Contrast Checker
# - Colour Contrast Analyser
```

## Migráció Útmutató

### Cseréld ki ezeket:
```css
/* RÉGI - túl halvány */
.text-gray-400     → .text-gray-600
.border-gray-300   → .border-gray-400
.text-gray-300     → .text-gray-500 (ha szükséges)

/* MEGTARTANDÓ */
.text-gray-300     → Csillag üres állapotok, progress indikátorok
.bg-gray-300       → Inaktív állapotok, letiltott gombok
```

### Design Config Importálása
```typescript
import { colors, typography, variants } from '@/lib/design-config';

// Komponensben
const buttonClass = variants.button.primary.bg;
const textColor = typography.text.primary;
```

## Frissítések

### Verzió 1.0
- ✅ Halvány `#EDEDED` színek kijavítva
- ✅ `text-gray-400` → `text-gray-600` migrálva  
- ✅ `border-gray-300` → `border-gray-400` frissítve
- ✅ Footer, ikonok, form elemek javítva
- ✅ Központi design config létrehozva

### Következő Lépések
- [ ] Tailwind config frissítése egyéni színekkel
- [ ] Dark mode támogatás
- [ ] Component library dokumentáció
