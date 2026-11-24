/* ============================================================
   DKV TOOLS — js/script.js
   ============================================================ */

/* ============ DATA ALAT ============ */
const ALAT = [
  { id: 1,  nama: 'Kamera Canon EOS R50',     kategori: 'kamera', ikon: '📷', status: 'tersedia', lokasi: 'Lab DKV 1', gambar: 'img/poto1.png' },
  { id: 2,  nama: 'Kamera Sony A7 III',       kategori: 'kamera', ikon: '📷', status: 'dipinjam', lokasi: 'Lab DKV 1', gambar: 'img/poto2.jpg' },
  { id: 3,  nama: 'Kamera Fujifilm X-T30',    kategori: 'kamera', ikon: '📷', status: 'tersedia', lokasi: 'Lab DKV 2', gambar: 'img/poto3.jpg' },
  { id: 4,  nama: 'Kamera Nikon Z6',          kategori: 'kamera', ikon: '📷', status: 'dipinjam', lokasi: 'Lab DKV 1', gambar: 'img/poto4.png' },
  { id: 5,  nama: 'Kamera Panasonic Lumix',   kategori: 'kamera', ikon: '📷', status: 'tersedia', lokasi: 'Lab DKV 2', gambar: 'img/poto5.png' },
  { id: 6,  nama: 'Kamera Canon 90D',         kategori: 'kamera', ikon: '📷', status: 'tersedia', lokasi: 'Lab DKV 2', gambar: 'img/poto6.jpg' },
  { id: 7,  nama: 'Tripod Manfrotto',         kategori: 'tripod', ikon: '🦵', status: 'tersedia', lokasi: 'Gudang',   gambar: 'img/poto7.png' },
  { id: 8,  nama: 'Tripod Gitzo Carbon',      kategori: 'tripod', ikon: '🦵', status: 'rusak',    lokasi: 'Gudang',   gambar: 'img/poto8.jpg' },
  { id: 9,  nama: 'Tripod Benro Travel',      kategori: 'tripod', ikon: '🦵', status: 'tersedia', lokasi: 'Gudang',   gambar: 'img/poto9.png' },
  { id: 10, nama: 'Tripod Vanguard VEO',      kategori: 'tripod', ikon: '🦵', status: 'tersedia', lokasi: 'Gudang',   gambar: 'img/poto10.jpg' },
  { id: 11, nama: 'Kamera GoPro Hero 11',     kategori: 'kamera', ikon: '📷', status: 'tersedia', lokasi: 'Lab DKV 1', gambar: 'img/poto11.jpg' },
  { id: 12, nama: 'Tripod Joby GorillaPod',   kategori: 'tripod', ikon: '🦵', status: 'dipinjam', lokasi: 'Gudang',   gambar: 'img/poto12.jpg' }, 
];

/* ============ STORAGE ============ */
const getBookings = () => JSON.parse(localStorage.getItem('dkv_bookings') || '[]');
const saveBookings = (b) => localStorage.setItem('dkv_bookings', JSON.stringify(b));
const getRiwayat  = () => JSON.parse(localStorage.getItem('dkv_riwayat')  || '[]');
const saveRiwayat = (r) => localStorage.setItem('dkv_riwayat', JSON.stringify(r));
const getLaporan  = () => JSON.parse(localStorage.getItem('dkv_laporan')  || '[]');
const saveLaporan = (l) => localStorage.setItem('dkv_laporan', JSON.stringify(l));

function seedData() {
  if (!localStorage.getItem('dkv_bookings')) {
    saveBookings([
      { id: 'BK001', alat: 'Kamera Sony A7 III', peminjam: 'Rani', tgl: '2025-06-10', status: 'disetujui' },
      { id: 'BK002', alat: 'Kamera Nikon Z6',    peminjam: 'Budi', tgl: '2025-06-11', status: 'pending' },
    ]);
  }
  if (!localStorage.getItem('dkv_riwayat')) {
    saveRiwayat([
      { id: 'BK000', alat: 'Tripod Manfrotto', peminjam: 'Sari', tgl: '2025-05-28', status: 'selesai' },
    ]);
  }
}

/* ============ HELPERS ============ */
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

function badgeStatus(s) {
  const map = {
    tersedia: 'tersedia', dipinjam: 'dipinjam', rusak: 'rusak',
    pending: 'pending', disetujui: 'dipinjam', selesai: 'selesai', ditolak: 'rusak'
  };
  const cls = map[s] || 'pending';
  const label = s.charAt(0).toUpperCase() + s.slice(1);
  return `<span class="badge ${cls}">${label}</span>`;
}

/* ============ INDEX ============ */
function initIndex() {
  const el = document.getElementById('stats');
  if (!el) return;
  const total    = ALAT.length;
  const tersedia = ALAT.filter(a => a.status === 'tersedia').length;
  const dipinjam = ALAT.filter(a => a.status === 'dipinjam').length;
  const rusak    = ALAT.filter(a => a.status === 'rusak').length;

  el.innerHTML = `
    <div class="card stat-card c-total">
      <div class="stat-ico">🎬</div>
      <div class="stat-label">Total Alat</div>
      <div class="stat-value">${total}</div>
    </div>
    <div class="card stat-card c-avail">
      <div class="stat-ico">✅</div>
      <div class="stat-label">Tersedia</div>
      <div class="stat-value">${tersedia}</div>
    </div>
    <div class="card stat-card c-loan">
      <div class="stat-ico">📤</div>
      <div class="stat-label">Sedang Dipinjam</div>
      <div class="stat-value">${dipinjam}</div>
    </div>
    <div class="card stat-card c-broken">
      <div class="stat-ico">⚠️</div>
      <div class="stat-label">Rusak</div>
      <div class="stat-value">${rusak}</div>
    </div>
  `;
}

/* ============ ALAT ============ */
function initAlat() {
  const grid = document.getElementById('alatGrid');
  if (!grid) return;
  const chips = document.querySelectorAll('.chip');
  let activeFilter = 'semua';

  function render() {
    const filtered = activeFilter === 'semua' ? ALAT : ALAT.filter(a => a.kategori === activeFilter);
    if (!filtered.length) {
      grid.innerHTML = `<div class="empty"><span class="ico">🔍</span>Tidak ada alat di kategori ini</div>`;
      return;
    }
    grid.innerHTML = filtered.map(a => `
      <div class="alat-card">
        <img class="alat-img" src="${a.gambar}" alt="${a.nama}" loading="lazy" onerror="this.style.display='none'">
        <div class="alat-body">
          <h3>${a.nama}</h3>
          <div class="alat-meta">📍 ${a.lokasi}</div>
          ${badgeStatus(a.status)}
          <div class="btn-row">
            ${a.status === 'tersedia'
              ? `<a href="booking.html?alat=${encodeURIComponent(a.nama)}" class="btn btn-primary btn-sm" style="width:100%">Pinjam Sekarang</a>`
              : `<button class="btn btn-ghost btn-sm" style="width:100%" disabled>${
                  a.status === 'dipinjam' ? 'Sedang Dipinjam' : 'Tidak Tersedia'
                }</button>`}
          </div>
        </div>
      </div>
    `).join('');
  }

  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    activeFilter = c.dataset.filter;
    render();
  }));

  render();
}

/* ============ BOOKING ============ */
function initBooking() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const s = getSession();
  const select  = form.querySelector('[name="alat"]');
  const sumAlat = document.getElementById('sumAlat');
  const sumNama = document.getElementById('sumNama');
  const sumTgl  = document.getElementById('sumTgl');

  // Auto-fill nama & kelas dari profil
  if (s && s.profilLengkap) {
    form.querySelector('[name="peminjam"]').value = s.nama || '';
    form.querySelector('[name="kelas"]').value = s.kelas || '';
    // Jadikan readonly agar tidak diganti sembarangan
    form.querySelector('[name="peminjam"]').readOnly = true;
    form.querySelector('[name="kelas"]').readOnly = true;
  }

  select.innerHTML = '<option value="">— Pilih alat —</option>' +
    ALAT.map(a => `<option value="${a.nama}" ${a.status !== 'tersedia' ? 'disabled' : ''}>
      ${a.nama}${a.status !== 'tersedia' ? ' (' + a.status + ')' : ''}
    </option>`).join('');

  const preselected = new URLSearchParams(location.search).get('alat');
  if (preselected) select.value = preselected;

  function updateSummary() {
    if (sumAlat) sumAlat.textContent = select.value || '—';
    if (sumNama) sumNama.textContent = form.peminjam.value || '—';
    if (sumTgl)  sumTgl.textContent  = form.tgl.value || '—';
  }
  ['change', 'input'].forEach(ev => form.addEventListener(ev, updateSummary));
  updateSummary();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const booking = {
      id: 'BK' + Date.now().toString().slice(-5),
      alat: data.get('alat'),
      peminjam: data.get('peminjam'),
      kelas: data.get('kelas') || '-',
      tgl: data.get('tgl'),
      tglKembali: data.get('tglKembali') || '-',
      keperluan: data.get('keperluan') || '-',
      status: 'pending',
    };
    const list = getBookings();
    list.unshift(booking);
    saveBookings(list);
    toast(`✅ Booking ${booking.id} berhasil dikirim!`);
    form.reset();
    // Kembalikan nilai auto-fill setelah reset
    if (s && s.profilLengkap) {
      form.querySelector('[name="peminjam"]').value = s.nama || '';
      form.querySelector('[name="kelas"]').value = s.kelas || '';
    }
    updateSummary();
    setTimeout(() => location.href = 'status-booking.html', 1200);
  });
}

/* ============ AUTO MOVE TO RIWAYAT ============ */
function cekRiwayatOtomatis() {
  let bookings = getBookings();
  let riwayat = getRiwayat();
  let today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  let adaPerubahan = false;
  let sisaBookings = [];

  bookings.forEach(b => {
    // Jika status sudah disetujui dan tanggal kembali sudah lewat dari hari ini
    if (b.status === 'disetujui' && b.tglKembali && b.tglKembali < today) {
      b.status = 'selesai';       // Ubah status
      riwayat.unshift(b);         // Pindahkan ke array riwayat
      adaPerubahan = true;
    } else {
      sisaBookings.push(b);       // Tetap di daftar booking
    }
  });

  // Simpan jika ada perubahan
  if (adaPerubahan) {
    saveBookings(sisaBookings);
    saveRiwayat(riwayat);
  }
}

/* ============ STATUS BOOKING ============ */
function initStatus() {
  const wrap = document.getElementById('statusTable');
  if (!wrap) return;
  const list = getBookings();
  if (!list.length) {
    wrap.innerHTML = `<div class="empty"><span class="ico">📋</span>Belum ada booking. Yuk pinjam alat DKV!</div>`;
    return;
  }
  wrap.innerHTML = `
    <table>
      <thead><tr><th>ID</th><th>Alat</th><th>Peminjam</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead>
      <tbody>
        ${list.map(b => `
          <tr>
            <td data-label="ID">${b.id}</td>
            <td data-label="Alat">${b.alat}</td>
            <td data-label="Peminjam">${b.peminjam}</td>
            <td data-label="Tanggal">${b.tgl}</td>
            <td data-label="Status">${badgeStatus(b.status)}</td>
            <td data-label="Aksi">
              ${b.status === 'pending'
                ? `<button class="btn btn-danger btn-sm" data-cancel="${b.id}">Batalkan</button>`
                : '-'}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  wrap.querySelectorAll('[data-cancel]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Yakin batalkan booking ini?')) return;
      const id = btn.dataset.cancel;
      saveBookings(getBookings().filter(x => x.id !== id));
      toast('Booking dibatalkan');
      initStatus();
    });
  });
}

/* ============ RIWAYAT ============ */
function initRiwayat() {
  const wrap = document.getElementById('riwayatTable');
  if (!wrap) return;
  const list = getRiwayat();
  if (!list.length) {
    wrap.innerHTML = `<div class="empty"><span class="ico">🗂️</span>Belum ada riwayat peminjaman</div>`;
    return;
  }
  wrap.innerHTML = `
    <table>
      <thead><tr><th>ID</th><th>Alat</th><th>Peminjam</th><th>Tanggal</th><th>Status</th></tr></thead>
      <tbody>
        ${list.map(b => `
          <tr>
            <td data-label="ID">${b.id}</td>
            <td data-label="Alat">${b.alat}</td>
            <td data-label="Peminjam">${b.peminjam}</td>
            <td data-label="Tanggal">${b.tgl}</td>
            <td data-label="Status">${badgeStatus(b.status)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* ============ ADMIN ============ */
function initAdmin() {
  const wrap = document.getElementById('adminTable');
  if (!wrap) return;

  function render() {
    const list = getBookings();
    if (!list.length) {
      wrap.innerHTML = `<div class="empty"><span class="ico">🛠️</span>Tidak ada pengajuan booking</div>`;
      return;
    }
    wrap.innerHTML = `
      <table>
        <thead><tr><th>ID</th><th>Alat</th><th>Peminjam</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          ${list.map(b => `
            <tr>
              <td data-label="ID">${b.id}</td>
              <td data-label="Alat">${b.alat}</td>
              <td data-label="Peminjam">${b.peminjam}</td>
              <td data-label="Tanggal">${b.tgl}</td>
              <td data-label="Status">${badgeStatus(b.status)}</td>
              <td data-label="Aksi">
                ${b.status === 'pending' ? `
                  <button class="btn btn-primary btn-sm" data-approve="${b.id}">Setujui</button>
                  <button class="btn btn-danger btn-sm" data-reject="${b.id}">Tolak</button>
                ` : '-'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    wrap.querySelectorAll('[data-approve]').forEach(el =>
      el.addEventListener('click', () => updateStatus(el.dataset.approve, 'disetujui', '✅ Booking disetujui')));
    wrap.querySelectorAll('[data-reject]').forEach(el =>
      el.addEventListener('click', () => updateStatus(el.dataset.reject, 'ditolak', '❌ Booking ditolak')));
  }

  function updateStatus(id, status, msg) {
    const list = getBookings();
    const item = list.find(x => x.id === id);
    if (!item) return;
    item.status = status;
    saveBookings(list);
    toast(msg);
    render();
  }

  render();
}

/* ============ MODAL KERUSAKAN ============ */
function initDamageModal() {
  const modal = document.getElementById('damageModal');
  if (!modal) return;
  const form = document.getElementById('damageForm');
  const triggers = document.querySelectorAll('[data-open-damage]');

  triggers.forEach(btn => btn.addEventListener('click', () => {
    modal.classList.add('open');
    const alat = btn.dataset.alat;
    if (alat && form) form.querySelector('[name="alat"]').value = alat;
  }));

  modal.querySelectorAll('[data-close]').forEach(el =>
    el.addEventListener('click', () => modal.classList.remove('open')));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const laporan = {
        id: 'LP' + Date.now().toString().slice(-5),
        alat: data.get('alat'),
        pelapor: data.get('pelapor'),
        kerusakan: data.get('kerusakan'),
        tgl: new Date().toISOString().slice(0, 10),
      };
      const list = getLaporan();
      list.unshift(laporan);
      saveLaporan(list);
      toast(`⚠️ Laporan ${laporan.id} terkirim!`);
      form.reset();
      modal.classList.remove('open');
    });
  }
}

/* ============ NAVIGASI ============ */
function initMobileNav() {
  const toggle  = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay && overlay.classList.toggle('show');
  });
  overlay && overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

function markActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
}

/* ============ BOOTSTRAP ============ */
document.addEventListener('DOMContentLoaded', () => {
  const file = (location.pathname.split('/').pop() || '').toLowerCase();
  if (file === 'login.html' || file === 'profil.html') return;

  const hasSession = typeof getSession === 'function' && getSession();
  if (!hasSession) return;

  seedData();
  markActiveNav();
  initMobileNav();
  
  // Panggil fungsi auto-move di sini
  cekRiwayatOtomatis(); 

  initIndex();
  initAlat();
  initBooking();
  initStatus(); // Akan menampilkan data yang BELUM lewat tanggal
  initRiwayat(); // Akan menampilkan data yang SUDAH lewat tanggal
  initAdmin();
  initDamageModal();
});