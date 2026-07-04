const { Pool } = require("pg");

const regions = [
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-southeast-3",
  "us-east-1",
  "eu-west-1",
];

async function test() {
  for (const region of regions) {
    const url = `postgresql://postgres.uxyenkrqmygzpjdmiwzo:Sontoloyo2026@aws-0-${region}.pooler.supabase.com:6543/postgres`;
    console.log(`\nTesting ${region}...`);
    try {
      const pool = new Pool({ connectionString: url, connectionTimeoutMillis: 5000 });
      const res = await pool.query("SELECT 1 AS num");
      console.log(`Success on ${region}!`);
      await pool.end();
      return; // Stop on first success
    } catch (err) {
      console.error(`Failed on ${region}:`, err.message);
    }
  }
}

test();
