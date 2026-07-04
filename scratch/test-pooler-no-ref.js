const { Pool } = require("pg");

const url = "postgresql://postgres:Sontoloyo2026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";

async function test() {
  console.log("Testing URL without project ref prefix...");
  try {
    const pool = new Pool({ connectionString: url, connectionTimeoutMillis: 5000 });
    const res = await pool.query("SELECT 1 AS num");
    console.log("Success:", res.rows[0]);
    await pool.end();
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

test();
