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
    'copy-code', 'save-file', 'github-upload', 'deploy'
  ];

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

  // ==================== INIT ====================
  document.addEventListener('DOMContentLoaded', () => {
    initEmployeeName();
    initStartDate();
    initProgressTracking();
    initCopyButtons();
  });

})();
