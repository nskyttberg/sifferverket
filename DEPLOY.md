# DEPLOY.md — Instruktioner för Claude Code

> **Status: HISTORISK.** Denna runbook kördes 2026-04-25 (commit `ffc5da4`) och repot är sedan dess deployat på Vercel med GitHub-integration — varje push till `main` auto-deployar inom ~30 sekunder. Filen behålls för transparens och som återställnings-guide om repot någon gång behöver byggas upp från noll.
>
> **Vid normalt arbete:** ignorera denna fil. Sprintleveranser sköts via individuella `sprint-N.md`-filer enligt mallen i `SPRINT-TEMPLATE.md`.
>
> **Till dig som läser detta vid en återställning:** Ge denna fil till Claude Code med en enkel prompt:
> *"Läs DEPLOY.md i projektmappen och kör igenom den steg för steg. Stoppa och fråga mig vid varje punkt som kräver mitt beslut eller mina inloggningsuppgifter."*
>
> Claude Code kommer då navigera den här filen som en checklista, köra alla terminal-kommandon själv, och stoppa vid de markerade beslutspunkterna.

---

## Översikt

Det här projektet är en statisk HTML-sajt utan build-process. Målet är att:

1. Initiera ett lokalt Git-repo i projektmappen
2. Skapa ett publikt repository på GitHub under användarens personliga konto
3. Pusha den lokala koden till GitHub
4. Importera repot till Vercel och deploya
5. Verifiera att allt fungerar och uppdatera README med live-URL

**Förkrav:** Användaren kör Windows och har följande installerat:
- `git` (kontrollera med `git --version`)
- `gh` — GitHub CLI (kontrollera med `gh --version`)
- `node` och `npm` (för att köra Vercel CLI)
- En modern webbläsare för att godkänna OAuth-flöden

Om något saknas: stoppa och be användaren installera det. Föreslagna installationsvägar:
- **Git for Windows**: https://git-scm.com/download/win (ger även Git Bash)
- **GitHub CLI**: https://cli.github.com/ (eller `winget install --id GitHub.cli`)
- **Node.js LTS**: https://nodejs.org/ (eller `winget install OpenJS.NodeJS.LTS`)

Vercel CLI installeras via npm när vi behöver den.

**Note om shell:** Föredra att köra kommandon i Git Bash eller PowerShell. Om Claude Code redan är i en specifik shell, anpassa kommandona därefter (t.ex. använd `Get-ChildItem` istället för `ls` i ren PowerShell, eller bara använd `dir` i cmd).

---

## Beslut som ska bekräftas innan vi börjar

Stoppa här och fråga användaren om dessa val. Föreslå defaultvärdena nedan men låt användaren ändra.

| Val | Föreslaget värde | Notering |
|---|---|---|
| GitHub-repots namn | `sifferverket` | Måste vara unikt under användarens konto |
| Synlighet | `public` | Krav för Vercel Hobby-plan + transparens mot eleverna |
| Beskrivning | "Lekfull utbildning i hur en modern webbapp hänger ihop." | |
| Vercel-projektnamn | Samma som repot | |
| Branch | `main` | |
| Default Git-användare | Hämtas från `git config --global user.name` om satt | Be om det om saknas |

---

## Steg 1 — Verifiera projektets innehåll

Kör i projektets rotmapp:

```bash
ls -la
```

Förvänta dig att se:
- `index.html`
- `sprint-0/index.html`
- `sprint-1/index.html`
- `assets/styles.css`
- `assets/scripts.js`
- `vercel.json`
- `.gitignore`
- `README.md`
- `DEPLOY.md` (denna fil)

Om något saknas: stoppa och rapportera.

**Sanity-test:** Verifiera att index.html finns och är välformad HTML:

```bash
# Kontrollera filstorlek - ska vara > 0 byte
wc -c index.html sprint-0/index.html sprint-1/index.html assets/styles.css assets/scripts.js

# Verifiera att index.html startar med <!DOCTYPE html>
head -1 index.html
```

Om något saknas eller är tomt — stoppa och utred.

---

## Steg 2 — Initiera lokalt Git-repo

```bash
# Initiera bara om .git inte redan finns
if [ ! -d .git ]; then
  git init -b main
fi

# Lägg till alla filer (.gitignore tar hand om det som inte ska med)
git add .

# Verifiera vad som kommer committas
git status
```

**Stoppa och visa `git status` för användaren.** Be hen bekräfta att listan ser rimlig ut innan första commit.

När bekräftat:

```bash
git commit -m "Sifferverket — första versionen"
```

---

## Steg 3 — Skapa GitHub-repo och pusha

Kontrollera först att `gh` är inloggad:

```bash
gh auth status
```

Om inte inloggad — kör `gh auth login` och låt användaren följa OAuth-flödet i webbläsaren. Välj:
- GitHub.com
- HTTPS
- Yes (autenticera Git med GitHub-credentials)
- Login with a web browser

När inloggad, skapa repot och pusha i ett kommando:

```bash
gh repo create sifferverket \
  --public \
  --source=. \
  --remote=origin \
  --description="Lekfull utbildning i hur en modern webbapp hänger ihop." \
  --push
```

Om användaren har valt ett annat reponamn — byt ut `sifferverket` ovan.

**Verifiera att pushen lyckades:**

```bash
gh repo view --web
```

(Det här öppnar repot i webbläsaren — användaren kan visuellt bekräfta att filerna ligger där.)

---

## Steg 4 — Deploya till Vercel

Installera Vercel CLI globalt om den saknas:

```bash
# Kontrollera om vercel CLI finns
if ! command -v vercel &> /dev/null; then
  npm install -g vercel
fi

vercel --version
vercel whoami
```

Om `whoami` ger fel — kör `vercel login` och låt användaren följa OAuth-flödet (välj "Continue with GitHub" om frågan kommer).

**Skapa och deploya projektet:**

```bash
# Första gången — länka projektet till Vercel-kontot
# Vercel kommer fråga ett antal saker; använd dessa svar:
#   Set up and deploy? Y
#   Which scope? <användarens personliga konto, inte en organisation>
#   Link to existing project? N
#   What's your project's name? sifferverket
#   In which directory is your code located? ./
#   Want to modify settings? N
vercel
```

**Stoppa och be användaren följa de interaktiva frågorna i terminalen.** Detta körs bara första gången.

När länkningen är klar — gör en produktionsdeploy:

```bash
vercel --prod
```

Vänta tills kommandot returnerar en URL (typiskt `https://sifferverket-xxxxx.vercel.app`). Spara URL:en — vi ska in den i README.

---

## Steg 5 — Verifiera live-deployen

```bash
# Hämta produktions-URL programmatiskt
PROD_URL=$(vercel inspect --prod 2>/dev/null | grep -oE 'https://[^ ]+\.vercel\.app' | head -1)
echo "Produktions-URL: $PROD_URL"

# Smoke-test: kontrollera att sidan svarar
curl -s -o /dev/null -w "Status: %{http_code}\n" "$PROD_URL"
curl -s -o /dev/null -w "Status: %{http_code}\n" "$PROD_URL/sprint-0"
curl -s -o /dev/null -w "Status: %{http_code}\n" "$PROD_URL/sprint-1"
curl -s -o /dev/null -w "Status: %{http_code}\n" "$PROD_URL/assets/styles.css"
```

Alla fyra ska returnera `Status: 200`. Om något ger 404 — kontrollera `vercel.json` och rapportera till användaren.

---

## Steg 6 — Uppdatera README med live-URL

Hitta raden i `README.md` som lyder:

```
**Live:** _(uppdatera med Vercel-URL efter deploy)_
```

Ersätt med:

```
**Live:** https://[faktisk-url].vercel.app
```

Sedan:

```bash
git add README.md
git commit -m "README: lägg till live-URL"
git push
```

Vercel kommer auto-deploya den nya commiten inom ~30 sekunder.

---

## Steg 7 — Sammanfattning till användaren

När allt är klart, rapportera följande till användaren:

```
✓ Lokalt Git-repo initierat i [projektmapp]
✓ GitHub-repo skapat: https://github.com/[username]/sifferverket
✓ Live på Vercel: [PROD_URL]
✓ README uppdaterad med live-URL

Nästa steg som du själv kan göra:
- Öppna live-URL och klicka runt
- Skicka URL till någon
- Skapa nya sprintar genom att kopiera sprint-1/index.html som mall
- Varje gång du gör 'git push' uppdateras live-versionen automatiskt på 30 sekunder

Inställningar du *inte* behöver röra:
- Vercel-projektets default branch (redan main)
- Domännamn (vercel.app-URL räcker tills vidare)
```

---

## Felsökning

**Problem:** `gh repo create` säger "Name already exists"
**Lösning:** Be användaren välja ett annat namn, t.ex. `sifferverket-utbildning`. Uppdatera då även namnet i Vercel-steget.

**Problem:** Vercel deploya men sidan visar 404 på sprint-0/
**Lösning:** Kontrollera att `vercel.json` har `"cleanUrls": true`. Om inte — lägg till och deploya om.

**Problem:** Vercel klagar på "This Hobby plan is for personal use"
**Lösning:** Kontrollera att projektet ligger under användarens personliga scope, inte en team/organisation. Användaren kan flytta projektet via Vercel-dashboarden.

**Problem:** Fonterna laddas inte
**Lösning:** Det här är förväntat första sekunden — Google Fonts cachar. Fungerar normalt på andra sidladdningen. Inget att åtgärda.

---

## Att göra senare (manuellt, inte nu)

Dessa är inte med i den automatiska deployen. Användaren gör dem manuellt vid behov:

- **Egen domän:** Köp en .se-domän (ca 100 kr/år), peka den till Vercel via vercel.com-dashboarden
- **Analytics:** Vercel har gratis-analytics som kan slås på i dashboarden
- **Branch-skydd på GitHub:** Inte nödvändigt eftersom det är ett soloprojekt

---

*Slut på DEPLOY.md*
