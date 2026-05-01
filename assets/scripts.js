/* =============================================================
   SIFFERVERKET — DELAD KLIENTLOGIK
   Hanterar:
   - Anställd-namn (sparat i localStorage)
   - Bockrutor och progress-stapel
   - Kopiera-knappar i Claude-prompts
   - Datum-utskrift
   ============================================================= */

(function () {
  'use strict';

  // ==================== ANSTÄLLD-NAMN ====================
  function initEmployeeName() {
    const el = document.getElementById('employeeName');
    if (!el) return;

    const saved = localStorage.getItem('sv-employee-name');
    if (saved) {
      el.textContent = saved;
    } else {
      el.style.cursor = 'pointer';
      el.title = 'Klicka för att ange ditt namn';
      el.textContent = '[Klicka för att ange]';
    }

    el.addEventListener('click', () => {
      const current = localStorage.getItem('sv-employee-name') || '';
      const name = prompt('Ange ditt namn för anställningsbeviset:', current);
      if (name && name.trim()) {
        localStorage.setItem('sv-employee-name', name.trim());
        // uppdatera alla sidor som visar namnet
        document.querySelectorAll('[id="employeeName"], .employee-name')
          .forEach(n => n.textContent = name.trim());
      }
    });
  }

  // ==================== STARTDATUM ====================
  function initStartDate() {
    const el = document.getElementById('startDate');
    if (!el) return;

    let saved = localStorage.getItem('sv-start-date');
    if (!saved) {
      saved = new Date().toISOString();
      localStorage.setItem('sv-start-date', saved);
    }
    const d = new Date(saved);
    el.textContent = d.toLocaleDateString('sv-SE', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // ==================== PROGRESS / BOCKRUTOR ====================
  // Räknar TOTALT antal steg över hela sajten genom STEPS-konstanten.
  // Varje sprint anmäler sina steg-id:n via data-step på checkboxen.
  const ALL_STEPS = [
    // Sprint 0
    'github', 'supabase', 'vercel', 'claude',
    // Sprint 1
    'copy-code', 'save-file', 'github-upload', 'deploy',
    // Sprint 2
    'supabase-project', 'supabase-table', 'supabase-rows',
    // Sprint 3
    'fetch-credentials', 'fetch-create-policy', 'fetch-write-prompt', 'fetch-paste-code', 'fetch-deploy', 'fetch-verify',
    // Sprint 4
    'refine-add-status', 'refine-create-policy', 'refine-write-prompt', 'refine-paste-code', 'refine-deploy', 'refine-perform',
    // Sprint 5
    'library-browse-history', 'library-view-old-commit', 'library-break-something', 'library-revert',
    // Sprint 6
    'intake-create-policy', 'intake-build-page', 'intake-add-tabs', 'intake-download-delivery', 'intake-import-and-confirm'
  ];

  // ==================== SIFFERVERKETS EGEN SUPABASE ====================
  // För feedback-funktionen på /personalarenden/. Separat från elevens egna
  // Supabase i sprintarna. Anon-nyckeln är OK att ligga publikt här —
  // INSERT-only RLS skyddar tabellen, och SELECT-policy saknas medvetet
  // så att synpunkter bara kan läsas i Table Editor som projektägare.
  const SIFFERVERKET_SUPABASE_URL = 'https://pukeejqifhzfxvkdgork.supabase.co';
  const SIFFERVERKET_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1a2VlanFpZmh6Znh2a2Rnb3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDUyMzAsImV4cCI6MjA5MjcyMTIzMH0.O6KcveStsJ4PtvwiBrY6MgoaJdGIqPkiKhr39PJurOE';
  const SYNPUNKT_MIN_LENGTH = 10;

  function initProgressTracking() {
    // Ladda sparade tillstånd för bockrutor på den här sidan
    document.querySelectorAll('input[type="checkbox"][data-step]').forEach(cb => {
      const stored = localStorage.getItem('sv-step-' + cb.dataset.step);
      if (stored === 'true') cb.checked = true;
      cb.addEventListener('change', () => {
        localStorage.setItem('sv-step-' + cb.dataset.step, cb.checked);
        updateProgress();
      });
    });

    updateProgress();
  }

  function updateProgress() {
    const fill = document.getElementById('progressFill');
    if (!fill) return;
    const total = ALL_STEPS.length;
    const done = ALL_STEPS.filter(s =>
      localStorage.getItem('sv-step-' + s) === 'true'
    ).length;
    const percent = total > 0 ? (done / total) * 100 : 0;
    fill.style.width = percent + '%';
  }

  // ==================== KOPIERA-KNAPPAR I CLAUDE-PROMPTS ====================
  function initCopyButtons() {
    document.querySelectorAll('.claude-prompt').forEach(prompt => {
      // skapa knapp om den inte finns
      if (prompt.querySelector('.copy-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Kopiera';
      btn.type = 'button';

      btn.addEventListener('click', () => {
        // Plocka ut prompttexten utan knappen själv
        const clone = prompt.cloneNode(true);
        clone.querySelectorAll('.copy-btn').forEach(b => b.remove());
        const text = clone.textContent.trim();

        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Kopierat ✓';
            btn.classList.add('copied');
            setTimeout(() => {
              btn.textContent = 'Kopiera';
              btn.classList.remove('copied');
            }, 2000);
          });
        } else {
          // fallback för väldigt gamla webbläsare
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (e) {}
          ta.remove();
          btn.textContent = 'Kopierat ✓';
          setTimeout(() => { btn.textContent = 'Kopiera'; }, 2000);
        }
      });

      prompt.appendChild(btn);
    });
  }

  // ==================== SIFFERVERKET INFORMERAR ====================
  // Direktivlogg från Öferdirektören. Sanningskälla: DIREKTIV-arrayen.
  // Lägg nytt direktiv ÖVERST. Aldrig återanvänd ID.
  const DIREKTIV = [
    {
      id: '0007',
      date: '2026-05-01',
      text: '<em>Avdelningen för Personalärenden</em> har öppnats. Anställda kan nu inkomma med synpunkter och förslag som gör Sifferverket ännu bättre. Personliga uppgifter anonymiseras automatiskt efter <em>30 dagar</em>.'
    },
    {
      id: '0006',
      date: '2026-05-01',
      text: '<em>Avdelningen för Inkommande Siffror</em> har öppnats. Anställda kan nu ta emot sändningar via formaterad <em>CSV-fil</em>. Sifferverket fortsätter att växa under ordnade former.'
    },
    {
      id: '0005',
      date: '2026-05-01',
      text: 'Förtydliganden införda i tjänstgöringsprocedurerna ett, två, tre och fyra. Anställda som tidigare upplevt <em>tysta avslag</em> i Arkivet uppmanas att granska sina policyer enligt nya direktiv.'
    },
    {
      id: '0004',
      date: '2026-05-01',
      text: 'Biblioteket öppnar. Anställda tillråds att <em>vandra varsamt</em> i tidigare versioner. Det förflutna är inte ett museum, men det är inte heller ett laboratorium.'
    },
    {
      id: '0003',
      date: '2026-04-30',
      text: 'Kolumnen <em>status</em> har införts i Arkivet. Befintliga siffror har automatiskt klassificerats som <em>inkommande</em> i avvaktan på raffinering.'
    },
    {
      id: '0002',
      date: '2026-04-29',
      text: 'Säkerhetspolicy har införts på Arkivet. Anställd som ej kunnat hämta siffror i Sprint 3 ombedes uppdatera enligt nya direktiv.'
    },
    {
      id: '0001',
      date: '2026-04-28',
      text: 'Nyckelsystemet förtydligat. <em>Anon-nyckeln</em> öppnar huvudentréen. Generalnyckeln vilar i låst skåp och får aldrig vidröras av extern konsult.'
    }
  ];

  function initDirectives() {
    const band = document.getElementById('directiveBand');
    const current = document.getElementById('directiveCurrent');
    const unreadDot = document.getElementById('directiveUnread');
    const panel = document.getElementById('directivePanel');
    const list = document.getElementById('directiveList');
    const close = document.getElementById('directivePanelClose');
    const backdrop = document.getElementById('directiveBackdrop');

    if (!band || !panel) return; // sidan har inte direktiv-skelettet inkluderat

    // Senaste direktiv visas i bandet
    const latest = DIREKTIV[0];
    if (latest) {
      // Strippa <em>-taggar för bandet — de tillhör panelen
      const plain = latest.text.replace(/<\/?em>/g, '');
      current.textContent = plain;
    } else {
      current.textContent = 'Inga direktiv inkomna.';
    }

    // Olästa: jämför mot localStorage
    const lastSeen = localStorage.getItem('sv-directive-last-seen') || '';
    const unreadCount = DIREKTIV.filter(d => d.id > lastSeen).length;
    if (unreadCount > 0) {
      unreadDot.hidden = false;
      unreadDot.title = unreadCount + ' nytt direktiv';
    }

    // Render hela listan i panelen
    list.innerHTML = DIREKTIV.map(d => {
      const isUnread = d.id > lastSeen;
      return `
        <li class="${isUnread ? 'unread' : ''}">
          <div>
            <span class="directive-id">Direktiv ${d.id}</span>
            <span class="directive-date">${d.date}</span>
          </div>
          <div class="directive-text">${d.text}</div>
        </li>
      `;
    }).join('');

    function openPanel() {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      backdrop.hidden = false;
      requestAnimationFrame(() => backdrop.classList.add('visible'));
      document.body.style.overflow = 'hidden';

      if (DIREKTIV.length > 0) {
        localStorage.setItem('sv-directive-last-seen', DIREKTIV[0].id);
        unreadDot.hidden = true;
        setTimeout(() => {
          list.querySelectorAll('li.unread').forEach(li => li.classList.remove('unread'));
        }, 1200);
      }
    }

    function closePanel() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('visible');
      setTimeout(() => { backdrop.hidden = true; }, 400);
      document.body.style.overflow = '';
    }

    band.addEventListener('click', openPanel);
    band.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPanel();
      }
    });
    close.addEventListener('click', closePanel);
    backdrop.addEventListener('click', closePanel);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
    });
  }

  // ==================== AVDELNINGEN FÖR PERSONALÄRENDEN ====================
  // Feedback-formulär på /personalarenden/. Skickar INSERT till Sifferverkets
  // egen Supabase. Honeypot + min-längd-check ger lättviktigt spam-skydd.
  function initSynpunktForm() {
    const form = document.getElementById('synpunktForm');
    if (!form) return; // sidan har inget formulär

    const anonCheckbox = document.getElementById('anon');
    const nameFields = document.getElementById('nameFields');
    const submitBtn = document.getElementById('submitBtn');
    const successDiv = document.getElementById('success');
    const errorDiv = document.getElementById('error');
    const errorText = errorDiv.querySelector('p');
    const errorDefaultHTML = errorText.innerHTML;

    anonCheckbox.addEventListener('change', () => {
      if (anonCheckbox.checked) {
        nameFields.classList.add('disabled');
        document.getElementById('namn').value = '';
        document.getElementById('email').value = '';
      } else {
        nameFields.classList.remove('disabled');
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.hidden = true;
      errorText.innerHTML = errorDefaultHTML;

      const formData = new FormData(form);

      // Honeypot — bots fyller i fältet, människor ser det inte. Avbryt tyst
      // och visa success så boten inte får signal att försöka igen.
      if (formData.get('website')) {
        form.hidden = true;
        successDiv.hidden = false;
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      const text = (formData.get('text') || '').trim();
      if (text.length < SYNPUNKT_MIN_LENGTH) {
        errorText.innerHTML = '<strong>Synpunkten är för kort.</strong> Beskriv gärna i minst en mening så Sifferverket har något att arbeta med.';
        errorDiv.hidden = false;
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Synpunkten skickas...';

      const isAnon = anonCheckbox.checked;
      const payload = {
        art: formData.get('art'),
        sprint: formData.get('sprint') || null,
        text: text,
        namn: isAnon ? null : (formData.get('namn')?.trim() || null),
        email: isAnon ? null : (formData.get('email')?.trim() || null),
        user_agent: isAnon ? null : navigator.userAgent
      };

      try {
        // Anropa Supabase REST direkt — undviker att ladda klient-bibliotek
        // för en enda INSERT.
        const response = await fetch(
          `${SIFFERVERKET_SUPABASE_URL}/rest/v1/synpunkter`,
          {
            method: 'POST',
            headers: {
              'apikey': SIFFERVERKET_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SIFFERVERKET_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        form.hidden = true;
        successDiv.hidden = false;
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

      } catch (err) {
        console.error('Kunde inte spara synpunkt:', err);
        errorDiv.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Försök igen';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ==================== INIT ====================
  document.addEventListener('DOMContentLoaded', () => {
    initEmployeeName();
    initStartDate();
    initProgressTracking();
    initCopyButtons();
    initDirectives();
    initSynpunktForm();
  });

})();
