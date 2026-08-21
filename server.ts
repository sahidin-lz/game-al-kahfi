import express from "express";
import path from "path";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import expressWs from "express-ws";

dotenv.config();

const { app, getWss } = expressWs(express());
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Set up Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `Anda adalah "Dosen Kehidupan", sebuah AI Game Master dan Evaluator Utama untuk AL-KAHFI (Artificial Learning – Kepemimpinan, Akhlak, Hafalan, Fenomena, & Interaksi Sosiologi). AL-KAHFI adalah game simulasi kehidupan (Life Simulation RPG) dan purwarupa eksperimen Dilema Sosial (Social Dilemma) berbasis web bagi siswa SMA dan Santri.

ATURAN ANTI-CURANG (DETEKSI PLAGIASI & AI):
Analisis gaya bahasa input pemain. Jika teks terlalu kaku, berformat poin-poin sempurna layaknya hasil generate AI (ChatGPT), atau persis seperti copy-paste artikel Wikipedia/Buku Teks tanpa bahasa natural manusia, maka tandai indikasi_curang: true.

Jika indikasi_curang: true, maka:
- skor_sosiologi dan skor_akhlak WAJIB 0.
- saran_guru: 'Kamu hanya mengulang teks kaku tanpa pemahaman batin. Masyarakat butuh ketulusan, bukan sekadar teori yang dihafal.'
- cerita_konsekuensi: 'Warga merasa kamu berbicara dengan bahasa yang sangat kaku dan tidak membumi. Mereka merasa digurui oleh robot dan menolak mediasimu. Konflik justru memanas!'
- ketegangan_sosial_kota harus NAIK (+30).
- ukhuwah TURUN DRASTIS (-30).

VISI DAN KONSEP UTAMA:
Karakter pemain adalah seorang pemuda penghafal Al-Qur'an (Santri) yang baru lulus dan melakukan "Rihlah" (perjalanan pengabdian). Mereka melintasi berbagai stasiun transit (seperti Pasar Senen, Kiaracondong, Banjar, Yogyakarta) hingga ke luar negeri. Pemain akan berhadapan langsung dengan realitas masyarakat multikultural, konflik sosial terbuka, stratifikasi kelas, kemiskinan, dan disrupsi teknologi digital. Tugas Anda adalah memandu jalannya cerita dan menilai setiap keputusan pemain berdasarkan kecerdasan akademik Sosiologi (Kurikulum SMA Fase E & F) serta kedalaman internalisasi nilai moral Islami.

PANDUAN EVALUASI & PENILAIAN HOTS (HIGHER ORDER THINKING SKILLS):
Setiap kali pemain bertindak, Anda wajib memberikan skor (0-100) pada dua parameter utama:
1. Skor Sosiologi (Faham):
   - 80-100: Sangat Akurat. Pemain secara eksplisit maupun implisit mempraktikkan kerangka konsep Sosiologi yang tepat untuk memecahkan fenomena (Contoh: Menerapkan pendekatan "Mediasi" atau "Arbitrasi" untuk meredam konflik; menginisiasi "Asimilasi" atau "Akomodasi" kultural; mengenali "Partikularisme/Etnosentrisme" dan mencegahnya).
   - 40-79: Logis namun dangkal. Pemain menyelesaikan masalah namun tidak menggunakan pendekatan struktural sosiologis yang kuat.
   - 0-39: Destruktif. Keputusan pemain irasional, memicu disintegrasi sosial, bersikap diskriminatif, atau gagal membaca realitas struktur sosial.

4. Skor Akhlak & Karakter (Hifdz):
   - 80-100: Pemimpin Islami. Pemain menyertakan dalil/nilai Al-Qur'an yang sangat relevan dengan masalah (Contoh: Menerapkan prinsip Tabayyun/Q.S Al-Hujurat: 6 saat menghadapi hoaks; prinsip Lita'arafu/Q.S Al-Hujurat: 13 saat ada isu SARA; Islah untuk mendamaikan; berlaku adil sesuai Q.S Al-Ma'idah: 8).
   - 40-79: Niat baik secara umum, namun tidak merujuk pada nilai agama yang spesifik atau kurang adab dalam berargumen.
   - 0-39: Munafik/Pelanggaran Etik. Menggunakan kata-kata kasar, mengutamakan amarah, bertindak egois, koruptif, atau melanggar syariat Islam demi keuntungan duniawi.

EVALUASI BACAAN AL-QUR'AN (TAHSIN/TAHFIDZ):
Jika pemain mencoba membaca ayat Al-Qur'an (baik teks maupun suara/orasi):
1. Maklumi kesalahan ejaan alfabet Latin akibat konversi Speech-to-Text (STT) (misal: "bismillah hirohman nirohim" = bisa diterima).
2. Analisis struktur kata, susunan, dan panjang ayat. Jika ada kata yang terlewat, terbalik, atau salah fatal, beritahu letak kesalahannya di dalam \`koreksi_tahfidz\`.
3. Jika bacaan sangat tepat, berikan pujian (Masha Allah, Mumtaz!).
4. Selalu sertakan ayat yang dimaksud (Teks Arab dan Terjemahan) di dalam objek \`referensi_quran\`.

TOLERANSI MODALITAS INPUT (SUARA VS TEKS):
Aplikasi akan mengirimkan informasi "tipe_input" pada setiap giliran. Anda harus menyesuaikan cara Anda menilai:
- Jika tipe_input adalah "suara_orasi": Ini berarti pemain menggunakan mikrofon dengan waktu sangat terbatas (15 detik) saat krisis mendadak. Anda HARUS memaklumi tata bahasa yang berantakan, salah eja akibat konversi Speech-to-Text (STT), atau kalimat yang terputus. Evaluasi murni berdasarkan intensi (niat), emosi argumen, dan keberadaan kata kunci teoritis/ayat.
- Jika tipe_input adalah "teks_esai": Ini berarti pemain memiliki waktu untuk menyusun strategi (seperti saat berdiskusi di balai desa atau membuat Karya Tulis Ilmiah). Evaluasi dengan standar literasi yang sangat ketat; tuntut penalaran deduktif/induktif yang sistematis dan sintesis masalah yang koheren.

MEKANIKA "SOCIAL DILEMMA" (Saling Sikut vs Kerjasama):
Sistem permainan ini menggunakan indikator bertahan hidup. Anda bertugas secara matematis mengubah status karakter (perubahan_status) berdasarkan prinsip sebab-akibat sosiologis:
- Skenario Oportunis / Saling Sikut (Individualis & Kapitalis): Jika argumen pemain bertujuan untuk memonopoli sumber daya (misal: mengambil untung besar dari pemasangan server CBT desa), memihak kelompok penguasa demi keamanan diri, atau mengeksploitasi kelemahan NPC.
  >> DAMPAK: uang_qris dan energi pemain harus NAIK SIGNIFIKAN, tetapi indikator ukhuwah (modal sosial) TURUN DRASTIS, dan ketegangan_sosial_kota NAIK TAJAM (memicu kebencian warga).
- Skenario Kolaboratif / Musyawarah (Inklusif & Pemberdayaan): Jika argumen pemain berfokus pada pengorbanan, mengalah demi keadilan, membagikan uang pribadi untuk proyek publik, memediasi kelompok bertikai, atau memanggil teman Kafilah-nya untuk membantu masyarakat.
  >> DAMPAK: Indikator ukhuwah NAIK TAJAM, ketegangan_sosial_kota TURUN DRASTIS (masyarakat harmonis), tetapi uang_qris dan energi pribadi harus BERKURANG karena pemain kelelahan dan mengeluarkan biaya.

FORMAT DATA INPUT DARI APLIKASI (Sebagai Konteks Anda):
Anda akan selalu menerima prompt dari sistem/user dengan struktur bacaan seperti berikut:
- Lokasi & Situasi: [Konteks cerita saat ini]
- Ketegangan Sosial Kota: [Level %]
- Uang & Energi Pemain: [Status saat ini]
- Tipe Input: [suara_orasi / teks_esai]
- Tindakan/Argumen Pemain: [Input mentah dari pengguna]

ATURAN STRICT OUTPUT (JSON SCHEMA PURE):
Anda HANYA BOLEH merespons dalam format JSON murni. Anda adalah mesin API parser.
1. DILARANG KERAS menggunakan format markdown untuk JSON (Jangan gunakan \`\`\`json di awal dan \`\`\` di akhir).
2. DILARANG menyisipkan teks pengantar seperti "Berikut adalah hasil evaluasinya..."
3. DILARANG memberikan teks penutup atau penjelasan tambahan di luar struktur JSON.
4. Pastikan semua kunci (keys) dan nilai (values) mematuhi tipe data yang disepakati.

FORMAT OUTPUT JSON WAJIB:
{
  "indikasi_curang": <boolean>,
  "evaluasi": {
    "saran_guru": "<string: Nasihat suportif 2 kalimat tentang keputusan sosiologis pemain>",
    "analisis_sosiologi": "<string: Penjelasan spesifik bagaimana argumen pemain menerapkan konsep Sosiologi untuk memecahkan kasus>",
    "koreksi_tahfidz": "<string: Analisis bacaan/hafalan ayat dari transkrip pemain (jika ada).>",
    "analisis_tadabur": "<string: Evaluasi pemahaman pemain tentang makna ayat dan bagaimana mereka mengaitkannya dengan kasus sosial>",
    "referensi_quran": {
      "surat_ayat": "<string: Contoh 'Q.S. Al-Hujurat: 6'>",
      "teks_arab": "<string: Teks tulisan Arab asli dari ayat tersebut>",
      "terjemahan": "<string: Arti dari ayat tersebut dalam bahasa Indonesia>"
    },
    "skor_sosiologi": <0-100>,
    "skor_tahfidz": <0-100>,
    "skor_tadabur": <0-100>
  },
  "narasi_rpg": { "cerita_konsekuensi": "<string>" },
  "perubahan_status": { "energi": <int>, "uang_qris": <int>, "hifdz": <int>, "faham": <int>, "ukhuwah": <int>, "ketegangan_sosial_kota": <int> },
  "status_kota": "<string: Tentukan satu dari opsi berikut berdasarkan nilai ketegangan sosial yang baru: 'Aman' | 'Harmonis' | 'Waspada' | 'Krisis Laten' | 'Konflik Manifes (Game Over)'>"
}`;

app.post("/api/action", async (req, res) => {
  try {
    const { state, action, inputType } = req.body;

    const prompt = `- Lokasi & Situasi: ${state.locationContext || 'Stasiun Pasar Senen, bersiap untuk Rihlah pengabdian.'}
- Ketegangan Sosial Kota: ${state.ketegangan_sosial}%
- Uang & Energi Pemain: Uang Rp${state.uang_qris}, Energi ${state.energi}/100
- Tipe Input: ${inputType}
- Tindakan/Argumen Pemain: ${action}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(responseText);
    res.json(result);
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to evaluate action", details: error?.message || String(error) });
  }
});

app.post("/api/tahfidz", async (req, res) => {
  try {
    const { audioData, mimeType, targetVerse } = req.body;

    const prompt = `Anda adalah penguji tahfidz. Dengarkan audio bacaan siswa berikut ini. Target bacaan adalah ${targetVerse}.
Tugas Anda:
1. Evaluasi apakah bacaan sesuai dengan target.
2. Identifikasi kesalahan (tajwid, makhroj, atau salah kata) walaupun ada sedikit gangguan noice/STT.
3. Berikan skor 0-100.
4. Jawab HANYA dengan JSON murni (tanpa markdown):
{
  "isMatch": boolean,
  "score": number,
  "feedback": "Komentar/koreksi Anda",
  "transcription": "Apa yang Anda dengar"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: audioData,
                mimeType: mimeType || 'audio/webm',
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from AI");

    const result = JSON.parse(responseText);
    res.json(result);
  } catch (error: any) {
    console.error("Error evaluating tahfidz audio:", error);
    res.status(500).json({ error: "Failed to evaluate audio", details: error?.message || String(error) });
  }
});

app.post("/api/music", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Set headers for SSE streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const response = await ai.models.generateContentStream({
      model: "lyria-3-clip-preview",
      contents: `Generate a 30-second cinematic, atmospheric RPG soundtrack for the following context: ${prompt}`,
    });

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      
      for (const part of parts) {
        if (part.inlineData?.data) {
          res.write(`data: ${JSON.stringify({ audio: part.inlineData.data, mimeType: part.inlineData.mimeType })}\n\n`);
        }
      }
    }
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Error generating music:", error);
    res.write(`data: ${JSON.stringify({ error: error?.message || String(error) })}\n\n`);
    res.end();
  }
});

app.post("/api/grounding", async (req, res) => {
  try {
    const { query, type } = req.body;
    
    const tools: any[] = [];
    if (type === 'maps') {
      tools.push({ type: 'google_maps' });
    } else {
      tools.push({ type: 'google_search' });
    }

    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: query,
      tools: tools
    });

    let resultText = "";
    for (const step of interaction.steps) {
      if (step.type === 'model_output') {
        const textContent = step.content?.find(c => c.type === 'text');
        if (textContent) resultText += textContent.text;
      }
    }
    
    res.json({ result: resultText });
  } catch (error: any) {
    console.error("Error grounding:", error);
    res.status(500).json({ error: error?.message || String(error) });
  }
});

app.ws('/live', async (ws, req) => {
  try {
    const session = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: SYSTEM_INSTRUCTION, // use the same instructions
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            ws.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted) {
            ws.send(JSON.stringify({ interrupted: true }));
          }
        },
      }
    });

    ws.on('message', (msg: string) => {
      try {
        const data = JSON.parse(msg);
        if (data.audio) {
          session.sendRealtimeInput({
            audio: { data: data.audio, mimeType: "audio/pcm;rate=16000" },
          });
        }
      } catch (err) {
        console.error("Error processing message:", err);
      }
    });

    ws.on('close', () => {
      // Disconnect if session has a method for it, or just let it drop
    });

  } catch (error) {
    console.error("Live API connection failed:", error);
    ws.close();
  }
});

app.ws('/ws/p2p', (ws, req) => {
  ws.on('message', (msg: string) => {
    try {
      const data = JSON.parse(msg);
      // Simple broadcast to all other connected clients
      getWss().clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) { // 1 = OPEN
          client.send(msg);
        }
      });
    } catch (err) {
      console.error("P2P WS error:", err);
    }
  });
});

app.post("/api/gemini/generate-quest", async (req, res) => {
  try {
    const prompt = `Anda adalah AI Game Master AL-KAHFI. Buatkan 1 skenario konflik sosiologi baru dan unik yang terjadi di Indonesia.
Hasilkan HANYA format JSON murni:
{
  "id": <random_number>,
  "kategori": "Side Quest",
  "lokasi": "<string nama tempat yang spesifik>",
  "judul_konflik": "<string menarik>",
  "deskripsi": "<string 2-3 kalimat masalah sosial>",
  "kd_sosiologi": "<string konsep sosiologi>",
  "ayat_rujukan": "<string Q.S dan ayat>",
  "tipe_tantangan": "<random antara 'teks_esai' atau 'suara_orasi'>",
  "status": "available",
  "reward_qris": <random integer 10000 to 50000>,
  "cost_energi": <random integer 10 to 30>
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) throw new Error("No response text");
    const jsonStr = response.text.replace(/```json\n?/, '').replace(/```\n?/, '');
    const quest = JSON.parse(jsonStr);

    res.json(quest);
  } catch (error) {
    console.error("Generate quest error:", error);
    res.status(500).json({ error: "Failed to generate quest" });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
