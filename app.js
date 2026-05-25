(function () {
  const STORAGE_KEY = 'sd-bucket-list-v1';

  // ───────── State persistence ─────────
  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  const state = loadState();

  // ───────── Header / progress ─────────
  function renderHeader() {
    const meta = document.querySelector('.header-meta');
    meta.innerHTML = `
      <span class="pill">${TRIP.people} personas</span>
      <span class="pill">${TRIP.dates}</span>
      <span class="pill">Airbnb</span>
      <span class="pill pill-race">🏃 Half Marathon · Dom 31 Mayo</span>
    `;
    document.querySelector('.eyebrow').textContent =
      `${TRIP.city} · Mayo–Junio ${TRIP.year}`;
  }

  // ───────── Cards ─────────
  function tagHTML(tag) {
    return `<span class="tag ${tag.class}">${tag.label}</span>`;
  }

  function cardHTML(item, section) {
    const done = !!state[item.id];
    const rec = item.recommended ? '<span class="tag tag-rec">⭐ Recomendado</span>' : '';
    const tags = (item.tags || []).map(tagHTML).join('');
    return `
      <div class="card ${section.cardClass} ${done ? 'done' : ''}" data-id="${item.id}">
        <div class="card-check" data-action="toggle"></div>
        <div class="card-body">
          <div class="card-name">${item.name}${rec ? ' ' + rec : ''}</div>
          <div class="card-desc">${item.desc}</div>
          ${tags ? `<div class="card-tags">${tags}</div>` : ''}
        </div>
      </div>
    `;
  }

  function sectionHTML(section) {
    const count = section.items.length;
    const countLabel = section.id === 'race'
      ? `${count} evento${count === 1 ? '' : 's'}`
      : section.id === 'food'
      ? `${count} spots`
      : `${count} lugares`;
    return `
      <div class="section" data-section="${section.id}">
        <div class="section-header">
          <div class="section-icon ${section.iconClass}">${section.icon}</div>
          <div class="section-title">${section.title}</div>
          <span class="section-count">${countLabel}</span>
        </div>
        <div class="cards">
          ${section.items.map(it => cardHTML(it, section)).join('')}
        </div>
      </div>
    `;
  }

  function renderSections() {
    const host = document.getElementById('sections');
    host.innerHTML = SECTIONS.map(sectionHTML).join('');
  }

  // ───────── Map ─────────
  let map, markers = {};
  let activeId = null;

  function buildMarkerIcon(color, done) {
    return L.divIcon({
      className: '',
      html: `<div class="sd-marker ${done ? 'done' : ''}" style="background:${color}"></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -24]
    });
  }

  function popupHTML(item, section) {
    return `
      <div class="popup-cat">${section.title}</div>
      <strong>${item.name}</strong>
      ${item.desc.length > 140 ? item.desc.slice(0, 140) + '…' : item.desc}
    `;
  }

  function initMap() {
    map = L.map('map', {
      center: TRIP.center,
      zoom: TRIP.initialZoom,
      zoomControl: true,
      scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    SECTIONS.forEach(section => {
      section.items.forEach(item => {
        const done = !!state[item.id];
        const marker = L.marker([item.lat, item.lng], {
          icon: buildMarkerIcon(section.markerColor, done)
        }).addTo(map);

        marker.bindPopup(popupHTML(item, section), { offset: [0, -8] });
        marker._section = section;
        marker._done = done;

        marker.on('click', () => {
          activateItem(item.id, { fromMap: true });
        });

        markers[item.id] = marker;
      });
    });
  }

  function setMarkerDone(id, done) {
    const m = markers[id];
    if (!m) return;
    m._done = done;
    const section = m._section;
    m.setIcon(buildMarkerIcon(section.markerColor, done));
    if (id === activeId) {
      // re-apply active styling
      setTimeout(() => setActiveMarker(id), 0);
    }
  }

  function setActiveMarker(id) {
    Object.entries(markers).forEach(([mid, m]) => {
      const el = m.getElement();
      if (!el) return;
      const div = el.querySelector('.sd-marker');
      if (!div) return;
      if (mid === id) div.classList.add('active');
      else div.classList.remove('active');
    });
  }

  function activateItem(id, opts = {}) {
    activeId = id;
    let target = null;
    let targetSection = null;
    SECTIONS.forEach(s => s.items.forEach(it => {
      if (it.id === id) { target = it; targetSection = s; }
    }));
    if (!target) return;

    // Map: fly + open popup
    map.flyTo([target.lat, target.lng], target.zoom || 15, { duration: 1.0 });
    const m = markers[id];
    if (m) {
      setTimeout(() => m.openPopup(), 600);
    }
    setActiveMarker(id);

    // Cards: highlight
    document.querySelectorAll('.card').forEach(c => c.classList.toggle('active', c.dataset.id === id));

    // Scroll the card into view (only when click came from map)
    if (opts.fromMap) {
      const card = document.querySelector(`.card[data-id="${id}"]`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // ───────── Toggle done ─────────
  function toggleDone(id) {
    const done = !state[id];
    if (done) state[id] = true;
    else delete state[id];
    saveState(state);

    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (card) card.classList.toggle('done', done);
    setMarkerDone(id, done);
    updateProgress();
  }

  function updateProgress() {
    const all = SECTIONS.flatMap(s => s.items);
    const total = all.length;
    const done = all.filter(it => state[it.id]).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressCount').textContent = `${done} / ${total} completados`;
  }

  function resetAll() {
    if (!confirm('¿Borrar todo el progreso de la lista?')) return;
    Object.keys(state).forEach(k => delete state[k]);
    saveState(state);
    document.querySelectorAll('.card.done').forEach(c => c.classList.remove('done'));
    Object.keys(markers).forEach(id => setMarkerDone(id, false));
    updateProgress();
  }

  // ───────── Event delegation ─────────
  function bindEvents() {
    document.getElementById('sections').addEventListener('click', (e) => {
      const check = e.target.closest('[data-action="toggle"]');
      if (check) {
        e.stopPropagation();
        const card = check.closest('.card');
        if (card) toggleDone(card.dataset.id);
        return;
      }
      const card = e.target.closest('.card');
      if (card) activateItem(card.dataset.id);
    });

    document.getElementById('resetBtn').addEventListener('click', resetAll);
  }

  // ───────── Boot ─────────
  function boot() {
    renderHeader();
    renderSections();
    initMap();
    updateProgress();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
