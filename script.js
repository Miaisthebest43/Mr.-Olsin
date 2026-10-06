/* ============================================================
   Fruit Scoop Poop — Command Caller
   - Randomly calls a command
   - Shows the command + a short reminder
   - Keeps a short history of recent calls
   - C key = quick call, Print button = full poster
   ============================================================ */

(function () {
  'use strict';

  // ----- Command data -----
  const COMMANDS = [
    { name: 'Fruit',            hint: 'Everyone to the Fruit side!' },
    { name: 'Scoop',            hint: 'Everyone to the Scoop side!' },
    { name: 'Poop',             hint: 'Everyone to the center!' },
    { name: 'Hit the Deck',     hint: 'Drop to the floor — last one down is out.' },
    { name: 'Captain’s Coming', hint: 'Stand still and salute until “At Ease.”' },
    { name: 'At Ease',          hint: 'Stop saluting. Other commands are unlocked.' },
    { name: '3 Men Rowing',     hint: 'Get in threes and row — anyone spare is out.' }
  ];

  // ----- Element references -----
  const screen   = document.getElementById('callerScreen');
  const textEl   = document.getElementById('callerText');
  const hintEl   = document.getElementById('callerHint');
  const historyEl = document.getElementById('history');

  const callButtons = [
    document.getElementById('callBtn'),
    document.getElementById('callBtnBig')
  ].filter(Boolean);

  const printBtn = document.getElementById('printBtn');

  // ----- State -----
  const recent = [];
  let locked = false;
  let lastIndex = -1;

  // ----- Helpers -----
  function pickCommand() {
    // Avoid repeating the exact same command twice in a row
    let index;
    do {
      index = Math.floor(Math.random() * COMMANDS.length);
    } while (COMMANDS.length > 1 && index === lastIndex);

    lastIndex = index;
    return COMMANDS[index];
  }

  function renderHistory() {
    if (!historyEl) return;
    historyEl.textContent = recent.length ? recent.join(' · ') : '—';
  }

  function setLocked(state) {
    locked = state;
    callButtons.forEach((btn) => {
      btn.disabled = state;
    });
  }

  function callCommand() {
    if (locked) return;

    const cmd = pickCommand();

    // Update the screen
    if (textEl) textEl.textContent = cmd.name;
    if (hintEl) hintEl.textContent = cmd.hint;

    // Re-trigger the pop animation
    if (screen) {
      screen.classList.remove('is-calling');
      void screen.offsetWidth;
      screen.classList.add('is-calling');
    }

    // Push to history (keep last 4)
    recent.unshift(cmd.name);
    if (recent.length > 4) recent.pop();
    renderHistory();

    // Short lockout so it can't be spammed instantly
    setLocked(true);
    setTimeout(() => setLocked(false), 450);
  }

  // ----- Wire up buttons -----
  callButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // The hero button also scrolls the caller panel into view
      if (btn.id === 'callBtn' && screen) {
        screen.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      callCommand();
    });
  });

  // ----- Print -----
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ----- Keyboard shortcuts -----
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    const isTyping =
      tag === 'input' || tag === 'textarea' || e.target.isContentEditable;

    if (isTyping) return;

    // C = call a command
    if (e.key === 'c' || e.key === 'C') {
      e.preventDefault();
      callCommand();
    }

    // P = print
    if (e.key === 'p' || e.key === 'P') {
      // Let the browser handle Ctrl/Cmd+P natively
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        window.print();
      }
    }
  });

  // ----- Initial state -----
  renderHistory();
  setLocked(false);
})();