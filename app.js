// === Section Navigation ===
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('sectionNav');
  const sections = document.querySelectorAll('.exercise-section');
  const navBtns = nav.querySelectorAll('.nav-btn:not(.back-btn)');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.section;
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(target).classList.add('active');
      if (window.MathJax) {
        MathJax.typesetPromise([document.getElementById(target)]);
      }
      document.getElementById(target).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // === Solution Toggle ===
  document.querySelectorAll('.toggle-solution').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const solution = document.getElementById(targetId);
      if (solution) {
        solution.classList.toggle('show');
        btn.classList.toggle('open');
        if (solution.classList.contains('show') && window.MathJax) {
          MathJax.typesetPromise([solution]);
        }
      }
    });
  });

  // === Show All / Hide All ===
  document.getElementById('showAllBtn').addEventListener('click', () => {
    document.querySelectorAll('.solution').forEach(s => s.classList.add('show'));
    document.querySelectorAll('.toggle-solution').forEach(b => b.classList.add('open'));
    if (window.MathJax) MathJax.typesetPromise();
  });

  document.getElementById('hideAllBtn').addEventListener('click', () => {
    document.querySelectorAll('.solution').forEach(s => s.classList.remove('show'));
    document.querySelectorAll('.toggle-solution').forEach(b => b.classList.remove('open'));
  });

  // === Print ===
  document.getElementById('printBtn').addEventListener('click', () => {
    document.querySelectorAll('.solution').forEach(s => s.classList.add('show'));
    if (window.MathJax) {
      MathJax.typesetPromise().then(() => window.print());
    } else {
      window.print();
    }
  });

  // === Countdown Timer (detect exam version from title) ===
  const timerEl = document.getElementById('timer');
  // V2 = 3h, V5 & others = 2h (default to 3h)
  const pageTitle = document.title;
  const hours = pageTitle.includes('V2') ? 3 : (pageTitle.includes('V5') ? 2 : 3);
  let totalSeconds = hours * 3600;
  let timerInterval = null;
  let timerRunning = false;

  function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateTimer() {
    timerEl.textContent = formatTime(totalSeconds);
    timerEl.classList.remove('warning', 'danger');
    if (totalSeconds <= 600) timerEl.classList.add('danger');
    else if (totalSeconds <= 1800) timerEl.classList.add('warning');
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerInterval = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        timerEl.textContent = 'TERMINÉ';
        timerEl.classList.add('danger');
        return;
      }
      totalSeconds--;
      updateTimer();
    }, 1000);
  }

  timerEl.addEventListener('click', () => {
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
    } else {
      startTimer();
    }
  });

  timerEl.title = `Cliquer pour démarrer/mettre en pause le chronomètre (${hours}h)`;
  updateTimer();

  // === Keyboard shortcuts ===
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    const shortcuts = { '1': 'ex1', '2': 'ex2', '3': 'ex3', '4': 'ex4', '5': 'pb' };
    if (shortcuts[key] && !e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement === document.body) {
      const targetBtn = nav.querySelector(`[data-section="${shortcuts[key]}"]`);
      if (targetBtn) targetBtn.click();
    }
    if (key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement === document.body) {
      if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
      } else {
        startTimer();
      }
    }
  });
});
