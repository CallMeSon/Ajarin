const bcrypt = require("bcryptjs");

const hash = "$2b$10$GZ.YXS9bwJCrqSdrjwYCCOil.k7etL7x1w2QxTgtSC/Ejf7sVe4xS";
const passwords = ["admin", "password", "123456", "admin123", "password123", "Sontoloyo2026"];

async function test() {
  for (const pw of passwords) {
    const valid = await bcrypt.compare(pw, hash);
    console.log(`Testing '${pw}': ${valid}`);
  }
}

test();
