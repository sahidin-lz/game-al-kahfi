const fs = require('fs');
let content = fs.readFileSync('src/data/scenarioData.ts', 'utf8');
content = content.replace('status: "available" | "available" | "completed"', 'status: "locked" | "available" | "completed"');
content = content.replace('status: "locked",\n    reward_qris: 50000', 'status: "available",\n    reward_qris: 50000'); // only the first one
fs.writeFileSync('src/data/scenarioData.ts', content);
