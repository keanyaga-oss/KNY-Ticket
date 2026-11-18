const SUPABASE_URL = 'https://rlhgdltccnthetzqxtlc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_DyVfIbNz4tx2B6rGjR4VNw_ez-265DV';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const isBerandaPage = window.location.pathname.includes('beranda.html');
const userAktif = JSON.parse(localStorage.getItem('kny_user'));

// =========================================================================
// LOGIKA HALAMAN 1: LANDING PAGE (index.html) - LOGIN & REGISTER SUPABASE
// =========================================================================
if (!isBerandaPage) {
  if (userAktif) {
    window.location.href = 'beranda.html';
  }

  const modalLogin = document.getElementById('modal-login');
  const btnBukaLogin = document.getElementById('btn-buka-login');
  const btnCtaLogin = document.getElementById('btn-cta-login');
  const btnTutupModal = document.getElementById('btn-tutup-modal');

  const tabBtnLogin = document.getElementById('tab-btn-login');
  const tabBtnRegister = document.getElementById('tab-btn-register');
  const sectionLogin = document.getElementById('section-form-login');
  const sectionRegister = document.getElementById('section-form-register');

  function bukaTabModal(mode) {
    if (mode === 'login') {
      sectionLogin.classList.remove('hidden');
      sectionRegister.classList.add('hidden');
      tabBtnLogin.style.background = '#ffffff';
      tabBtnLogin.style.color = '#2563eb';
      tabBtnLogin.style.fontWeight = '700';
      tabBtnRegister.style.background = 'transparent';
      tabBtnRegister.style.color = '#64748b';
      tabBtnRegister.style.fontWeight = '600';
    } else {
      sectionRegister.classList.remove('hidden');
      sectionLogin.classList.add('hidden');
      tabBtnRegister.style.background = '#ffffff';
      tabBtnRegister.style.color = '#2563eb';
      tabBtnRegister.style.fontWeight = '700';
      tabBtnLogin.style.background = 'transparent';
      tabBtnLogin.style.color = '#64748b';
      tabBtnLogin.style.fontWeight = '600';
    }
  }

  if (tabBtnLogin) tabBtnLogin.addEventListener('click', () => bukaTabModal('login'));
  if (tabBtnRegister) tabBtnRegister.addEventListener('click', () => bukaTabModal('register'));

  if (btnBukaLogin) {
    btnBukaLogin.addEventListener('click', () => {
      bukaTabModal('login');
      modalLogin.classList.remove('hidden');
    });
  }
  if (btnCtaLogin) {
    btnCtaLogin.addEventListener('click', () => {
      bukaTabModal('login');
      modalLogin.classList.remove('hidden');
    });
  }
  if (btnTutupModal) {
    btnTutupModal.addEventListener('click', () => modalLogin.classList.add('hidden'));
  }

  // PROSES DAFTAR AKUN
  const formRegister = document.getElementById('form-register');
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btnSubmit = document.getElementById('btn-submit-register');
      const nama = document.getElementById('reg-nama').value.trim();
      const email = document.getElementById('reg-email').value.trim().toLowerCase();
      const password = document.getElementById('reg-password').value;

      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<span>Mendaftarkan akun...</span>';

      const { data: cekEmail } = await db
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (cekEmail) {
        alert('Email sudah terdaftar! Silakan langsung masuk menggunakan tab Masuk.');
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<span>Daftar Sekarang</span><span class="material-symbols-outlined">how_to_reg</span>';
        bukaTabModal('login');
        document.getElementById('login-email').value = email;
        return;
      }

      const { error } = await db
        .from('users')
        .insert([{ nama, email, password }]);

      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<span>Daftar Sekarang</span><span class="material-symbols-outlined">how_to_reg</span>';

      if (error) {
        alert('Gagal membuat akun: ' + error.message);
        return;
      }

      alert('Akun berhasil dibuat! Selamat datang, ' + nama);
      localStorage.setItem('kny_user', JSON.stringify({ nama, email }));
      window.location.href = 'beranda.html';
    });
  }

  // PROSES LOGIN
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btnSubmit = document.getElementById('btn-submit-login');
      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const password = document.getElementById('login-password').value;

      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<span>Memeriksa akun...</span>';

      const { data: userDitemukan, error } = await db
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .maybeSingle();

      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<span>Masuk ke Beranda</span><span class="material-symbols-outlined">arrow_forward</span>';

      if (error) {
        alert('Terjadi kendala koneksi database: ' + error.message);
        return;
      }

      if (!userDitemukan) {
        alert('Email atau password salah, atau akun belum terdaftar. Silakan cek kembali atau klik "Daftar Akun".');
        return;
      }

      localStorage.setItem('kny_user', JSON.stringify({
        nama: userDitemukan.nama,
        email: userDitemukan.email
      }));
      window.location.href = 'beranda.html';
    });
  }
}

// =========================================================================
// LOGIKA HALAMAN 2: BERANDA & ALUR PEMESANAN (beranda.html)
// =========================================================================
if (isBerandaPage) {
  if (!userAktif) {
    window.location.href = 'index.html';
  }

  const dataDestinasi = [
    {
      id: 'sub-cgk',
      rute: 'Surabaya (SUB) ➔ Jakarta (CGK)',
      judulPendek: 'Surabaya ➔ Jakarta',
      kodeBandara: 'SUB — CGK • Direct',
      asal: 'Bandara Juanda (SUB)',
      tujuan: 'Bandara Soekarno-Hatta (CGK)',
      maskapai: 'Garuda Indonesia • Direct Flight',
      durasi: '1 Jam 25 Menit',
      jamTerbang: '07:30 WIB - 08:55 WIB',
      harga: 750000,
      badge: 'Terlaris',
      badgeColor: 'blue',
      gambar: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=900&q=80',
      deskripsi: 'Penerbangan langsung dari Surabaya menuju Jakarta dengan kenyamanan armada terbaik, ketepatan waktu tinggi, dan pilihan jadwal fleksibel sepanjang hari.'
    },
    {
      id: 'cgk-dps',
      rute: 'Jakarta (CGK) ➔ Bali (DPS)',
      judulPendek: 'Jakarta ➔ Bali',
      kodeBandara: 'CGK — DPS • Direct',
      asal: 'Bandara Soekarno-Hatta (CGK)',
      tujuan: 'Bandara I Gusti Ngurah Rai (DPS)',
      maskapai: 'Batik Air • Direct Flight',
      durasi: '1 Jam 50 Menit',
      jamTerbang: '09:15 WIB - 12:05 WITA',
      harga: 920000,
      badge: 'Liburan Favorit',
      badgeColor: 'orange',
      gambar: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
      deskripsi: 'Nikmati liburan impian ke Pulau Dewata Bali dengan penerbangan langsung tanpa transit dari Jakarta. Sudah termasuk bagasi kabin gratis.'
    },
    {
      id: 'sub-upg',
      rute: 'Surabaya (SUB) ➔ Makassar (UPG)',
      judulPendek: 'Surabaya ➔ Makassar',
      kodeBandara: 'SUB — UPG • Direct',
      asal: 'Bandara Juanda (SUB)',
      tujuan: 'Bandara Sultan Hasanuddin (UPG)',
      maskapai: 'Super Air Jet • Direct Flight',
      durasi: '1 Jam 35 Menit',
      jamTerbang: '10:40 WIB - 13:15 WITA',
      harga: 880000,
      badge: 'Hemat',
      badgeColor: 'green',
      gambar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
      deskripsi: 'Terbang cepat dan hemat menuju gerbang Indonesia Timur, Makassar. Cocok untuk perjalanan bisnis maupun wisata kuliner pesisir.'
    },
    {
      id: 'yia-kno',
      rute: 'Yogyakarta (YIA) ➔ Medan (KNO)',
      judulPendek: 'Yogyakarta ➔ Medan',
      kodeBandara: 'YIA — KNO • Direct',
      asal: 'Bandara Yogyakarta Int. (YIA)',
      tujuan: 'Bandara Kualanamu (KNO)',
      maskapai: 'Citilink • Direct Flight',
      durasi: '2 Jam 45 Menit',
      jamTerbang: '13:00 WIB - 15:45 WIB',
      harga: 1150000,
      badge: 'Rute Sumatra',
      badgeColor: 'blue',
      gambar: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
      deskripsi: 'Hubungkan perjalanan Anda dari Yogyakarta langsung menuju Medan tanpa perlu transit di Jakarta, hemat waktu hingga 3 jam.'
    },
    {
      id: 'cgk-lop',
      rute: 'Jakarta (CGK) ➔ Lombok (LOP)',
      judulPendek: 'Jakarta ➔ Lombok',
      kodeBandara: 'CGK — LOP • Direct',
      asal: 'Bandara Soekarno-Hatta (CGK)',
      tujuan: 'Bandara Int. Zainuddin Abdul Madjid (LOP)',
      maskapai: 'Garuda Indonesia • Direct Flight',
      durasi: '2 Jam 00 Menit',
      jamTerbang: '11:20 WIB - 14:20 WITA',
      harga: 980000,
      badge: 'Eksotis',
      badgeColor: 'orange',
      gambar: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=900&q=80',
      deskripsi: 'Jelajahi keindahan pantai Mandalika, Gunung Rinjani, dan kepulauan Gili di Lombok dengan penerbangan langsung dari Jakarta.'
    },
    {
      id: 'sub-bpn',
      rute: 'Surabaya (SUB) ➔ Balikpapan (BPN)',
      judulPendek: 'Surabaya ➔ Balikpapan',
      kodeBandara: 'SUB — BPN • Direct',
      asal: 'Bandara Juanda (SUB)',
      tujuan: 'Bandara Sultan Aji Muhammad Sulaiman (BPN)',
      maskapai: 'Batik Air • Direct Flight',
      durasi: '1 Jam 40 Menit',
      jamTerbang: '08:10 WIB - 10:50 WITA',
      harga: 850000,
      badge: 'Rute Kalimantan',
      badgeColor: 'blue',
      gambar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
      deskripsi: 'Akses cepat menuju gerbang Kalimantan Timur dan kawasan Ibu Kota Nusantara (IKN) dengan jadwal keberangkatan pagi hingga sore.'
    },
    {
      id: 'dps-lbj',
      rute: 'Bali (DPS) ➔ Labuan Bajo (LBJ)',
      judulPendek: 'Bali ➔ Labuan Bajo',
      kodeBandara: 'DPS — LBJ • Direct',
      asal: 'Bandara I Gusti Ngurah Rai (DPS)',
      tujuan: 'Bandara Komodo (LBJ)',
      maskapai: 'AirAsia Indonesia • Direct Flight',
      durasi: '1 Jam 15 Menit',
      jamTerbang: '14:15 WITA - 15:30 WITA',
      harga: 790000,
      badge: 'Wisata Alam',
      badgeColor: 'green',
      gambar: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=900&q=80',
      deskripsi: 'Terbang singkat menuju surga bahari Labuan Bajo, Taman Nasional Komodo, dan Pulau Padar langsung dari Denpasar Bali.'
    },
    {
      id: 'bdo-sub',
      rute: 'Bandung (BDO) ➔ Surabaya (SUB)',
      judulPendek: 'Bandung ➔ Surabaya',
      kodeBandara: 'BDO — SUB • Direct',
      asal: 'Bandara Husein Sastranegara (BDO)',
      tujuan: 'Bandara Juanda (SUB)',
      maskapai: 'Super Air Jet • Direct Flight',
      durasi: '1 Jam 20 Menit',
      jamTerbang: '16:00 WIB - 17:20 WIB',
      harga: 690000,
      badge: 'Promo Hemat',
      badgeColor: 'green',
      gambar: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80',
      deskripsi: 'Perjalanan lintas Pulau Jawa yang praktis dan ekonomis dari Kota Kembang Bandung langsung menuju Kota Pahlawan Surabaya.'
    },
    {
      id: 'sub-hnd',
      rute: 'Surabaya (SUB) ➔ Jepang (HND)',
      judulPendek: 'Surabaya ➔ Jepang',
      kodeBandara: 'SUB — HND • Direct',
      asal: 'Bandara Juanda (SUB)',
      tujuan: 'Bandara Haneda (HND)',
      maskapai: 'Garuda Indonesia • Direct Flight',
      durasi: '7 Jam 30 Menit',
      jamTerbang: '22:15 WIB - 07:45 JST',
      harga: 3154000,
      badge: 'Rute Internasional',
      badgeColor: 'purple',
      gambar: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80',
      deskripsi: 'Terbang langsung ke ibu kota Jepang, Tokyo, dengan jadwal keberangkatan yang fleksibel.'
    },
    {
      id: 'YIA-hnd',
      rute: 'Yogyakarta (YIA) ➔ Korea (IATA)',
      judulPendek: 'Yogyakarta ➔ Korea',
      kodeBandara: 'YIA — IATA • Direct',
      asal: 'Bandara Adisucipto (YIA)',
      tujuan: 'Bandara Incheon (IATA)',
      maskapai: 'Garuda Indonesia • Direct Flight',
      durasi: '7 Jam 30 Menit',
      jamTerbang: '21:30 WIB - 07:00 KST',
      harga: 4530000,
      badge: 'Rute Internasional',
      badgeColor: 'purple',
      gambar: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=900&q=80',
      deskripsi: 'Terbang langsung ke ibu kota Korea, Seoul, dengan jadwal keberangkatan yang fleksibel.'
    }
  ];

  let destinasiTerpilih = dataDestinasi[0];
  let dataPesananSementara = null;

  document.getElementById('user-display-name').innerText = userAktif.nama;
  document.getElementById('user-avatar-initial').innerText = userAktif.nama.charAt(0).toUpperCase();
  document.getElementById('welcome-greeting').innerText = `Halo, ${userAktif.nama}! Mau terbang ke mana hari ini?`;
  document.getElementById('nama').value = userAktif.nama;

  const inputTanggal = document.getElementById('tanggal');
  if (inputTanggal) {
    inputTanggal.min = new Date().toISOString().split('T')[0];
  }

  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('kny_user');
    window.location.href = 'index.html';
  });

  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  function pindahTab(targetId) {
    navTabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.add('hidden'));

    const activeBtn = document.querySelector(`.nav-tab[data-target="${targetId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    document.getElementById(targetId).classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (targetId === 'tab-tiket-saya') {
      tampilkanTiket();
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pindahTab(tab.getAttribute('data-target'));
    });
  });

  // =========================================================================
  // STEP 1: RENDER CARD DESTINASI DI BERANDA
  // =========================================================================
  const gridDestinasiUtama = document.getElementById('grid-destinasi-utama');

  function renderCardDestinasi(daftar, targetContainer) {
    targetContainer.innerHTML = '';
    daftar.forEach(dest => {
      const card = document.createElement('div');
      card.className = 'route-card clickable-route';
      card.innerHTML = `
        <div class="route-img" style="background-image: url('${dest.gambar}');">
          <span class="route-badge ${dest.badgeColor}">${dest.badge}</span>
        </div>
        <div class="route-body">
          <span class="airline-meta">${dest.maskapai}</span>
          <h3>${dest.judulPendek}</h3>
          <p class="airport-code">${dest.kodeBandara} • ${dest.jamTerbang.split(' - ')[0]}</p>
          <div class="route-footer">
            <span>Mulai dari</span>
            <strong>Rp ${dest.harga.toLocaleString('id-ID')}</strong>
          </div>
        </div>
      `;
      card.addEventListener('click', () => bukaDetailDestinasi(dest));
      targetContainer.appendChild(card);
    });
  }

  renderCardDestinasi(dataDestinasi, gridDestinasiUtama);

  // =========================================================================
  // STEP 2: HALAMAN DETAIL DESTINASI -> KE FORMULIR
  // =========================================================================
  function bukaDetailDestinasi(dest) {
    destinasiTerpilih = dest;

    document.getElementById('detail-img-banner').style.backgroundImage = `linear-gradient(rgba(15,23,42,0.2), rgba(15,23,42,0.5)), url('${dest.gambar}')`;
    const badgeEl = document.getElementById('detail-badge');
    badgeEl.innerText = dest.badge;
    badgeEl.className = `route-badge ${dest.badgeColor}`;

    document.getElementById('detail-maskapai').innerText = dest.maskapai;
    document.getElementById('detail-judul-rute').innerText = dest.rute;
    document.getElementById('detail-deskripsi').innerText = dest.deskripsi;
    document.getElementById('detail-durasi').innerText = `${dest.durasi} (${dest.jamTerbang})`;
    document.getElementById('detail-asal').innerText = dest.asal;
    document.getElementById('detail-tujuan').innerText = dest.tujuan;
    document.getElementById('detail-harga').innerText = 'Rp ' + dest.harga.toLocaleString('id-ID');

    pindahTab('tab-detail-destinasi');
  }

  document.getElementById('btn-kembali-dari-detail').addEventListener('click', () => {
    pindahTab('tab-beranda');
  });

  // =========================================================================
  // STEP 3: FORMULIR PEMESANAN + JAM TERBANG, DENAH KURSI ACAK & VOUCHER
  // =========================================================================
  const selectRute = document.getElementById('rute');
  const selectKelas = document.getElementById('kelas');
  const labelHarga = document.getElementById('estimasi-harga');
  const inputJamTerbang = document.getElementById('jam-terbang');
  const inputNomorKursi = document.getElementById('nomor-kursi');
  const seatRowsContainer = document.getElementById('seat-rows-container');
  const inputVoucher = document.getElementById('input-voucher');
  const btnTerapkanVoucher = document.getElementById('btn-terapkan-voucher');
  const pesanVoucher = document.getElementById('pesan-voucher');

  let kursiTerisiDatabase = [];
  let kursiTerpilih = ''; // Kosong di awal sebelum user memilih kursi

  const daftarVoucher = {
    'KNYTERBANG': { tipe: 'nominal', nilai: 100000, ket: 'Diskon Pengguna Baru Rp 100.000' },
    'BALIWEEKEND': { tipe: 'persen', nilai: 15, ruteWajib: 'Jakarta (CGK) ➔ Bali (DPS)', ket: 'Diskon 15% Rute Jakarta ➔ Bali' },
    'KNYPELAJAR': { tipe: 'nominal', nilai: 75000, ruteWajib: 'Surabaya (SUB) ➔ Jakarta (CGK)', ket: 'Tarif Pelajar Diskon Rp 75.000' },
    'TERBANGAWAL': { tipe: 'nominal', nilai: 50000, ket: 'Promo Early Bird Diskon Rp 50.000' }
  };

  let voucherAktif = null;

  function getLabelPosisiKursi(kode) {
    const huruf = kode.slice(-1);
    return (huruf === 'A' || huruf === 'D') ? 'Window' : 'Aisle';
  }

  function setTanggalDefaultBesok() {
    if (inputTanggal && !inputTanggal.value) {
      const besok = new Date();
      besok.setDate(besok.getDate() + 1);
      inputTanggal.value = besok.toISOString().split('T')[0];
    }
  }

  // Generator kursi terisi yang berbeda-beda (acak konsisten) untuk tiap kombinasi rute + tanggal
  function getKursiTerisiSimulasiPerDestinasi(rute, tanggal) {
    const semuaKursi = [];
    for (let b = 1; b <= 7; b++) {
      ['A', 'B', 'C', 'D'].forEach(h => semuaKursi.push(`${b}${h}`));
    }

    const kunci = `${rute}|${tanggal}`;
    let hash = 0;
    for (let i = 0; i < kunci.length; i++) {
      hash = ((hash << 5) - hash) + kunci.charCodeAt(i);
      hash |= 0;
    }

    // Jumlah kursi terisi acak antara 5 sampai 11 kursi per penerbangan
    const jumlahTerisi = 5 + (Math.abs(hash) % 7);
    const hasilAcak = new Set();
    let seed = Math.abs(hash) + 17;

    while (hasilAcak.size < jumlahTerisi) {
      seed = (seed * 9301 + 49297) % 233280;
      const idx = Math.floor((seed / 233280) * semuaKursi.length);
      hasilAcak.add(semuaKursi[idx]);
    }

    return Array.from(hasilAcak);
  }

  // Gabungkan kursi terisi acak per destinasi + kursi yang sudah dipesan di Supabase
  async function muatKursiTerisiDariSupabase() {
    const opsiTerpilih = selectRute.options[selectRute.selectedIndex];
    const ruteDipilih = opsiTerpilih ? opsiTerpilih.value : '';
    const tanggalDipilih = inputTanggal ? inputTanggal.value : '';

    if (!ruteDipilih || !tanggalDipilih) {
      kursiTerisiDatabase = [];
      renderDenahKursi();
      return;
    }

    // 1. Ambil variasi kursi terisi unik untuk rute & tanggal ini
    const kursiAcakRuteIni = getKursiTerisiSimulasiPerDestinasi(ruteDipilih, tanggalDipilih);

    // 2. Ambil kursi yang sudah dipesan penumpang nyata di Supabase
    const { data, error } = await db
      .from('tiket_pesawat')
      .select('nomor_kursi')
      .eq('rute', ruteDipilih)
      .eq('tanggal', tanggalDipilih);

    let kursiDariDB = [];
    if (!error && data && data.length > 0) {
      kursiDariDB = data
        .map(item => (item.nomor_kursi || '').split(' ')[0].trim())
        .filter(Boolean);
    }

    // Gabungkan keduanya tanpa duplikat
    kursiTerisiDatabase = Array.from(new Set([...kursiAcakRuteIni, ...kursiDariDB]));

    if (kursiTerisiDatabase.includes(kursiTerpilih)) {
      kursiTerpilih = '';
      if (inputNomorKursi) inputNomorKursi.value = '';
    }

    renderDenahKursi();
  }

  function renderDenahKursi() {
    if (!seatRowsContainer) return;
    seatRowsContainer.innerHTML = '';

    const kelasSaatIni = selectKelas.value;
    const kolomKiri = ['A', 'B'];
    const kolomKanan = ['C', 'D'];

    for (let baris = 1; baris <= 7; baris++) {
      const isBusinessRow = baris <= 2;
      const barisSesuaiKelas = (kelasSaatIni === 'Business Class' && isBusinessRow) ||
                               (kelasSaatIni === 'Economy Class' && !isBusinessRow);

      const rowDiv = document.createElement('div');
      rowDiv.style.display = 'flex';
      rowDiv.style.alignItems = 'center';
      rowDiv.style.justifyContent = 'space-between';
      rowDiv.style.gap = '6px';

      const buatTombolKursi = (huruf) => {
        const kode = `${baris}${huruf}`;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerText = kode;
        btn.style.width = '44px';
        btn.style.height = '36px';
        btn.style.borderRadius = '8px';
        btn.style.fontSize = '12px';
        btn.style.fontWeight = '700';
        btn.style.transition = 'all 0.15s';

        const sudahTerisi = kursiTerisiDatabase.includes(kode);

        if (sudahTerisi || !barisSesuaiKelas) {
          btn.disabled = true;
          btn.style.background = '#e2e8f0';
          btn.style.color = '#94a3b8';
          btn.style.border = '1px solid #cbd5e1';
          btn.style.cursor = 'not-allowed';
          btn.title = sudahTerisi ? 'Kursi sudah terisi' : `Khusus ${isBusinessRow ? 'Business Class' : 'Economy Class'}`;
        } else if (kursiTerpilih === kode) {
          btn.style.background = '#2563eb';
          btn.style.color = '#ffffff';
          btn.style.border = '2px solid #1d4ed8';
          btn.style.cursor = 'pointer';
        } else {
          btn.style.background = '#ffffff';
          btn.style.color = '#0f172a';
          btn.style.border = '1px solid #94a3b8';
          btn.style.cursor = 'pointer';
        }

        btn.addEventListener('click', () => {
          kursiTerpilih = kode;
          if (inputNomorKursi) {
            inputNomorKursi.value = `${kode} (${getLabelPosisiKursi(kode)})`;
          }
          renderDenahKursi();
        });

        return btn;
      };

      const grupKiri = document.createElement('div');
      grupKiri.style.display = 'flex';
      grupKiri.style.gap = '6px';
      kolomKiri.forEach(h => grupKiri.appendChild(buatTombolKursi(h)));

      const lorong = document.createElement('span');
      lorong.innerText = baris;
      lorong.style.fontSize = '11px';
      lorong.style.fontWeight = '700';
      lorong.style.color = '#94a3b8';
      lorong.style.width = '18px';
      lorong.style.textAlign = 'center';

      const grupKanan = document.createElement('div');
      grupKanan.style.display = 'flex';
      grupKanan.style.gap = '6px';
      kolomKanan.forEach(h => grupKanan.appendChild(buatTombolKursi(h)));

      rowDiv.appendChild(grupKiri);
      rowDiv.appendChild(lorong);
      rowDiv.appendChild(grupKanan);
      seatRowsContainer.appendChild(rowDiv);
    }
  }

  function perbaruiFormOtomatis() {
    const opsi = selectRute.options[selectRute.selectedIndex];
    let hargaAwal = parseInt(opsi.getAttribute('data-harga'));
    if (selectKelas.value === 'Business Class') hargaAwal *= 1.5;

    let potongan = 0;

    if (voucherAktif) {
      const info = daftarVoucher[voucherAktif];
      if (info.ruteWajib && info.ruteWajib !== selectRute.value) {
        voucherAktif = null;
        if (pesanVoucher) {
          pesanVoucher.style.color = '#dc2626';
          pesanVoucher.innerText = `Voucher dibatalkan: hanya berlaku untuk rute ${info.ruteWajib}.`;
        }
      } else {
        potongan = (info.tipe === 'persen')
          ? Math.round(hargaAwal * (info.nilai / 100))
          : info.nilai;
      }
    }

    const hargaAkhir = Math.max(0, hargaAwal - potongan);

    if (potongan > 0) {
      labelHarga.innerHTML = `<span style="text-decoration: line-through; color: #94a3b8; font-size: 14px; margin-right: 8px;">Rp ${hargaAwal.toLocaleString('id-ID')}</span>Rp ${hargaAkhir.toLocaleString('id-ID')}`;
    } else {
      labelHarga.innerText = 'Rp ' + hargaAwal.toLocaleString('id-ID');
    }

    const cocokDestinasi = dataDestinasi[selectRute.selectedIndex] || dataDestinasi.find(d => d.rute === selectRute.value);
    if (inputJamTerbang) {
      inputJamTerbang.value = cocokDestinasi ? cocokDestinasi.jamTerbang : '08:00 WIB - 09:30 WIB';
    }

    return { hargaAkhir, potongan, kodeVoucher: voucherAktif };
  }

  if (btnTerapkanVoucher) {
    btnTerapkanVoucher.addEventListener('click', () => {
      const kodeInput = inputVoucher.value.trim().toUpperCase();

      if (!kodeInput) {
        voucherAktif = null;
        pesanVoucher.style.color = '#dc2626';
        pesanVoucher.innerText = 'Silakan ketik atau tempel kode voucher terlebih dahulu.';
        perbaruiFormOtomatis();
        return;
      }

      const dataV = daftarVoucher[kodeInput];
      if (!dataV) {
        voucherAktif = null;
        pesanVoucher.style.color = '#dc2626';
        pesanVoucher.innerText = 'Kode voucher tidak valid atau sudah kedaluwarsa.';
        perbaruiFormOtomatis();
        return;
      }

      if (dataV.ruteWajib && dataV.ruteWajib !== selectRute.value) {
        voucherAktif = null;
        pesanVoucher.style.color = '#dc2626';
        pesanVoucher.innerText = `Kode ${kodeInput} hanya berlaku khusus rute ${dataV.ruteWajib}.`;
        perbaruiFormOtomatis();
        return;
      }

      voucherAktif = kodeInput;
      pesanVoucher.style.color = '#059669';
      pesanVoucher.innerText = `✓ Berhasil! ${dataV.ket} diterapkan.`;
      perbaruiFormOtomatis();
    });
  }

  selectRute.addEventListener('change', () => {
    kursiTerpilih = '';
    if (inputNomorKursi) inputNomorKursi.value = '';
    perbaruiFormOtomatis();
    muatKursiTerisiDariSupabase();
  });

  if (inputTanggal) {
    inputTanggal.addEventListener('change', () => {
      muatKursiTerisiDariSupabase();
    });
  }

  selectKelas.addEventListener('change', () => {
    kursiTerpilih = '';
    if (inputNomorKursi) inputNomorKursi.value = '';
    perbaruiFormOtomatis();
    muatKursiTerisiDariSupabase();
  });

  document.getElementById('btn-lanjut-form').addEventListener('click', () => {
    const indexDestinasi = dataDestinasi.findIndex(d => d.id === destinasiTerpilih.id);
    if (indexDestinasi !== -1 && selectRute.options[indexDestinasi]) {
      selectRute.selectedIndex = indexDestinasi;
    } else {
      selectRute.value = destinasiTerpilih.rute;
    }

    const userTersimpan = JSON.parse(localStorage.getItem('kny_user')) || userAktif;
    document.getElementById('nama').value = userTersimpan.nama || '';
    if (userTersimpan.kelasDefault) {
      selectKelas.value = userTersimpan.kelasDefault;
    }

    setTanggalDefaultBesok();
    voucherAktif = null;
    kursiTerpilih = '';
    if (inputNomorKursi) inputNomorKursi.value = '';
    if (inputVoucher) inputVoucher.value = '';
    if (pesanVoucher) pesanVoucher.innerText = '';

    perbaruiFormOtomatis();
    muatKursiTerisiDariSupabase();
    pindahTab('tab-form-pemesanan');
  });

  document.getElementById('btn-kembali-ke-detail').addEventListener('click', () => {
    pindahTab('tab-detail-destinasi');
  });

  const formTiket = document.getElementById('form-tiket');

  formTiket.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!kursiTerpilih) {
      alert('Silakan pilih tempat duduk terlebih dahulu pada denah kursi!');
      return;
    }

    const hasilHitung = perbaruiFormOtomatis();
    dataPesananSementara = {
      nama_penumpang: document.getElementById('nama').value.trim(),
      rute: selectRute.value,
      tanggal: document.getElementById('tanggal').value,
      jam_terbang: inputJamTerbang ? inputJamTerbang.value : '07:30 WIB - 08:55 WIB',
      kelas: selectKelas.value,
      nomor_kursi: inputNomorKursi ? inputNomorKursi.value : `${kursiTerpilih} (${getLabelPosisiKursi(kursiTerpilih)})`,
      total_harga: hasilHitung.hargaAkhir,
      voucher: hasilHitung.kodeVoucher,
      potongan: hasilHitung.potongan
    };

    document.getElementById('konf-nama').innerText = dataPesananSementara.nama_penumpang;
    document.getElementById('konf-rute').innerText = dataPesananSementara.rute;
    document.getElementById('konf-tanggal-jam').innerText = `${dataPesananSementara.tanggal} • ${dataPesananSementara.jam_terbang}`;
    document.getElementById('konf-kelas').innerText = dataPesananSementara.kelas;
    if (document.getElementById('konf-kursi')) {
      document.getElementById('konf-kursi').innerText = dataPesananSementara.nomor_kursi;
    }
    if (document.getElementById('konf-voucher')) {
      document.getElementById('konf-voucher').innerText = dataPesananSementara.voucher
        ? `${dataPesananSementara.voucher} (-Rp ${dataPesananSementara.potongan.toLocaleString('id-ID')})`
        : 'Tidak ada';
    }
    document.getElementById('konf-harga').innerText = 'Rp ' + hasilHitung.hargaAkhir.toLocaleString('id-ID');

    pindahTab('tab-konfirmasi-pesanan');
  });

  document.getElementById('btn-kembali-edit-form').addEventListener('click', () => {
    pindahTab('tab-form-pemesanan');
  });

  // =========================================================================
  // STEP 4 & 5: PEMBAYARAN INTERAKTIF -> SIMPAN SUPABASE -> POP-UP BERHASIL
  // =========================================================================
  const opsiBayarCards = document.querySelectorAll('.opsi-bayar-card');
  const viewQris = document.getElementById('view-bayar-qris');
  const viewVa = document.getElementById('view-bayar-va');
  const viewKartu = document.getElementById('view-bayar-kartu');

  opsiBayarCards.forEach(card => {
    card.addEventListener('click', () => {
      opsiBayarCards.forEach(c => {
        c.style.border = '1px solid #cbd5e1';
        c.style.background = '#ffffff';
      });
      card.style.border = '2px solid #2563eb';
      card.style.background = '#eff6ff';

      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const metode = card.getAttribute('data-metode');
      viewQris.classList.add('hidden');
      viewVa.classList.add('hidden');
      viewKartu.classList.add('hidden');

      if (metode === 'QRIS Instan') viewQris.classList.remove('hidden');
      if (metode === 'Virtual Account Bank') viewVa.classList.remove('hidden');
      if (metode === 'Kartu Debit / Kredit') viewKartu.classList.remove('hidden');
    });
  });

  const btnSalinVa = document.getElementById('btn-salin-va');
  if (btnSalinVa) {
    btnSalinVa.addEventListener('click', () => {
      navigator.clipboard.writeText('8801082120269912');
      btnSalinVa.innerText = 'Tersalin!';
      setTimeout(() => { btnSalinVa.innerText = 'Salin'; }, 1500);
    });
  }

  const btnKonfirmasiFinal = document.getElementById('btn-konfirmasi-final');
  const modalBerhasil = document.getElementById('modal-pesanan-berhasil');

  btnKonfirmasiFinal.addEventListener('click', async () => {
    if (!dataPesananSementara) return;

    const userSekarang = JSON.parse(localStorage.getItem('kny_user')) || userAktif;
    const radioTerpilih = document.querySelector('input[name="metode-bayar"]:checked');
    const metodePembayaran = radioTerpilih ? radioTerpilih.value : 'QRIS Instan';

    btnKonfirmasiFinal.disabled = true;
    btnKonfirmasiFinal.innerHTML = '<span>Memverifikasi Pembayaran...</span>';

    await new Promise(resolve => setTimeout(resolve, 1200));

    const { error } = await db
      .from('tiket_pesawat')
      .insert([{
        email_user: userSekarang.email,
        nama_penumpang: dataPesananSementara.nama_penumpang,
        rute: dataPesananSementara.rute,
        tanggal: dataPesananSementara.tanggal,
        jam_terbang: dataPesananSementara.jam_terbang,
        kelas: dataPesananSementara.kelas,
        nomor_kursi: dataPesananSementara.nomor_kursi,
        metode_pembayaran: metodePembayaran
      }]);

    btnKonfirmasiFinal.disabled = false;
    btnKonfirmasiFinal.innerHTML = '<span class="material-symbols-outlined">verified</span><span>Bayar Sekarang & Terbitkan E-Ticket</span>';

    if (error) {
      alert('Gagal menyimpan pesanan ke database: ' + error.message);
      return;
    }

    document.getElementById('pop-nama').innerText = dataPesananSementara.nama_penumpang;
    document.getElementById('pop-rute').innerText = dataPesananSementara.rute;
    document.getElementById('pop-detail').innerText = `${dataPesananSementara.tanggal} • Kursi ${dataPesananSementara.nomor_kursi} • ${metodePembayaran}`;

    modalBerhasil.classList.remove('hidden');
    formTiket.reset();
    voucherAktif = null;
    kursiTerpilih = '';
    if (inputNomorKursi) inputNomorKursi.value = '';
  });

  document.getElementById('btn-pop-lihat-tiket').addEventListener('click', () => {
    modalBerhasil.classList.add('hidden');
    pindahTab('tab-tiket-saya');
  });

  document.getElementById('btn-pop-ke-beranda').addEventListener('click', () => {
    modalBerhasil.classList.add('hidden');
    pindahTab('tab-beranda');
  });

  // =========================================================================
  // FITUR PENCARIAN, KATEGORI, PROMO, TIKET SAYA & PENGATURAN AKUN
  // =========================================================================
  const inputCari = document.getElementById('input-pencarian');
  const areaHasil = document.getElementById('hasil-pencarian-area');
  const listHasil = document.getElementById('list-hasil-cari');

  document.getElementById('btn-cari-rute').addEventListener('click', () => {
    const kataKunci = inputCari.value.toLowerCase().trim();
    const hasil = dataDestinasi.filter(item => item.rute.toLowerCase().includes(kataKunci));

    areaHasil.classList.remove('hidden');
    if (hasil.length === 0) {
      listHasil.innerHTML = '<p style="color:#64748b; grid-column: 1 / -1;">Destinasi tidak ditemukan. Coba kata kunci lain (Jakarta, Bali, Surabaya, Makassar, Medan).</p>';
      return;
    }
    renderCardDestinasi(hasil, listHasil);
  });

  document.getElementById('btn-reset-cari').addEventListener('click', () => {
    inputCari.value = '';
    areaHasil.classList.add('hidden');
  });

  document.querySelectorAll('.btn-pilih-kategori').forEach(btn => {
    btn.addEventListener('click', () => {
      selectKelas.value = btn.getAttribute('data-kelas');
      setTanggalDefaultBesok();
      voucherAktif = null;
      kursiTerpilih = '';
      if (inputNomorKursi) inputNomorKursi.value = '';
      if (inputVoucher) inputVoucher.value = '';
      if (pesanVoucher) pesanVoucher.innerText = '';
      perbaruiFormOtomatis();
      muatKursiTerisiDariSupabase();
      pindahTab('tab-form-pemesanan');
    });
  });

  document.querySelectorAll('.btn-copy, .btn-copy-mini').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.getAttribute('data-kode'));
      const teksAsli = btn.innerText;
      btn.innerText = 'Tersalin!';
      setTimeout(() => { btn.innerText = teksAsli; }, 1500);
    });
  });

  // Tampilkan Tiket Saya + Klik untuk Lihat Detail E-Ticket
  const daftarTiket = document.getElementById('daftar-tiket');
  const modalDetailTiket = document.getElementById('modal-detail-tiket');
  const btnTutupDetailTiket = document.getElementById('btn-tutup-detail-tiket');
  const btnSelesaiDetailTiket = document.getElementById('btn-selesai-detail-tiket');

  if (btnTutupDetailTiket) {
    btnTutupDetailTiket.addEventListener('click', () => modalDetailTiket.classList.add('hidden'));
  }
  if (btnSelesaiDetailTiket) {
    btnSelesaiDetailTiket.addEventListener('click', () => modalDetailTiket.classList.add('hidden'));
  }

  function bukaModalDetailTiket(tiket, index) {
    const jamTampil = tiket.jam_terbang || '07:30 WIB - 08:55 WIB';
    const bayarTampil = tiket.metode_pembayaran || 'QRIS Instan';
    const kursiTampil = tiket.nomor_kursi || '-';
    const kodeBooking = `KNY-${String(tiket.id || (index + 1)).padStart(4, '0')}`;
    const gateInfo = `Gate A${(index % 5) + 1} • Kursi ${kursiTampil}`;

    document.getElementById('det-tiket-kode').innerText = kodeBooking;
    document.getElementById('det-tiket-rute').innerText = tiket.rute;
    document.getElementById('det-tiket-nama').innerText = tiket.nama_penumpang;
    document.getElementById('det-tiket-kelas').innerText = tiket.kelas;
    document.getElementById('det-tiket-tanggal').innerText = tiket.tanggal;
    document.getElementById('det-tiket-jam').innerText = jamTampil;
    document.getElementById('det-tiket-gate').innerText = gateInfo;
    document.getElementById('det-tiket-bayar').innerText = `Lunas (${bayarTampil})`;

    const qrData = encodeURIComponent(`${kodeBooking} | ${tiket.nama_penumpang} | ${tiket.rute} | ${tiket.tanggal} | Kursi ${kursiTampil}`);
    document.getElementById('det-tiket-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${qrData}`;

    modalDetailTiket.classList.remove('hidden');
  }

  async function tampilkanTiket() {
    daftarTiket.innerHTML = '<p class="loading-text">Memuat daftar tiket Anda...</p>';

    const userSekarang = JSON.parse(localStorage.getItem('kny_user')) || userAktif;

    const { data, error } = await db
      .from('tiket_pesawat')
      .select('*')
      .eq('email_user', userSekarang.email);

    if (error) {
      daftarTiket.innerHTML = `
        <div class="empty-state-box" style="border-color: #fca5a5;">
          <span class="material-symbols-outlined empty-icon" style="background:#fee2e2; color:#dc2626;">error</span>
          <h3>Gagal Memuat Data Tiket</h3>
          <p>Terjadi kendala koneksi database: <strong>${error.message}</strong></p>
        </div>
      `;
      return;
    }

    if (!data || data.length === 0) {
      daftarTiket.innerHTML = `
        <div class="empty-state-box">
          <span class="material-symbols-outlined empty-icon">confirmation_number</span>
          <h3>Anda Belum Memiliki Tiket</h3>
          <p>Tiket Anda saat ini masih kosong. Pilih destinasi di Beranda untuk mulai memesan tiket.</p>
          <button type="button" class="btn-submit" id="btn-ke-beranda-kosong">
            <span>Pilih Destinasi Sekarang</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      `;

      document.getElementById('btn-ke-beranda-kosong').addEventListener('click', () => {
        pindahTab('tab-beranda');
      });
      return;
    }

    daftarTiket.innerHTML = '';
    data.slice().reverse().forEach((tiket, index) => {
      const jamTampil = tiket.jam_terbang || '07:30 WIB - 08:55 WIB';
      const bayarTampil = tiket.metode_pembayaran ? ` • Lunas (${tiket.metode_pembayaran})` : '';
      const kursiTampil = tiket.nomor_kursi || '-';

      const kartu = document.createElement('div');
      kartu.className = 'kartu-tiket';
      kartu.style.cursor = 'pointer';
      kartu.title = 'Klik untuk melihat detail E-Ticket';
      kartu.innerHTML = `
        <div class="tiket-header">
          <span>✈️ KNY BOARDING PASS</span>
          <span class="tiket-status">CONFIRMED${bayarTampil}</span>
        </div>
        <div class="tiket-body">
          <div class="rute">${tiket.rute}</div>
          <div class="tiket-meta-grid">
            <div>
              <span>Penumpang</span>
              <strong>${tiket.nama_penumpang}</strong>
            </div>
            <div>
              <span>Tanggal & Jam Terbang</span>
              <strong>${tiket.tanggal} • ${jamTampil}</strong>
            </div>
            <div>
              <span>Kelas & Tempat Duduk</span>
              <strong>${tiket.kelas} • ${kursiTampil}</strong>
            </div>
            <div>
              <span>Gate / Boarding</span>
              <strong>Gate A${(index % 5) + 1} • 30m sebelum</strong>
            </div>
          </div>
          <div class="tiket-barcode-bar">
            <span style="color: #2563eb; font-weight: 700;">Klik kartu untuk detail & QR Code ➔</span>
            <div class="fake-barcode"></div>
          </div>
        </div>
      `;

      kartu.addEventListener('click', () => bukaModalDetailTiket(tiket, index));
      daftarTiket.appendChild(kartu);
    });
  }

  // Pengaturan Akun
  const btnBukaPengaturan = document.getElementById('btn-buka-pengaturan');
  const btnKembaliBeranda = document.getElementById('btn-kembali-beranda');
  const btnLogoutSettings = document.getElementById('btn-logout-settings');
  const formPengaturan = document.getElementById('form-pengaturan-profil');

  function muatDataPengaturan() {
    const dataUser = JSON.parse(localStorage.getItem('kny_user')) || {};
    document.getElementById('settings-avatar').innerText = (dataUser.nama || 'U').charAt(0).toUpperCase();
    document.getElementById('settings-display-name').innerText = dataUser.nama || 'Penumpang';
    document.getElementById('settings-display-email').innerText = dataUser.email || '-';

    document.getElementById('set-nama').value = dataUser.nama || '';
    document.getElementById('set-email').value = dataUser.email || '';
    document.getElementById('set-telepon').value = dataUser.telepon || '';
    document.getElementById('set-nik').value = dataUser.nik || '';
    document.getElementById('set-kelas-default').value = dataUser.kelasDefault || 'Economy Class';
    document.getElementById('set-kursi-default').value = dataUser.kursiDefault || 'Window';
    document.getElementById('set-notif-email').checked = dataUser.notifEmail !== false;
    document.getElementById('set-notif-promo').checked = dataUser.notifPromo !== false;

    db.from('tiket_pesawat')
      .select('id')
      .eq('email_user', dataUser.email)
      .then(({ data }) => {
        if (data) document.getElementById('stat-total-tiket').innerText = data.length;
      });
  }

  if (btnBukaPengaturan) {
    btnBukaPengaturan.addEventListener('click', (e) => {
      if (e.target.id === 'btn-logout') return;
      muatDataPengaturan();
      pindahTab('tab-pengaturan');
    });
  }

  if (btnKembaliBeranda) {
    btnKembaliBeranda.addEventListener('click', () => pindahTab('tab-beranda'));
  }

  if (btnLogoutSettings) {
    btnLogoutSettings.addEventListener('click', () => {
      localStorage.removeItem('kny_user');
      window.location.href = 'index.html';
    });
  }

  if (formPengaturan) {
    formPengaturan.addEventListener('submit', (e) => {
      e.preventDefault();
      const userDiperbarui = {
        nama: document.getElementById('set-nama').value.trim(),
        email: document.getElementById('set-email').value.trim(),
        telepon: document.getElementById('set-telepon').value.trim(),
        nik: document.getElementById('set-nik').value.trim(),
        kelasDefault: document.getElementById('set-kelas-default').value,
        kursiDefault: document.getElementById('set-kursi-default').value,
        notifEmail: document.getElementById('set-notif-email').checked,
        notifPromo: document.getElementById('set-notif-promo').checked
      };

      localStorage.setItem('kny_user', JSON.stringify(userDiperbarui));
      document.getElementById('user-display-name').innerText = userDiperbarui.nama;
      document.getElementById('user-avatar-initial').innerText = userDiperbarui.nama.charAt(0).toUpperCase();
      document.getElementById('welcome-greeting').innerText = `Halo, ${userDiperbarui.nama}! Mau terbang ke mana hari ini?`;
      muatDataPengaturan();
      alert('Pengaturan akun berhasil disimpan!');
    });
  }
}