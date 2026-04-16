// ============================================================
//  PITCH — SPA JavaScript
// ============================================================

// ─── DONNÉES ─────────────────────────────────────────────────
const ATHLETES = [
  {
    id: 1, name: "MARTIN", firstName: "Léa", position: "MF",
    status: "rouge", score: 79, acwr: 1.68,
    vmax: 26.2, accel: 28, decel: 32, wellness: 2.1,
    sessions: generateSessions(1.68, 26.2)
  },
  {
    id: 2, name: "THOMAS", firstName: "Romain", position: "AT",
    status: "orange", score: 52, acwr: 1.42,
    vmax: 27.8, accel: 22, decel: 24, wellness: 3.4,
    sessions: generateSessions(1.42, 27.8)
  },
  {
    id: 3, name: "ROUSSEAU", firstName: "Camille", position: "DF",
    status: "orange", score: 48, acwr: 1.38,
    vmax: 24.5, accel: 19, decel: 21, wellness: 3.8,
    sessions: generateSessions(1.38, 24.5)
  },
  {
    id: 4, name: "DUPONT", firstName: "Lucas", position: "MF",
    status: "vert", score: 12, acwr: 1.05,
    vmax: 29.1, accel: 15, decel: 17, wellness: 4.2,
    sessions: generateSessions(1.05, 29.1)
  },
  {
    id: 5, name: "PETIT", firstName: "Clara", position: "AT",
    status: "vert", score: 8, acwr: 0.98,
    vmax: 27.4, accel: 18, decel: 20, wellness: 4.6,
    sessions: generateSessions(0.98, 27.4)
  },
  {
    id: 6, name: "BERNARD", firstName: "Antoine", position: "DF",
    status: "vert", score: 15, acwr: 1.10,
    vmax: 25.8, accel: 14, decel: 16, wellness: 3.9,
    sessions: generateSessions(1.10, 25.8)
  },
  {
    id: 7, name: "GARCIA", firstName: "Nina", position: "GK",
    status: "vert", score: 9, acwr: 0.92,
    vmax: 22.3, accel: 11, decel: 13, wellness: 4.5,
    sessions: generateSessions(0.92, 22.3)
  },
  {
    id: 8, name: "MOREAU", firstName: "Inès", position: "MF",
    status: "vert", score: 18, acwr: 1.15,
    vmax: 26.7, accel: 17, decel: 19, wellness: 4.1,
    sessions: generateSessions(1.15, 26.7)
  },
  {
    id: 9, name: "SIMON", firstName: "Manon", position: "AT",
    status: "vert", score: 11, acwr: 1.02,
    vmax: 28.9, accel: 20, decel: 22, wellness: 4.3,
    sessions: generateSessions(1.02, 28.9)
  },
  {
    id: 10, name: "LEBLANC", firstName: "Anaïs", position: "DF",
    status: "vert", score: 7, acwr: 0.88,
    vmax: 24.1, accel: 13, decel: 15, wellness: 4.7,
    sessions: generateSessions(0.88, 24.1)
  },
  {
    id: 11, name: "MICHEL", firstName: "Julie", position: "MF",
    status: "vert", score: 14, acwr: 1.08,
    vmax: 27.2, accel: 16, decel: 18, wellness: 4.0,
    sessions: generateSessions(1.08, 27.2)
  },
];

const STAFF = [
  { initials: "HC", name: "Hugo Chabod", role: "Chef de projet" },
  { initials: "VR", name: "Valentin Raclot", role: "Médecin" },
  { initials: "SC", name: "Sylvain Carric", role: "Entraîneur" },
];

const IMPORT_HISTORY = [
  { name: "session_2026-04-10.csv", date: "10 avr. 2026", count: "11 athlètes · 1 séance" },
  { name: "session_2026-04-08.csv", date: "8 avr. 2026",  count: "11 athlètes · 1 séance" },
  { name: "session_2026-04-05.csv", date: "5 avr. 2026",  count: "11 athlètes · 1 séance" },
];

// ─── GÉNÉRATION DE DONNÉES FACTICES ──────────────────────────
function generateSessions(acwr, vmax) {
  const sessions = [];
  const now = new Date(2026, 3, 13);
  for (let i = 14; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 2);
    const factor = i < 3 ? acwr : (0.9 + Math.random() * 0.2);
    sessions.push({
      date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      type: i % 7 === 0 ? 'match' : 'training',
      distance: Math.round(5800 * factor + (Math.random() - 0.5) * 600),
      vmax: +(vmax * (0.95 + Math.random() * 0.1)).toFixed(1),
      accel: Math.round(15 + Math.random() * 15),
      decel: Math.round(12 + Math.random() * 18),
      acwr: +(factor * 0.95 + Math.random() * 0.1).toFixed(2),
    });
  }
  return sessions;
}

// ─── ÉTAT ────────────────────────────────────────────────────
let currentPage = 'overview';
let currentAthlete = null;
let athleteChart = null;
let currentChartType = 'acwr';
let currentFilter = 'all';
let wellnessScores = { sleep: 0, freshness: 0, mood: 0, energy: 0 };

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateDate();
  renderAthletes();
  renderImportHistory();
  renderWellnessAthletes();
  renderSettings();
});

function updateDate() {
  const el = document.getElementById('topbar-date');
  if (el) {
    el.textContent = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  }
}

// ─── LOGIN ────────────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Connexion…';
  btn.disabled = true;

  setTimeout(() => {
    document.getElementById('screen-login').style.display = 'none';
    document.getElementById('screen-app').style.display = 'flex';
  }, 700);
}

// ─── NAVIGATION ───────────────────────────────────────────────
function navigate(page, el) {
  // Nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  // Pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');

  // Topbar
  const titles = {
    overview: ['Vue d\'ensemble', 'DFCO Féminin · Saison 2026'],
    athlete:  ['Fiche athlète',   'DFCO Féminin · Saison 2026'],
    import:   ['Import GPS',      'Importer une nouvelle séance'],
    wellness: ['État de forme',   'Questionnaire du jour'],
    settings: ['Paramètres',      'Configuration du club'],
  };
  if (titles[page]) {
    document.getElementById('topbar-title').textContent = titles[page][0];
    document.getElementById('topbar-sub').textContent   = titles[page][1];
  }

  currentPage = page;
}

// ─── ATHLETES ─────────────────────────────────────────────────
function renderAthletes(filter = 'all') {
  const list = document.getElementById('athletes-list');
  if (!list) return;

  const filtered = filter === 'all'
    ? ATHLETES
    : ATHLETES.filter(a => a.status === filter);

  list.innerHTML = filtered.map(a => `
    <div class="athlete-row ${a.status}" onclick="openAthlete(${a.id})">
      <div class="athlete-row-dot"></div>
      <div class="athlete-row-name">${a.name} <span style="font-weight:500;opacity:.7">${a.firstName}</span></div>
      <div class="athlete-row-pos">${a.position}</div>
      <div class="athlete-row-metrics">
        <div class="athlete-row-metric">
          <div class="athlete-row-metric-val" style="color:${statusColor(a.status)}">${a.acwr}</div>
          <div class="athlete-row-metric-label">ACWR</div>
        </div>
        <div class="athlete-row-metric">
          <div class="athlete-row-metric-val">${a.vmax} <span style="font-size:11px;opacity:.6">km/h</span></div>
          <div class="athlete-row-metric-label">Vmax</div>
        </div>
        <div class="athlete-row-metric">
          <div class="athlete-row-metric-val">${a.score}<span style="font-size:11px;opacity:.6">/100</span></div>
          <div class="athlete-row-metric-label">Score</div>
        </div>
        <span class="badge badge-${a.status}">
          <span class="badge-dot"></span>
          ${statusLabel(a.status)}
        </span>
      </div>
      <svg class="athlete-row-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  `).join('');
}

function filterAthletes(filter, el) {
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderAthletes(filter);
}

function openAthlete(id) {
  currentAthlete = ATHLETES.find(a => a.id === id);
  if (!currentAthlete) return;

  renderAthleteHeader();
  renderAthleteMetrics();
  renderAthleteChart();
  renderAthleteSessions();

  navigate('athlete', null);
}

function renderAthleteHeader() {
  const a = currentAthlete;
  const initials = `${a.firstName[0]}${a.name[0]}`;
  document.getElementById('athlete-header').innerHTML = `
    <div class="athlete-profile-header">
      <div class="athlete-avatar-big">${initials}</div>
      <div class="athlete-profile-info">
        <div class="athlete-profile-name">${a.name} ${a.firstName}</div>
        <div class="athlete-profile-meta">
          <span class="athlete-profile-pos">${a.position}</span>
          <span class="badge badge-${a.status}">
            <span class="badge-dot"></span>
            ${statusLabel(a.status)}
          </span>
        </div>
      </div>
      <div class="athlete-acwr-big">
        <div class="athlete-acwr-val" style="color:${statusColor(a.status)}">${a.acwr}</div>
        <div class="athlete-acwr-label">ACWR</div>
      </div>
    </div>
  `;
}

function renderAthleteMetrics() {
  const a = currentAthlete;
  document.getElementById('athlete-metrics').innerHTML = `
    <div class="metric-card">
      <div class="metric-label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Distance ACWR
      </div>
      <div class="metric-value ${a.status}">${a.acwr}</div>
      <div class="metric-sub">Ratio charge aiguë / chronique</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Vmax
      </div>
      <div class="metric-value neutral">${a.vmax} <span style="font-size:18px">km/h</span></div>
      <div class="metric-sub">Vitesse maximale dernière séance</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Accél / Décél
      </div>
      <div class="metric-value neutral">${a.accel} <span style="font-size:18px;opacity:.5">/</span> <span style="font-size:28px">${a.decel}</span></div>
      <div class="metric-sub">Efforts explosifs dernière séance</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        État de forme
      </div>
      <div class="metric-value ${a.wellness >= 3.5 ? 'vert' : a.wellness >= 2.5 ? 'orange' : 'rouge'}">${a.wellness}<span style="font-size:18px">/5</span></div>
      <div class="metric-sub">Score moyen des 3 derniers jours</div>
    </div>
  `;
}

function renderAthleteChart() {
  if (athleteChart) { athleteChart.destroy(); athleteChart = null; }

  const a = currentAthlete;
  const ctx = document.getElementById('athlete-chart').getContext('2d');
  const labels = a.sessions.map(s => s.date);

  let data, label, color, zones;

  if (currentChartType === 'acwr') {
    data   = a.sessions.map(s => s.acwr);
    label  = 'ACWR';
    color  = statusColor(a.status);
    zones  = true;
  } else if (currentChartType === 'distance') {
    data   = a.sessions.map(s => s.distance);
    label  = 'Distance (m)';
    color  = '#3b82f6';
    zones  = false;
  } else if (currentChartType === 'vmax') {
    data   = a.sessions.map(s => s.vmax);
    label  = 'Vmax (km/h)';
    color  = '#f59e0b';
    zones  = false;
  } else {
    data   = a.sessions.map(s => s.accel);
    label  = 'Accélérations';
    color  = '#10b981';
    zones  = false;
  }

  const annotations = zones ? {
    zone_green: {
      type: 'box',
      yMin: 0.8, yMax: 1.3,
      backgroundColor: 'rgba(16,185,129,0.05)',
      borderColor: 'rgba(16,185,129,0.15)',
      borderWidth: 1,
    },
    zone_orange: {
      type: 'box',
      yMin: 1.3, yMax: 1.5,
      backgroundColor: 'rgba(245,158,11,0.05)',
      borderColor: 'rgba(245,158,11,0.15)',
      borderWidth: 1,
    },
    zone_red: {
      type: 'box',
      yMin: 1.5, yMax: 3,
      backgroundColor: 'rgba(198,25,39,0.05)',
      borderColor: 'rgba(198,25,39,0.15)',
      borderWidth: 1,
    },
  } : {};

  athleteChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: color,
        backgroundColor: color + '18',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: '#08080b',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#17171e',
          borderColor: '#1e1e28',
          borderWidth: 1,
          titleColor: '#f0f0f6',
          bodyColor: '#7878a0',
          padding: 10,
        },
      },
      scales: {
        x: {
          grid: { color: '#1e1e28', drawBorder: false },
          ticks: { color: '#7878a0', font: { family: 'Barlow Condensed', size: 11 } },
        },
        y: {
          grid: { color: '#1e1e28', drawBorder: false },
          ticks: { color: '#7878a0', font: { family: 'Barlow Condensed', size: 11 } },
        },
      },
    }
  });
}

function switchChart(type, el) {
  document.querySelectorAll('#athlete-chart-tabs .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentChartType = type;
  renderAthleteChart();
}

function renderAthleteSessions() {
  const a = currentAthlete;
  const recent = [...a.sessions].reverse().slice(0, 6);
  document.getElementById('athlete-sessions').innerHTML = recent.map(s => `
    <div class="session-row">
      <div class="session-date">${s.date}</div>
      <div class="session-type ${s.type}">${s.type === 'match' ? 'Match' : 'Entraînement'}</div>
      <div class="session-metrics">
        <div class="session-metric">
          <div class="session-metric-val">${(s.distance / 1000).toFixed(1)} km</div>
          <div class="session-metric-key">Distance</div>
        </div>
        <div class="session-metric">
          <div class="session-metric-val">${s.vmax} km/h</div>
          <div class="session-metric-key">Vmax</div>
        </div>
        <div class="session-metric">
          <div class="session-metric-val">${s.accel} / ${s.decel}</div>
          <div class="session-metric-key">Acc / Déc</div>
        </div>
        <div class="session-metric">
          <div class="session-metric-val" style="color:${acwrColor(s.acwr)}">${s.acwr}</div>
          <div class="session-metric-key">ACWR</div>
        </div>
      </div>
    </div>
  `).join('');
}


// ─── IMPORT ───────────────────────────────────────────────────
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('import-dropzone').classList.add('drag-over');
}

function handleDragLeave(e) {
  document.getElementById('import-dropzone').classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('import-dropzone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) showImportPreview(file);
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) showImportPreview(file);
}

function showImportPreview(file) {
  const size = (file.size / 1024).toFixed(1) + ' KB';

  document.getElementById('import-file-info').innerHTML = `
    <div class="import-file-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <div>
      <div class="import-file-name">${file.name}</div>
      <div class="import-file-size">${size} · Prêt à importer</div>
    </div>
  `;

  const mappings = [
    ['Total Distance (m)', 'Distance totale'],
    ['Maximum Velocity (km/h)', 'Vmax'],
    ['Total Acceleration B1-B2', 'Accélérations'],
    ['Total Deceleration B1-B2', 'Décélérations'],
    ['Name', 'Nom de l\'athlète'],
    ['date', 'Date de séance'],
  ];

  document.getElementById('mapping-grid').innerHTML = mappings.map(([from, to]) => `
    <div class="mapping-row">
      <span class="mapping-from">${from}</span>
      <svg class="mapping-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      <span class="mapping-to">${to}</span>
    </div>
  `).join('');

  document.getElementById('import-dropzone').style.display = 'none';
  document.getElementById('import-preview').style.display = 'block';
}

function resetImport() {
  document.getElementById('import-dropzone').style.display = 'block';
  document.getElementById('import-preview').style.display = 'none';
}

function confirmImport() {
  const btn = document.querySelector('#import-preview .btn-primary');
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    Import réussi
  `;
  btn.style.background = '#10b981';
  btn.disabled = true;
  setTimeout(resetImport, 2000);
}

function renderImportHistory() {
  const el = document.getElementById('import-history');
  if (!el) return;
  el.innerHTML = IMPORT_HISTORY.map(h => `
    <div class="import-history-row">
      <div class="import-history-dot"></div>
      <div class="import-history-name">${h.name}</div>
      <div class="import-history-meta">${h.count} · ${h.date}</div>
    </div>
  `).join('');
}


// ─── WELLNESS ─────────────────────────────────────────────────
function renderWellnessAthletes() {
  const sel = document.getElementById('wellness-athlete');
  if (!sel) return;
  ATHLETES.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = `${a.name} ${a.firstName}`;
    sel.appendChild(opt);
  });
}

function loadWellness() {
  const val = document.getElementById('wellness-athlete').value;
  if (!val) {
    document.getElementById('wellness-form').style.display = 'none';
    return;
  }

  wellnessScores = { sleep: 0, freshness: 0, mood: 0, energy: 0 };

  const questions = [
    { key: 'sleep',     label: 'Sommeil',       icon: '💤', bg: 'rgba(59,130,246,0.12)',    color: '#3b82f6' },
    { key: 'freshness', label: 'Fraîcheur',      icon: '⚡', bg: 'rgba(16,185,129,0.12)',   color: '#10b981' },
    { key: 'mood',      label: 'Humeur',         icon: '😊', bg: 'rgba(245,158,11,0.12)',   color: '#f59e0b' },
    { key: 'energy',    label: 'Énergie',        icon: '🔥', bg: 'rgba(198,25,39,0.12)',    color: '#c61927' },
  ];

  document.getElementById('wellness-questions').innerHTML = questions.map(q => `
    <div class="wellness-question">
      <div class="wellness-question-label">
        <div class="wellness-question-icon" style="background:${q.bg}; color:${q.color}">${q.icon}</div>
        ${q.label}
      </div>
      <div class="wellness-stars">
        ${[1,2,3,4,5].map(n => `
          <div class="wellness-star" data-key="${q.key}" data-val="${n}" onclick="selectStar('${q.key}', ${n}, this)">
            ${n}
          </div>
        `).join('')}
      </div>
      <div class="wellness-star-labels">
        <span>Très mauvais</span>
        <span>Excellent</span>
      </div>
    </div>
  `).join('');

  document.getElementById('wellness-form').style.display = 'block';
  document.getElementById('wellness-confirm').style.display = 'none';
}

function selectStar(key, val, el) {
  wellnessScores[key] = val;
  document.querySelectorAll(`.wellness-star[data-key="${key}"]`).forEach(s => {
    s.classList.toggle('selected', parseInt(s.dataset.val) <= val);
  });
}

function submitWellness() {
  document.getElementById('wellness-form').style.display = 'none';
  document.getElementById('wellness-confirm').style.display = 'block';
}

function resetWellness() {
  document.getElementById('wellness-athlete').value = '';
  document.getElementById('wellness-form').style.display = 'none';
  document.getElementById('wellness-confirm').style.display = 'none';
}


// ─── SETTINGS ─────────────────────────────────────────────────
function renderSettings() {
  // Staff
  const staffEl = document.getElementById('staff-list');
  if (staffEl) {
    staffEl.innerHTML = STAFF.map(s => `
      <div class="staff-row">
        <div class="staff-avatar">${s.initials}</div>
        <div class="staff-name">${s.name}</div>
        <div class="staff-role">${s.role}</div>
      </div>
    `).join('');
  }

  // Athletes in settings
  const settingsAth = document.getElementById('settings-athletes');
  if (settingsAth) {
    settingsAth.innerHTML = ATHLETES.map(a => `
      <div class="settings-athlete-row">
        <div style="flex:1; font-family:var(--font-label); font-size:13px; font-weight:700">
          ${a.name} ${a.firstName}
        </div>
        <div style="font-size:12px; color:var(--text-sub); margin-right: var(--s4)">${a.position}</div>
        <span class="badge badge-${a.status}">
          <span class="badge-dot"></span>
          ${statusLabel(a.status)}
        </span>
      </div>
    `).join('');
  }
}


// ─── HELPERS ──────────────────────────────────────────────────
function statusColor(s) {
  return s === 'rouge' ? '#e8384a' : s === 'orange' ? '#f59e0b' : '#10b981';
}

function statusLabel(s) {
  return s === 'rouge' ? 'Surcharge' : s === 'orange' ? 'Vigilance' : 'Optimal';
}

function acwrColor(v) {
  return v > 1.5 ? '#e8384a' : v > 1.3 ? '#f59e0b' : '#10b981';
}
