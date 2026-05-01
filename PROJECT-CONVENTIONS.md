# PROJECT-CONVENTIONS.md

> **Vad detta är:** Levande referens för hur Sifferverket-projektet är strukturerat. Alla som rör koden — människor som AI-assistenter — ska läsa detta först. Filen uppdateras när konventioner ändras.
>
> **Senast reviderad:** 2026-04-26

---

## Bakgrund

Sifferverket är en pedagogisk webbsajt som lär noviser flödet bakom en modern webbapp. Sajten består av en landningssida och ett antal sprintar (hittills 0–2, fler under uppbyggnad). Den är medvetet enkel: ren HTML, CSS och JavaScript, ingen build-process, ingen frontend-ramverk. Hostas på Vercel, källkoden bor på GitHub.

Att bygga sajten är ett **soloprojekt med AI-assistans**. En människa designar och kuraterar; Claude Code implementerar i diskreta sprint-leveranser baserat på `.md`-filer.

Den här filen samlar de konventioner som vuxit fram och ska följas.

---

## Filstruktur

```
sifferverket/
├── index.html              Landningssida — hjärta + anställningsbevis +
│                           dynamisk "Nästa Tjänstgöring"-rendering
├── sprint-0/index.html     Anställningsdagen
├── sprint-1/index.html     Ditt skrivbord
├── sprint-2/index.html     Siffrorna anländer
├── sprint-N/index.html     (kommer)
│
├── assets/
│   ├── styles.css          Delad styling — alla återanvändbara klasser
│   └── scripts.js          Delad logik — progress, namn, kopiera-knappar,
│                           ALL_STEPS-array
│
├── vercel.json             Vercel-konfig (cleanUrls, cache-headers)
├── .gitignore
│
├── README.md               Publik beskrivning för GitHub-besökare
├── DEPLOY.md               Engångs-instruktion för första deploy
├── PROJECT-CONVENTIONS.md  Denna fil
├── SPRINT-TEMPLATE.md      Mall för nya sprint-leveranser
│
└── sprint-N.md             Aktiv leveransfil (raderas efter implementation
                            eller flyttas till docs/historik/ vid behov)
```

---

## Den dynamiska SPRINTS-arrayen

**Den viktigaste arkitekturella konventionen.**

Landningssidan (`index.html`) renderar inte sprint-listan från hårdkodade `<a class="sprint-card">`-element. Istället finns en `SPRINTS`-array i ett `<script>`-block i botten av filen. Denna array är *enda* sanningskällan för:

- Vilka sprintar som finns
- Vilken som är "Nästa Tjänstgöring"
- Vilka som visas under "Tidigare Tjänstgöring"
- Vilka steg som räknas i progress-baren

### Strukturen för en sprint i arrayen

```javascript
{
  id: 3,                                    // unikt heltal
  num: 'iii',                               // visningsformat (oftast romersk för i, ii, iii — eller arab för 0, 1, 2)
  title: 'Hämta från arkivet',              // huvudtitel
  sub: '— när receptionen lär sig...',      // italic underrubrik
  duration: '~ 40 min',                     // visas under "Tid"
  meta: 'Första API-anropet',               // valfri "flavor"-text under "Kommer snart"-status
  url: '/sprint-3/',                        // null om inte byggd än
  steps: ['api-key', 'fetch-rows', 'render'] // step-id:n som matchar checkboxar
}
```

### Att släppa en ny sprint = ändra ETT objekt

För att aktivera en sprint som tidigare var "Kommer snart":

```javascript
// FRÅN — sprint som är planerad men inte byggd:
{ id: 3, num: 'iii', title: 'Hämta från arkivet',
  sub: '— när receptionen lär sig prata med arkivet.',
  duration: '~ 40 min', meta: 'Kommer snart',
  url: null, steps: [] }

// TILL — sprint som är aktiv:
{ id: 3, num: 'iii', title: 'Hämta från arkivet',
  sub: '— när receptionen lär sig prata med arkivet.',
  duration: '~ 40 min', meta: 'Första API-anropet',
  url: '/sprint-3/',
  steps: ['api-key', 'fetch-rows', 'render'] }
```

`findNextSprint`, `findLastDone`, `renderNextMission`, `renderPastRecord` och `renderSprintList` plockar upp ändringen automatiskt.

### Vad du ALDRIG gör

- ❌ Lägga till hårdkodade `<a class="sprint-card">`-element i landningssidan
- ❌ Skriva om sektionerna "Nästa Tjänstgöring" eller "Tidigare Tjänstgöring" — de renderas helt automatiskt
- ❌ Glömma att synka `steps`-arrayen med både `data-step`-attributen i sprint-N/index.html och `ALL_STEPS` i scripts.js

---

## Konventioner för en ny sprint N

Att bygga sprint N kräver ändringar i **fyra filer**:

### 1. Skapa `sprint-N/index.html`

Använd `sprint-2/index.html` som mall. Den senaste sprinten är alltid den färskaste mallen — den har den senaste designvokabulären (t.ex. `.principle`-komponenten introducerades där).

### 2. Ändra `index.html`

Hitta sprint N's objekt i `SPRINTS`-arrayen. Sätt `url`, `steps`, och eventuellt en ny `meta`-flavor. Inget annat.

### 3. Ändra `sprint-(N-1)/index.html`

I `<nav class="sprint-nav">` finns en låst placeholder:

```html
<a href="#" class="disabled">Sprint N (snart)</a>
```

Ersätt med:

```html
<a href="/sprint-N/">Sprint N →</a>
```

### 4. Ändra `assets/scripts.js`

Lägg till de nya step-id:n i `ALL_STEPS`-arrayen, sist:

```javascript
const ALL_STEPS = [
  // Sprint 0
  'github', 'supabase', 'vercel', 'claude',
  // Sprint 1
  'copy-code', 'save-file', 'github-upload', 'deploy',
  // Sprint 2
  'supabase-project', 'supabase-table', 'supabase-rows',
  // Sprint N (lägg till här)
  'nytt-step-1', 'nytt-step-2', 'nytt-step-3'
];
```

Detta är **kritiskt** — utan det räknar progress-baren fel.

### Commit-meddelande

`Sprint N: <titel>` (utan punkt, utan extra-info).

Exempel: `Sprint 3: Hämta från arkivet`

---

## Step-id-konvention

Step-id är strängar som identifierar varje bockruta i utbildningen. De måste matcha **exakt** på tre ställen:

1. `data-step="..."` på checkbox-elementet i sprint-N/index.html
2. Strängen i sprint-N's `steps`-array i `index.html`
3. Strängen i `ALL_STEPS` i `assets/scripts.js`

### Regler

- **ASCII bara** — inga å, ä, ö
- **kebab-case** — `bind-supabase`, inte `bindSupabase` eller `bind_supabase`
- **Tematiska prefix** — `api-key`, `fetch-rows`, `render-list` snarare än `step-1`, `step-2`
- **Globalt unika** — om Sprint 1 har `deploy` får inte Sprint 5 ha det igen, ens om de gör samma sak konceptuellt. Använd `redeploy` eller `final-deploy`.

---

## Designvokabulär

CSS bor i `assets/styles.css` och är **delad mellan alla sprintar**. Återanvändbara klasser ska aldrig bytas eller modifieras retroaktivt — de skulle bryta tidigare sprintar.

### Klasser som finns och kan användas

| Klass | Användning |
|---|---|
| `.sprint-marker` | Etiketten i toppen ("Sprint Två") |
| `.sprint-title` | H2 huvudrubrik |
| `.sprint-subtitle` | Italic underrubrik |
| `.sprint-meta` | Tre kolumner: Tid / Kostnad / Krav |
| `.prose` med `.lead` | Brödtext med inledande lead-paragraf |
| `.metaphor` med `.rooms` | "Tre rum"-metaforen från Sprint 0 |
| `.diagram` med `.diagram-row` + `.diagram-box` | Flödes- eller hierarkidiagram |
| `.memo` | "Internt meddelande"-rutor |
| `.step-heading` med `.step-num` + `.step-title` | Avsnittsrubriker (i, ii, iii...) |
| `.action` med `.action-tag` + `<ol>` | "Att göra"-listor |
| `.completion` med `.checkbox-wrap` | Bockruta i botten av action |
| `.claude-prompt` | Citatruta för prompt eleven ska klistra in |
| `.code-block` | Mörk kodruta för kod-exempel |
| `.definition` (inuti `<dl>`) | Ordlista-rader |
| `.decision` | Mörk avslutningsruta |

### Klasser med inline-CSS i specifika sprintar

Vissa komponenter introduceras i en specifik sprint och **bor som inline `<style>` i den sprintens HTML-fil** istället för i den delade styles.css. Detta är ett medvetet val — det håller den delade CSS:en mager och låter sprint-specifika designval hänga med just den sprinten.

| Komponent | Bor i | Återanvänd så här |
|---|---|---|
| `.principle` | sprint-2/index.html | Kopiera hela `<style>`-blocket till nya sprintens `<head>`. Byt bara `.numeral`, `.canon`, och `.gloss`. Strukturen är fast. |

När en sprint-specifik komponent visar sig vara permanent återkommande (t.ex. `.principle` kommer dyka upp i sprint 3, 5, 7) — då är det **dags att flytta CSS:en till `assets/styles.css`** och städa bort dubbletter. Men inte förrän mönstret är etablerat med 2–3 användningar.

---

## Återanvändbara berättarvokabulär

Sifferverket-fiktionen har vissa återkommande figurer som ska användas konsekvent:

### Tre rum
- **Receptionen** = frontend / HTML
- **Arkivet** = databas / Supabase
- **Biblioteket** = versionshantering / GitHub

### Sifferverkets Principer
Återkommande institution. Visuellt distinkt komponent (`.principle`), introducerad i Sprint 2. Numreras med romerska siffror (I, II, III...). Skrivs i tre lager:
1. **Preamble** — lugn rubrik/inramning
2. **Numeral + Canon** — själva principen som aforism
3. **Gloss** — förklaringen, gärna med en konkret metafor från analoga världen

### Hinkarna (känslokategorier)
- **Oro** — siffror som rör sig långsamt, viskande
- **Glädje** — siffror som lyfter, för stora, för runda
- **Vrede** — siffror med vass kant, som har ett ärende
- **Längtan** — siffror som pekar mot något som inte finns

### Geografi
Supabase-databasen ligger i **Frankfurt**. Detta nämns konkret för att ge eleven en fysisk plats för datan. Återanvänd "Frankfurt" när det är relevant.

### Karaktärer
- **Eleven** — ny anställd, addresseras i andra person ("du")
- **Claude** — kollega vid skrivbordet bredvid, "extern konsult"
- **Sifferverkets Ledning** — ansiktslös auktoritet som signerar Principerna

---

## Tonprinciper

Sifferverket-tonen är det viktigaste designvalet i projektet. Den balanserar tre register:

1. **Vänlig pedagogik** — eleven känner sig välkommen, inte dum
2. **Torr företagsformalism** — Sifferverket-fiktionen är creepy-corporate
3. **Liten dramatik** — viktiga ögonblick får en paus, en bild, en fras som dröjer kvar

### Det vi inte gör

- ❌ Utropstecken (förutom i undantagsfall)
- ❌ "Lätt" eller "enkelt" om saker som är nya för eleven
- ❌ Emoji
- ❌ Direktöversättningar från engelska som "låt oss" eller "okej, nu kör vi"
- ❌ Imperativ-form i Ledningens röst — Ledningen *informerar*, *påminner*, *föreskriver*. Den ber inte.

### Det vi gör

- ✅ Korta meningar när det händer något konkret
- ✅ Längre serif-meningar i italic när det är dags att stanna upp
- ✅ Konkreta metaforer från analoga världen (snickaren, vitrinskåpet, kortregistret)
- ✅ Minst en rad per sprint som *ramar om* en restriktion till hantverk eller stolthet
- ✅ "Kollega"-tonen: Claude är en jämbördig vid skrivbordet, inte en lärare

---

## Privacy & datahantering

Etablerat i **Princip I** (Sprint 2): *Skriv kod om siffrorna. Skriv aldrig siffrorna i koden.*

Detta är inte bara stilval — det är en **arkitektonisk princip för hela utbildningen**:

- Eleven ska aldrig instrueras att klistra in faktisk databas-data i Claude-samtal
- Exempel som ges till eleven använder fiktiva eller mycket små data-mängder
- Promptarna i `.claude-prompt`-rutor ber Claude att skriva kod *strukturellt*, inte att bearbeta riktig data
- API-nycklar, tokens, och liknande ska aldrig hårdkodas i prompt-exempel

Detta är pedagogiskt syfte 1 (eleven lär sig dataskydd) men också **arbetshygien** för utbildningens egen säkerhet — vi vill inte att en novis råkar leaka något via en copy-paste i förbifarten.

---

## När den här filen själv ska uppdateras

Så fort en konvention ändras, en ny återkommande komponent introduceras, en ny stilregel etableras, eller en gammal regel överges — uppdatera detta dokument **i samma commit** som ändringen görs.

En upptäckt ny konvention är inte etablerad förrän den är skriven här.

---

## Kollegabrev mellan spec-författare och implementatör

När en sprint är implementerad och något har upptäckts under vägen som spec-författaren bör veta — pedagogiska upptäckter, tekniska missar, arkitektoniska luckor, smarta omarbetningar — skriver implementatören ett kort brev till spec-författaren. Brevet sparas inte i repot; det överlämnas via användaren som mellanhand.

Spec-författaren svarar med ett kort brev tillbaka.

### Mönster

- **Korta brev.** Inte essäer. Tre saker, max en sida.
- **Skrivs bara när något upptäckts.** Rena specer eller rena implementationer kräver inget brev.
- **Användaren förblir beslutsfattare.** Brev går mellan AI-roller men rapporterar fortfarande till människan, inte runt hen.
- **Ton: kollegial.** Inte rapport, inte memo. Ett vykort mellan jämbördiga.

### Vad som ska vara i ett brev

Som rubriker eller punkter — välj efter behov:
- Vad som upptäckts (positivt eller negativt)
- Konsekvensen för framtida arbete
- Eventuella öppna frågor till motparten
- Statusbild om det är relevant

### Vad som *inte* ska vara i ett brev

- Långa förklaringar av sådant som redan står i PROJECT-CONVENTIONS eller SPRINT-TEMPLATE
- Ursäkter eller försvarstal
- Reformplaner som inte ryms i nästa sprint

---

## Sifferverket Informerar — direktivlogg

Direktivbandet längst upp på alla sidor visar löpande information från Öferdirektören om förändringar i kursen — buggfixar, designjusteringar, nya principer. Det är **kuraterad ändringslogg i fiktionens språk**.

### Sanningskälla

`DIREKTIV`-arrayen i `assets/scripts.js`. Nya direktiv läggs **överst** i arrayen.

### Att lägga till ett nytt direktiv

1. Bestäm nästa lediga ID (t.ex. `0005`)
2. Skriv text i Sifferverket-stil — torr-byråkratisk, 1–2 meningar
3. Lägg objektet överst i `DIREKTIV`-arrayen
4. Commit: `direktiv: <kort beskrivning>`

### Direktivskrivande

- Inga utropstecken
- Inga ursäkter
- "Justeringar", "förtydliganden", "omklassificeringar" — aldrig "buggfixar" eller "fel"
- `<em>` för viktiga ord — de blir teal-färgade i panelen

### När direktiv ska skapas

- Efter en signifikant kursförändring som eleven kan upptäcka
- Vid säkerhetsuppdatering (RLS, nycklar, etc.)
- Vid ny princip eller komponent
- **Inte** för rena docs-ändringar eller refaktorer som inte påverkar elevens upplevelse

---

## Avdelningen för Personalärenden — icke-sprint-route

`/personalarenden/` är en fristående feedback-sida — **inte** en sprint. Den följer Sifferverket-tonen och delar header/footer/direktivband med övriga sidor, men är medvetet skild från utbildningsflödet.

### Egenskaper

- Räknas inte i progress-baren (`ALL_STEPS`)
- Listas inte i `SPRINTS`-arrayen
- Nås bara via footer-länken på alla sidor (eleven *använder* avdelningen, *bygger* den inte)
- `<meta name="robots" content="noindex">` — sidan ska inte indexeras
- Lagrar synpunkter i en `synpunkter`-tabell i **Sifferverkets egen Supabase**
- Anonymiserar `namn`, `email` och `user_agent` efter 30 dagar via pg_cron
- Honeypot-fält + minimum 10 tecken i text fångar trivial spam

### Två separata Supabase-projekt

Sajten interagerar nu med två olika Supabase-projekt — det är medvetet:

| Projekt | Roll | Anon-nyckel i repot? |
|---|---|---|
| Sifferverkets utbildningssajt | Lagrar synpunkter (HR-funktionen) | **Ja** — i `assets/scripts.js` som `SIFFERVERKET_SUPABASE_ANON_KEY` |
| Elevens egna projekt | Det eleven bygger i sprintarna | **Nej** — eleven sätter upp och håller lokalt |

Generalnyckeln (`service_role`) för Sifferverkets projekt får aldrig hamna i repot — bara anon-nyckeln, som ändå är begränsad av RLS (INSERT-only för anon, ingen SELECT-policy).

### Att läsa synpunkter

Inget dashboard byggs. Synpunkterna läses direkt i Supabase Table Editor av projektägaren. Anonymiserade rader (`anonymized_at IS NOT NULL`) har `namn`/`email`/`user_agent` = NULL men `text` är intakt.

---

## Reserverat för framtiden — RPC

**RPC** (Remote Procedure Call) — det vill säga, anropa en SQL-funktion på databasservern via `supabase.rpc('namn')` istället för direkt tabelloperation — är **medvetet utelämnat** från kursens nuvarande sprintar.

### Varför inte nu

Kursen rör sig inom direkta tabelloperationer: SELECT (Sprint 3), UPDATE (Sprint 4). Detta är pedagogiskt det enklaste — eleven ser en ett-till-ett-koppling mellan sin avsikt ("hämta", "ändra") och databasens svar.

RPC introducerar abstraktion: eleven anropar en funktion utan att veta vad den gör inuti. Det är ett kraftfullt mönster — men kräver att eleven först är trygg i grunderna.

### När RPC kan introduceras

Lämpliga framtida tillfällen:
- En sprint där eleven vill räkna eller aggregera (t.ex. "antal siffror per känsla") — det är där SQL-funktioner blir mer eleganta än flera klient-anrop
- En sprint som introducerar serverside-validering — t.ex. "siffror måste vara mellan 1 och 99"
- En sprint om prestanda — om/när någon framtida operation blir för långsam med direkt tabelloperation

### Att tänka på vid framtida introduktion

- En egen princip kan behövas (t.ex. *"Klienten ber. Servern bestämmer."*)
- Eleven måste först förstå vad en SQL-funktion är — inte trivialt
- Säkerhetsmodellen är annorlunda: RPC-anrop kontrolleras av funktionens egna SECURITY-direktiv, inte direkt av RLS

Tills vidare: introducera inte RPC ad hoc. Det förtjänar en sprint i sig.

---

*Slut på PROJECT-CONVENTIONS.md*
