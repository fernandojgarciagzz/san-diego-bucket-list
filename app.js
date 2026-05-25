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
      <span class="stamp">
        <span class="stamp-label">Quiénes</span>
        <span class="stamp-value">${TRIP.groupLabel}</span>
      </span>
      <span class="stamp">
        <span class="stamp-label">Fechas</span>
        <span class="stamp-value">${TRIP.dates}</span>
      </span>
      <span class="stamp">
        <span class="stamp-label">Base</span>
        <span class="stamp-value">Del Cerro</span>
      </span>
      <span class="stamp stamp-feature">
        <span class="stamp-flag">Evento principal</span>
        <span class="stamp-title">Half Marathon</span>
        <span class="stamp-meta">Domingo 31 Mayo · 6:15 AM</span>
      </span>
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
    const booking = item.bookingUrl
      ? `<a class="card-booking" href="${item.bookingUrl}" target="_blank" rel="noopener noreferrer">
           <span class="card-booking-label">Comprar boletos</span>
           <span class="card-booking-arrow" aria-hidden="true">→</span>
         </a>`
      : '';
    return `
      <article class="card ${section.cardClass} ${done ? 'done' : ''}" data-id="${item.id}">
        <span class="card-stamp" aria-hidden="true">✓ Hecho</span>
        <button class="card-check" data-action="toggle" type="button" aria-label="Marcar como hecho"></button>
        <div class="card-body">
          <h3 class="card-name">${item.name}${rec ? ' ' + rec : ''}</h3>
          <p class="card-desc">${item.desc}</p>
          ${tags ? `<div class="card-tags">${tags}</div>` : ''}
          ${booking}
        </div>
      </article>
    `;
  }

  function sectionHTML(section) {
    const count = section.items.length;
    const countLabel = section.id === 'race'
      ? `${count} evento${count === 1 ? '' : 's'}`
      : section.id === 'food'
      ? `${count} spots`
      : section.id === 'home'
      ? 'Del Cerro'
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
  let meMarker = null;
  let myPos = null;

  // ───────── Geo helpers ─────────
  function haversineKm(a, b) {
    const toRad = d => d * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(b[0] - a[0]);
    const dLng = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // Estimación cruda de tiempo en auto: depende de distancia (más lejos = más freeway)
  function estimateDriveMin(km) {
    let avgKmh;
    if (km < 3) avgKmh = 28;       // surface streets
    else if (km < 10) avgKmh = 42; // mixto
    else avgKmh = 65;              // mayormente freeway
    return Math.max(1, Math.round((km / avgKmh) * 60));
  }

  function formatDistance(km) {
    if (km < 1) return `${Math.round(km * 1000)} m · ~${estimateDriveMin(km)} min en auto`;
    return `${km.toFixed(1)} km · ~${estimateDriveMin(km)} min en auto`;
  }

  function buildMarkerIcon(color, done, emoji) {
    if (emoji) {
      return L.divIcon({
        className: '',
        html: `<div class="sd-marker sd-marker-emoji ${done ? 'done' : ''}" style="border-color:${color}">${emoji}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });
    }
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
          icon: buildMarkerIcon(section.markerColor, done, section.markerEmoji)
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

    addLocateControl();
  }

  // ───────── Locate me ─────────
  function addLocateControl() {
    const Locate = L.Control.extend({
      options: { position: 'topright' },
      onAdd() {
        const btn = L.DomUtil.create('button', 'locate-btn');
        btn.type = 'button';
        btn.innerHTML = '📍 Dónde estoy';
        btn.id = 'locateBtn';
        L.DomEvent.disableClickPropagation(btn);
        L.DomEvent.on(btn, 'click', toggleLocate);
        return btn;
      }
    });
    map.addControl(new Locate());
  }

  function toggleLocate() {
    const btn = document.getElementById('locateBtn');
    if (meMarker) {
      // Apagar
      map.removeLayer(meMarker);
      meMarker = null;
      myPos = null;
      btn.classList.remove('active');
      btn.innerHTML = '📍 Dónde estoy';
      document.querySelectorAll('.card-distance').forEach(el => el.remove());
      return;
    }
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }
    btn.classList.add('loading');
    btn.innerHTML = 'Localizando';
    navigator.geolocation.getCurrentPosition(
      pos => {
        btn.classList.remove('loading');
        btn.classList.add('active');
        btn.innerHTML = '📍 Ocultar mi ubicación';
        myPos = [pos.coords.latitude, pos.coords.longitude];
        meMarker = L.marker(myPos, {
          icon: L.divIcon({
            className: '',
            html: '<div class="me-marker"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          }),
          zIndexOffset: 10000
        }).addTo(map);
        meMarker.bindPopup('<strong>Tu ubicación</strong>');
        renderDistances();
        // Ajustar vista para incluir mi ubicación y los markers
        const bounds = L.latLngBounds([myPos, ...SECTIONS.flatMap(s => s.items.map(i => [i.lat, i.lng]))]);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      },
      err => {
        btn.classList.remove('loading');
        btn.innerHTML = '📍 Dónde estoy';
        const msg = err.code === 1
          ? 'Permiso denegado. Habilita la ubicación en los ajustes del navegador.'
          : err.code === 2
          ? 'No se pudo obtener tu ubicación (señal débil).'
          : 'Timeout al obtener la ubicación.';
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function renderDistances() {
    if (!myPos) return;
    SECTIONS.forEach(section => section.items.forEach(item => {
      const card = document.querySelector(`.card[data-id="${item.id}"]`);
      if (!card) return;
      const km = haversineKm(myPos, [item.lat, item.lng]);
      let el = card.querySelector('.card-distance');
      if (!el) {
        el = document.createElement('div');
        el.className = 'card-distance';
        card.querySelector('.card-body').appendChild(el);
      }
      el.textContent = formatDistance(km);
    }));
  }

  function setMarkerDone(id, done) {
    const m = markers[id];
    if (!m) return;
    m._done = done;
    const section = m._section;
    m.setIcon(buildMarkerIcon(section.markerColor, done, section.markerEmoji));
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
      // Dejar que los links externos (Comprar boletos, etc.) hagan lo suyo
      if (e.target.closest('a')) return;

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
