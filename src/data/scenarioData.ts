export interface Scenario {
  ayat_arab?: string;
  ayat_terjemahan?: string;
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
    ayat_arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ عَسَىٰ أَن يَكُونُوا خَيْرًا مِّنْهُمْ",
    ayat_terjemahan: "Wahai orang-orang yang beriman! Janganlah suatu kaum mengolok-olok kaum yang lain (karena) boleh jadi mereka (yang diolok-olokkan) lebih baik dari mereka (yang mengolok-olok)...",
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
    ayat_arab: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
    ayat_terjemahan: "Sesungguhnya Allah tidak merubah keadaan sesuatu kaum sehingga mereka merubah keadaan yang ada pada diri mereka sendiri.",
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
    ayat_arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا",
    ayat_terjemahan: "Wahai orang-orang yang beriman! Jika seseorang yang fasik datang kepadamu membawa suatu berita, maka telitilah kebenarannya...",
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
    ayat_arab: "كَيْ لَا يَكُونَ دُولَةً بَيْنَ الْأَغْنِيَاءِ مِنكُمْ",
    ayat_terjemahan: "...supaya harta itu jangan hanya beredar di antara orang-orang kaya saja di antara kamu.",
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
    ayat_arab: "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ",
    ayat_terjemahan: "Tidak ada paksaan dalam (menganut) agama (Islam), sesungguhnya telah jelas (perbedaan) antara jalan yang benar dengan jalan yang sesat.",
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
    ayat_arab: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ",
    ayat_terjemahan: "Sungguh, Allah menyuruhmu menyampaikan amanat kepada yang berhak menerimanya, dan apabila kamu menetapkan hukum di antara manusia hendaknya kamu menetapkannya dengan adil.",
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
    ayat_arab: "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",
    ayat_terjemahan: "Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal.",
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
    ayat_arab: "وَيْلٌ لِّلْمُطَفِّفِينَ . الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ . وَإِذَا كَالُوهُمْ أَو وَّزَنُوهُمْ يُخْسِرُونَ",
    ayat_terjemahan: "Celakalah bagi orang-orang yang curang (dalam menakar dan menimbang)! (Yaitu) orang-orang yang apabila menerima takaran dari orang lain mereka minta dicukupkan, dan apabila mereka menakar atau menimbang (untuk orang lain), mereka mengurangi.",
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
    ayat_arab: "يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنكَرِ وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ",
    ayat_terjemahan: "Wahai anakku! Laksanakanlah shalat dan suruhlah (manusia) berbuat yang makruf dan cegahlah (mereka) dari yang mungkar dan bersabarlah terhadap apa yang menimpamu.",
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
    ayat_arab: "فَاسْتَبِقُوا الْخَيْرَاتِ ۚ إِلَى اللَّهِ مَرْجِعُكُمْ جَمِيعًا فَيُنَبِّئُكُم بِمَا كُنتُمْ فِيهِ تَخْتَلِفُونَ",
    ayat_terjemahan: "Maka berlomba-lombalah berbuat kebajikan. Hanya kepada Allah kamu semua kembali, lalu diberitahukan-Nya kepadamu apa yang dahulu kamu perselisihkan.",
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
    ayat_arab: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ",
    ayat_terjemahan: "Sesungguhnya orang-orang mukmin itu bersaudara, karena itu damaikanlah antara kedua saudaramu (yang berselisih).",
    tipe_tantangan: "suara_orasi",
    kategori: "Side Quest",
    status: "available",
    reward_qris: 75000,
    cost_energi: 15
  }
];
