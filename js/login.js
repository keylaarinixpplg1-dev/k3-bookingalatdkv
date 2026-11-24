/* ============================================================
   DKV TOOLS — js/login.js
   Logika Login, Validasi (Bahasa Indonesia), & Guard Halaman
   ============================================================ */

const SESSION_KEY = 'dkv_session';

const USERS = [
  { username: 'siswa', password: 'siswa123', nama: 'Rani Pratama',  role: 'siswa' },
  { username: 'admin', password: 'admin123', nama: 'Pak Guru DKV', role: 'admin' },
];

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}
function setSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function logout() {
  localStorage.removeItem(SESSION_KEY);
  location.href = 'login.html';
}

/* ===== VALIDASI & LOGIN ===== */
function doLogin(username, password, role) {
  // 1. Validasi Input Kosong
  if (!username && !password) {
    return { ok: false, message: 'Username dan Password tidak boleh kosong!' };
  }
  if (!username) {
    return { ok: false, message: 'Username tidak boleh kosong!' };
  }
  if (!password) {
    return { ok: false, message: 'Password tidak boleh kosong!' };
  }

  // 2. Cari User
  const u = USERS.find(
    x => x.username.toLowerCase() === String(username).toLowerCase().trim() &&
         x.password === password &&
         x.role === role
  );

  // 3. Validasi Kredensial
  if (!u) {
    return { ok: false, message: 'Username atau Password salah. Silakan coba lagi.' };
  }

  // 4. Set Session
  setSession({
    username: u.username,
    nama: u.nama,
    role: u.role,
    kelas: '',
    hp: '',
    profilLengkap: u.role === 'admin', // Admin otomatis lengkap
    at: Date.now(),
  });
  
  return { ok: true };
}

/* ===== GUARD HALAMAN ===== */
const PAGE_ROLES = {
  'index.html':          ['siswa', 'admin'],
  'alat.html':           ['siswa', 'admin'],
  'booking.html':        ['siswa', 'admin'],
  'status-booking.html': ['siswa', 'admin'],
  'riwayat.html':        ['siswa', 'admin'],
  'tentang.html':        ['siswa', 'admin'], // Akses halaman about
  'admin.html':          ['admin'],
  'profil.html':         ['siswa'],
  'login.html':          ['guest', 'siswa', 'admin'],
};

(function guard() {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const allow = PAGE_ROLES[file];
  if (!allow) return;

  const session = getSession();
  const role = session ? session.role : 'guest';

  // Redirect jika sudah login tapi buka login.html
  if (file === 'login.html' && session) {
    if (session.role === 'admin') location.replace('admin.html');
    else if (!session.profilLengkap) location.replace('profil.html');
    else location.replace('index.html');
    return;
  }

  // Redirect jika belum login
  if (role === 'guest' && file !== 'login.html') {
    location.replace('login.html');
    return;
  }

  // Cek Role
  if (!allow.includes(role)) {
    if (file === 'admin.html' && role !== 'admin') {
      alert('Akses Ditolak: Halaman ini hanya untuk Admin.');
      location.replace('index.html');
    } else {
      location.replace('login.html');
    }
    return;
  }

  // Siswa wajib isi profil sebelum booking/riwayat
  if (role === 'siswa' && !session.profilLengkap) {
    if (['booking.html', 'status-booking.html', 'riwayat.html'].includes(file)) {
      alert('Mohon lengkapi profil Anda terlebih dahulu sebelum melakukan booking.');
      location.replace('profil.html');
      return;
    }
  }
})();

/* ===== SIDEBAR USER ===== */
function injectSidebarUser() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  if (sidebar.querySelector('.sidebar-user')) return;
  const s = getSession();
  if (!s) return;

  const old = sidebar.querySelector('.sidebar-footer');
  if (old) old.remove();

  const initials = (s.nama || s.username || '?').slice(0, 1).toUpperCase();
  const wrap = document.createElement('div');
  wrap.className = 'sidebar-user';
  wrap.innerHTML = `
    <div class="avatar">${initials}</div>
    <div class="who">
      <b>${s.nama || s.username}</b>
      <span>${s.role === 'admin' ? 'Admin' : 'Siswa'}</span>
    </div>
    <button class="logout-btn" title="Logout" aria-label="Logout">⎋</button>
  `;
  sidebar.appendChild(wrap);
  wrap.querySelector('.logout-btn').addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) logout();
  });
}
document.addEventListener('DOMContentLoaded', injectSidebarUser);