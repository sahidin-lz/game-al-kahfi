const fs = require('fs');
let content = fs.readFileSync('src/data/scenarioData.ts', 'utf8');

content = content.replace('export interface Scenario {', 'export interface Scenario {\n  ayat_arab?: string;\n  ayat_terjemahan?: string;');

const ayatData = {
  "Q.S. Al-Hujurat: 11": {
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ عَسَىٰ أَن يَكُونُوا خَيْرًا مِّنْهُمْ",
    indo: "Wahai orang-orang yang beriman! Janganlah suatu kaum mengolok-olok kaum yang lain (karena) boleh jadi mereka (yang diolok-olokkan) lebih baik dari mereka (yang mengolok-olok)..."
  },
  "Q.S. Ar-Ra'd: 11": {
    arab: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
    indo: "Sesungguhnya Allah tidak merubah keadaan sesuatu kaum sehingga mereka merubah keadaan yang ada pada diri mereka sendiri."
  },
  "Q.S. Al-Hujurat: 6": {
    arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا",
    indo: "Wahai orang-orang yang beriman! Jika seseorang yang fasik datang kepadamu membawa suatu berita, maka telitilah kebenarannya..."
  },
  "Q.S. Al-Hasyr: 7": {
    arab: "كَيْ لَا يَكُونَ دُولَةً بَيْنَ الْأَغْنِيَاءِ مِنكُمْ",
    indo: "...supaya harta itu jangan hanya beredar di antara orang-orang kaya saja di antara kamu."
  },
  "Q.S. Al-Baqarah: 256": {
    arab: "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَد تَّبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ",
    indo: "Tidak ada paksaan dalam (menganut) agama (Islam), sesungguhnya telah jelas (perbedaan) antara jalan yang benar dengan jalan yang sesat."
  },
  "Q.S. An-Nisa: 58": {
    arab: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ",
    indo: "Sungguh, Allah menyuruhmu menyampaikan amanat kepada yang berhak menerimanya, dan apabila kamu menetapkan hukum di antara manusia hendaknya kamu menetapkannya dengan adil."
  },
  "Q.S. Al-Hujurat: 13": {
    arab: "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",
    indo: "Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal."
  },
  "Q.S. Al-Mutaffifin: 1-3": {
    arab: "وَيْلٌ لِّلْمُطَفِّفِينَ . الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ . وَإِذَا كَالُوهُمْ أَو وَّزَنُوهُمْ يُخْسِرُونَ",
    indo: "Celakalah bagi orang-orang yang curang (dalam menakar dan menimbang)! (Yaitu) orang-orang yang apabila menerima takaran dari orang lain mereka minta dicukupkan, dan apabila mereka menakar atau menimbang (untuk orang lain), mereka mengurangi."
  },
  "Q.S. Luqman: 17": {
    arab: "يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنكَرِ وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ",
    indo: "Wahai anakku! Laksanakanlah shalat dan suruhlah (manusia) berbuat yang makruf dan cegahlah (mereka) dari yang mungkar dan bersabarlah terhadap apa yang menimpamu."
  },
  "Q.S. Al-Ma'idah: 48": {
    arab: "فَاسْتَبِقُوا الْخَيْرَاتِ ۚ إِلَى اللَّهِ مَرْجِعُكُمْ جَمِيعًا فَيُنَبِّئُكُم بِمَا كُنتُمْ فِيهِ تَخْتَلِفُونَ",
    indo: "Maka berlomba-lombalah berbuat kebajikan. Hanya kepada Allah kamu semua kembali, lalu diberitahukan-Nya kepadamu apa yang dahulu kamu perselisihkan."
  },
  "Q.S. Al-Hujurat: 10": {
    arab: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ",
    indo: "Sesungguhnya orang-orang mukmin itu bersaudara, karena itu damaikanlah antara kedua saudaramu (yang berselisih)."
  }
};

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('ayat_rujukan:')) {
    const match = lines[i].match(/ayat_rujukan: "(Q\.S\.[^"]+?)(?: - [^"]+)?"/);
    if (match) {
      let key = match[1].trim();
      // Try to find key in ayatData
      let foundKey = Object.keys(ayatData).find(k => key.startsWith(k));
      if (foundKey) {
        lines.splice(i+1, 0, `    ayat_arab: "${ayatData[foundKey].arab}",\n    ayat_terjemahan: "${ayatData[foundKey].indo}",`);
      }
    }
  }
}

fs.writeFileSync('src/data/scenarioData.ts', lines.join('\n'));
