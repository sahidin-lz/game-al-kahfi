export interface Scenario {
  id: number;
  kategori: "Main Quest" | "Side Quest";
  lokasi: string;
  judul_konflik: string;
  deskripsi: string;
  kd_sosiologi: string;
  ayat_rujukan: string;
  tipe_tantangan: "teks_esai" | "suara_orasi";
  status: "locked" | "available" | "completed";
  reward_qris: number;
  cost_energi: number;
}

export const scenarioBank: Scenario[] = [
  {
    id: 1,
    lokasi: "Gerbong Kereta Transit",
    judul_konflik: "Prasangka dan Etnosentrisme",
    deskripsi: "Terdapat keributan antara penumpang yang berbeda suku di gerbong kereta. Selesaikan masalah ini! (Ketik/Bacakan argumen sosiologismu, lafalkan Q.S. Al-Hujurat: 11, dan jelaskan makna tadaburnya terkait kasus ini)",
    kd_sosiologi: "Prasangka (Prejudice) dan Etnosentrisme",
    ayat_rujukan: "Q.S. Al-Hujurat: 11 - Larangan Saling Mengolok",
    tipe_tantangan: "teks_esai",
    kategori: "Main Quest",
    status: "available",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 2,
    lokasi: "Desa Pengabdian",
    judul_konflik: "Penolakan Teknologi Baru",
    deskripsi: "Pemasangan Server VPS untuk CBT ditolak oleh tokoh adat. Hadapi tantangan ini! (Gunakan suara/orasi untuk berargumen, lafalkan Q.S. Ar-Ra'd: 11, dan tadaburi maknanya terkait perubahan sosial)",
    kd_sosiologi: "Gegar Budaya / Cultural Lag",
    ayat_rujukan: "Q.S. Ar-Ra'd: 11 - Perubahan Nasib Kaum",
    tipe_tantangan: "suara_orasi",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 3,
    lokasi: "Pasar Tradisional",
    judul_konflik: "Hoaks Alokasi Lapak",
    deskripsi: "Penyebaran hoaks alokasi lapak memicu ketegangan warga. (Tuliskan solusinya, lafalkan Q.S. Al-Hujurat: 6, dan jelaskan tadabur pentingnya Tabayyun dalam resolusi konflik)",
    kd_sosiologi: "Resolusi Konflik - Tabayyun",
    ayat_rujukan: "Q.S. Al-Hujurat: 6 - Tabayyun",
    tipe_tantangan: "teks_esai",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 4,
    lokasi: "Balai Kota",
    judul_konflik: "Penggusuran Kumuh",
    deskripsi: "Protes warga akibat ketimpangan penggusuran. (Gunakan suara/orasi, lafalkan Q.S. Al-Hasyr: 7, dan sampaikan tadabur mengenai stratifikasi dan distribusi kekayaan)",
    kd_sosiologi: "Stratifikasi Sosial",
    ayat_rujukan: "Q.S. Al-Hasyr: 7 - Distribusi Kekayaan",
    tipe_tantangan: "suara_orasi",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 5,
    lokasi: "Platform Digital",
    judul_konflik: "Kampanye Hitam Digital",
    deskripsi: "Kampanye hitam memicu segregasi kelompok pro dan kontra. (Tuliskan esai solusi, lafalkan Q.S. Al-Baqarah: 256, dan tadaburi maknanya dalam meredam konflik kelompok)",
    kd_sosiologi: "Segregasi dan Konflik Kelompok",
    ayat_rujukan: "Q.S. Al-Baqarah: 256 - Tidak Ada Paksaan",
    tipe_tantangan: "teks_esai",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 6,
    lokasi: "Stasiun Pasar Senen",
    judul_konflik: "Penghakiman Massa",
    deskripsi: "Massa emosi hendak menghakimi pencopet. Hentikan tindakan irasional ini! (Orasikan argumenmu, lafalkan Q.S. An-Nisa: 58, dan tadaburi pentingnya hukum & keadilan)",
    kd_sosiologi: "Tindakan Sosial Irasional vs Hukum",
    ayat_rujukan: "Q.S. An-Nisa: 58 - Keadilan dan Amanah",
    tipe_tantangan: "suara_orasi",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 7,
    lokasi: "Forum Pemuda Desa",
    judul_konflik: "Diskriminasi Minoritas",
    deskripsi: "Minoritas diabaikan dalam pemilihan festival desa. (Tuliskan esai pembelaan, lafalkan Q.S. Al-Hujurat: 13, dan jelaskan tadabur tentang bahaya partikularisme)",
    kd_sosiologi: "Partikularisme dan Diskriminasi",
    ayat_rujukan: "Q.S. Al-Hujurat: 13 - Kesetaraan Manusia",
    tipe_tantangan: "teks_esai",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 8,
    lokasi: "Warung Nasi Timbel",
    judul_konflik: "Monopoli Tengkulak",
    deskripsi: "Tengkulak memonopoli bahan pokok pedagang kecil. (Tuliskan argumen sosiologis kelas, lafalkan Q.S. Al-Mutaffifin: 1-3, dan tadaburi kecurangan ekonomi)",
    kd_sosiologi: "Konflik Kelas / Eksploitasi",
    ayat_rujukan: "Q.S. Al-Mutaffifin: 1-3 - Larangan Curang dalam Timbangan",
    tipe_tantangan: "teks_esai",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 9,
    lokasi: "Sekolah Binaan",
    judul_konflik: "Kenakalan dan Tawuran",
    deskripsi: "Potensi tawuran antar pelajar akibat disorganisasi sosial. (Gunakan suara/orasi, lafalkan Q.S. Luqman: 17, dan tadaburi peran kontrol sosial Amar Ma'ruf)",
    kd_sosiologi: "Disorganisasi Sosial dan Sosialisasi",
    ayat_rujukan: "Q.S. Luqman: 17 - Amar Ma'ruf Nahi Mungkar",
    tipe_tantangan: "suara_orasi",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 10,
    lokasi: "Panggung Global",
    judul_konflik: "Krisis Identitas",
    deskripsi: "Pemuda kehilangan identitas karena dominasi budaya asing. (Orasikan argumen asimilasi yang sehat, lafalkan Q.S. Al-Ma'idah: 48, dan tadaburi pentingnya berlomba dalam kebaikan)",
    kd_sosiologi: "Asimilasi vs Integrasi",
    ayat_rujukan: "Q.S. Al-Ma'idah: 48 - Berlomba dalam Kebaikan",
    tipe_tantangan: "suara_orasi",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 11,
    lokasi: "Pesantren Desa",
    judul_konflik: "Setoran Hafalan Khusus",
    deskripsi: "Guru memintamu menyetorkan bacaan Al-Qur'an (suara) Q.S. Al-Hujurat: 10 beserta penjelasan tadabur dan kaitannya dengan Integrasi Sosial.",
    kd_sosiologi: "Integrasi Sosial",
    ayat_rujukan: "Q.S. Al-Hujurat: 10",
    tipe_tantangan: "suara_orasi",
    kategori: "Side Quest",
    status: "available",
    reward_qris: 75000,
    cost_energi: 15
  }
];
