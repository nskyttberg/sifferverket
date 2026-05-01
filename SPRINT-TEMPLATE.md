# SPRINT-TEMPLATE.md

> **Vad detta är:** Mall för en sprint-leveransfil (`sprint-N.md`). Kopiera, döp om till `sprint-N.md`, fyll i, leverera till Claude Code för implementation. Förutsätter att Claude Code först läser `PROJECT-CONVENTIONS.md` så att grundkonventionerna inte behöver upprepas i varje leverans.
>
> Allt mellan `<<<` och `>>>` är platshållare som ska bytas ut. Allt utanför är textstruktur som följer med varje leverans.

---

# Sprint <<<N>>> — Implementationsuppgift

> **Till Claude Code:** Läs först `PROJECT-CONVENTIONS.md` för arkitektur och konventioner. Denna fil beskriver det sprint-specifika innehållet. Vid oklarhet — fråga, gissa inte. Implementera i en sammanhängande arbetsomgång och commit + push när allt är verifierat.

---

## Översikt

Sprint <<<N>>> handlar om <<<KORT MENINGSBESKRIVNING — vad lär sig eleven konceptuellt>>>.

Eleven kommer:
1. <<<Steg 1 i klartext>>>
2. <<<Steg 2 i klartext>>>
3. <<<Steg 3 i klartext>>>

**Vad sprinten *inte* gör:** <<<Tydliggöra vad som medvetet skjuts upp till senare sprintar — dessa avgränsningar är ofta pedagogiskt viktiga>>>

**Förväntad tid:** ca <<<X>>> minuter.

---

## Filändringar

Enligt PROJECT-CONVENTIONS.md krävs ändringar i fyra filer:

1. **Skapa:** `sprint-<<<N>>>/index.html`
2. **Ändra:** `index.html` — uppdatera Sprint <<<N>>>-objektet i `SPRINTS`-arrayen
3. **Ändra:** `sprint-<<<N-1>>>/index.html` — nav-länken "Sprint <<<N>>> (snart)" → aktiv
4. **Ändra:** `assets/scripts.js` — appenda nya step-id:n till `ALL_STEPS`

Eventuellt även:
- <<<Om sprinten introducerar ny CSS-komponent — beskriv här>>>
- <<<Om sprinten ändrar något i en tidigare sprint — listas här>>>

**Commit-meddelande:** `Sprint <<<N>>>: <<<titel>>>`

---

## Step-id för denna sprint

```
<<<step-id-1>>>
<<<step-id-2>>>
<<<step-id-3>>>
```

(ASCII, kebab-case, tematiskt prefix — se PROJECT-CONVENTIONS.md för regler)

---

## Sidstruktur — `sprint-<<<N>>>/index.html`

### 1. `<head>`

- `<title>Sprint <<<N>>>: <<<titel>>> — Sifferverket</title>`
- `<meta name="description" content="<<<kort beskrivning>>>">`
- Standardlänkar till fonter och `/assets/styles.css`
- Eventuella inline `<style>`-block för sprint-specifika komponenter (se PROJECT-CONVENTIONS.md)

### 2. Header + progress-bar + sprint-nav

Standardkomponenter, ändra:
- Header-meta: `Sprint <<<N>>> av 7`
- Sprint-nav: `← Sprint <<<N-1>>>` | `Sprint <<<N>>> — <<<titel>>>` | `Sprint <<<N+1>>> (snart)` (eller aktiv om finns)
- Sprint <<<N+1>>>-länken har klassen `disabled` om den inte är byggd

### 3. Sprint-marker, titel, subtitle, meta

```html
<div class="sprint-marker">
  <span class="num"><<<N>>></span>
  <span>Sprint <<<Tre/Fyra/...>>></span>
</div>
<h2 class="sprint-title"><<<titel>>></h2>
<p class="sprint-subtitle">— <<<italic underrubrik som löser ut motivationen>>>.</p>

<div class="sprint-meta">
  <div><strong>Tid</strong> ca <<<X>>> min</div>
  <div><strong>Kostnad</strong> 0 kr</div>
  <div><strong>Krav</strong> Sprint <<<N-1>>> avklarad</div>
</div>
```

### 4. Inledande prosa

```html
<div class="prose">
  <p class="lead"><<<En lead-paragraf som etablerar varför vi är här. 2–3 meningar. Skapar lust eller förståelse.>>></p>

  <p><<<Brödtext-paragraf 1 — sätter konceptet i sammanhang. Refererar gärna till tidigare sprint så eleven känner kontinuitet.>>></p>

  <p><<<Brödtext-paragraf 2 — introducerar verktyget eller begreppet vi ska arbeta med idag.>>></p>
</div>
```

### 5. <<<Eventuellt diagram eller metafor>>>

Använd `.diagram` om det finns ett naturligt visuellt schema (flöde med pilar, hierarki, etc.). Inte i alla sprintar — bara där det verkligen klargör.

```html
<div class="diagram">
  <div class="diagram-title"><<<diagrammets titel>>></div>
  <div class="diagram-row">
    <div class="diagram-box">
      <span class="icon"><<<bokstav>>></span>
      <<<rubrik>>><br><<<undertext>>>
    </div>
    <div class="diagram-arrow"><<<→ eller ⊃>>></div>
    <!-- fler boxar -->
  </div>
</div>
```

### 6. Steg i — <<<första stegets titel>>>

```html
<div class="step-heading">
  <div class="step-num">i.</div>
  <div class="step-title"><<<första stegets titel>>></div>
</div>

<div class="prose">
  <p><<<Förklaring av varför vi gör detta steg. Vad det betyder konceptuellt.>>></p>
</div>

<div class="action">
  <span class="action-tag">Att göra</span>
  <h4><<<Konkret instruktion-titel>>></h4>
  <ol>
    <li><<<Substeg 1>>></li>
    <li><<<Substeg 2>>></li>
    <li><<<Substeg 3>>></li>
  </ol>
  <div class="completion">
    <label class="checkbox-wrap">
      <input type="checkbox" data-step="<<<step-id-1>>>">
      <span><<<Det eleven ska kunna säga om sig själv när rutan kryssas>>></span>
    </label>
  </div>
</div>

<<<Eventuell .memo-ruta efter stege — för att stanna upp och förklara vad eleven nyss gjorde>>>
```

### 7. Steg ii — <<<andra stegets titel>>>

(Samma struktur som steg i)

### 8. Steg iii — <<<tredje stegets titel>>>

(Samma struktur)

### <<<Eventuellt: Sprint-specifik dramatik>>>

T.ex. `.principle`-ruta om sprinten introducerar en ny princip. T.ex. en stor memo-ruta som markerar ett pedagogiskt klimax. Bara där det förtjänas — inte i varje sprint.

### N. Avslutande ordlista

```html
<div class="step-heading">
  <div class="step-num"><<<sista bokstaven>>>.</div>
  <div class="step-title">Vad du nu kan</div>
</div>

<div class="prose">
  <p><<<Antal>>> nya ord du nu förstår, åtminstone i magkänslan:</p>
</div>

<dl style="margin-top: 24px;">
  <div class="definition">
    <dt><<<Term 1>>></dt>
    <dd><<<Definition i en mening, tonen ska vara lugn och konkret>>></dd>
  </div>
  <!-- fler definitioner -->
</dl>
```

### N+1. Avslutande "decision"-ruta

```html
<div class="decision">
  <h3>Sprint <<<N>>> avklarad</h3>
  <p><<<Avslutsmening som binder till nästa sprint utan att avslöja för mycket>>></p>
  <a href="/">Tillbaka till översikten →</a>
</div>
```

---

## Ändring i `index.html` (rotmappen)

I `SPRINTS`-arrayen, hitta Sprint <<<N>>>-objektet (det är förmodligen redan där som "Kommer snart"):

**Ersätt:**
```javascript
{ id: <<<N>>>, num: '<<<num>>>', title: '<<<titel>>>',
  sub: '<<<sub>>>',
  duration: '~ <<<X>>> min', meta: 'Kommer snart',
  url: null, steps: [] }
```

**Med:**
```javascript
{ id: <<<N>>>, num: '<<<num>>>', title: '<<<titel>>>',
  sub: '<<<sub>>>',
  duration: '~ <<<X>>> min', meta: '<<<flavor som hintar vad sprinten handlar om>>>',
  url: '/sprint-<<<N>>>/',
  steps: ['<<<step-id-1>>>', '<<<step-id-2>>>', '<<<step-id-3>>>'] }
```

Logiken renderar resten automatiskt.

---

## Ändring i `sprint-<<<N-1>>>/index.html`

Hitta i `<nav class="sprint-nav">`:

```html
<a href="#" class="disabled">Sprint <<<N>>> (snart)</a>
```

Ersätt med:

```html
<a href="/sprint-<<<N>>>/">Sprint <<<N>>> →</a>
```

---

## Ändring i `assets/scripts.js`

Lägg till nya step-id:n sist i `ALL_STEPS`-arrayen:

```javascript
const ALL_STEPS = [
  // ... (befintliga step-id:n)
  // Sprint <<<N>>>
  '<<<step-id-1>>>', '<<<step-id-2>>>', '<<<step-id-3>>>'
];
```

---

## Verifiering innan commit

1. **Öppna `/sprint-<<<N>>>/index.html`** (lokal server eller via deploy-preview):
   - Layouten matchar tidigare sprintar
   - Alla bockrutor finns och kan klickas
   - <<<Eventuella sprint-specifika element verifieras>>>
   - Decision-rutan länkar tillbaka till `/`

2. **Öppna `/`** (landningssidan):
   - Med alla tidigare sprintars bockrutor ikryssade visas Sprint <<<N>>> som "Nästa Tjänstgöring"
   - Sprintlistan i botten visar Sprint <<<N>>> som tillgänglig

3. **Klicka från `/sprint-<<<N-1>>>/` → `/sprint-<<<N>>>/`** — länken fungerar

4. **Progress-baren** uppdateras när bockrutor klickas på sprint-<<<N>>>-sidan

5. **Externa länkar** — för varje `<a href="https://...">` du lagt till eller flyttat: öppna URL:en i en webbläsare och bekräfta att den landar på rätt ställe. Platshållarlänkar som `https://github.com/` (utan repo-path) ska aldrig committas.

Om något inte stämmer: påpeka till mig istället för att gissa eller "fixa". Bättre att fråga än att göra ändringar i tidigare sprintars CSS eller logik.

---

## Commit + push

```bash
git add sprint-<<<N>>>/ index.html sprint-<<<N-1>>>/index.html assets/scripts.js
git status   # verifiera att inget oväntat finns med
git commit -m "Sprint <<<N>>>: <<<titel>>>"
git push
```

Vercel auto-deployar inom ~30 sekunder.

---

## Sammanfattning till användaren

Efter klart deploy, rapportera kort:

```
✓ /sprint-<<<N>>>/index.html skapad
✓ index.html SPRINTS-array uppdaterad
✓ sprint-<<<N-1>>>/index.html nav uppdaterad
✓ assets/scripts.js ALL_STEPS uppdaterad
✓ Commit + push klar — Vercel deployar nu

Live om ~30 sekunder på samma URL.

<<<Eventuell mening om vad nästa sprint kommer fokusera på>>>
```

---

*Slut på sprint-<<<N>>>.md*
