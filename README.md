# Sifferverket

En interaktiv utbildning som lär noviser hur en modern webbapp hänger ihop — genom att låta dem bygga sin egen "Makrodata-raffineringsapp" steg för steg.

**Live:** https://sifferverket.vercel.app

## Vad är detta?

En lekfull och pedagogisk utbildning på svenska, organiserad i 7 sprintar à 20–40 minuter. Eleven lär sig flödet mellan webapp ↔ Supabase ↔ Claude.ai ↔ GitHub ↔ Vercel — utan att själv behöva kunna koda. Allt körs på gratistjänster.

Estetiken är inspirerad av en viss kontorsserie utan att låna varumärket. Avdelningen heter "Sifferverket".

## Teknisk stack

- Ren HTML, CSS och JavaScript — ingen build-process
- Hostad på Vercel
- Källkod på GitHub
- Inga beroenden förutom Google Fonts

## Filstruktur

```
sifferverket/
├── index.html              Landningssida + sprintöversikt
├── sprint-0/index.html     Anställningsdagen
├── sprint-1/index.html     Ditt skrivbord
├── sprint-2/index.html     Siffrorna anländer
├── sprint-3/index.html     Receptionen pratar med arkivet
├── sprint-4/index.html     Raffineringen
├── sprint-N/index.html     (kommer — sprintar 5–7)
├── assets/
│   ├── styles.css          Delad styling
│   └── scripts.js          Delad klientlogik (progress, namn, etc.)
├── vercel.json             Vercel-konfiguration
├── .gitignore
├── DEPLOY.md               Engångs-instruktion för första deploy
├── PROJECT-CONVENTIONS.md  Levande arkitektur- och stilreferens
├── SPRINT-TEMPLATE.md      Mall för nya sprint-leveranser
└── README.md
```

## Lokalt

Sajten använder root-relativa paths (`/assets/styles.css`, `/sprint-0/`) så att den fungerar identiskt lokalt som på Vercel. Det innebär att **du behöver en lokal server** — dubbelklick på filen räcker inte. Välj en metod:

**Med Node (rekommenderat):**
```
npx serve .
```

**Med Python:**
```
python -m http.server 8000
```

Öppna sedan `http://localhost:8000` (eller den port servern visar) i webbläsaren.

## Deploy

Se `DEPLOY.md` för fullständig deploy-guide.

## Bidrag

Repositoryt är publikt för transparens — eleven uppmuntras att titta i koden för att förstå hur sajten är byggd. Pull requests är dock inte aktivt välkomna; det här är ett kuraterat utbildningsmaterial.

## Licens

Allt innehåll © upphovsmannen. Koden är fri att studera och inspireras av.
