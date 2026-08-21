const fs = require('fs');
let content = fs.readFileSync('src/data/scenarioData.ts', 'utf8');

// The objects don't have the new properties. Let's add them.
// We can just replace 'tipe_tantangan: "teks_esai"' with 'tipe_tantangan: "teks_esai", kategori: "Main Quest", status: "locked", reward_qris: 50000, cost_energi: 20'
// And for the first one, make it 'available'.
// Wait, we need to be careful with id: 1.

content = content.replace(/tipe_tantangan: (.*?)\n  \}/g, (match, p1) => {
    return `tipe_tantangan: ${p1},\n    kategori: "Main Quest",\n    status: "locked",\n    reward_qris: 50000,\n    cost_energi: 20\n  }`;
});

content = content.replace('status: "locked"', 'status: "available"');

fs.writeFileSync('src/data/scenarioData.ts', content);
