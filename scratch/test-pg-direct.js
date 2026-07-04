const { Pool } = require("pg");

const directUrl = "postgresql://postgres:Sontoloyo2026@db.uxyenkrqmygzpjdmiwzo.supabase.co:5432/postgres";

async function test() {
  console.log("Testing Direct Postgres URL...");
  try {
    const pool = new Pool({ connectionString: directUrl });
    const res = await pool.query("SELECT 1 AS num");
    console.log("Direct URL success:", res.rows[0]);
    await pool.end();
  } catch (err) {
    console.error("Direct URL failed:", err.message);
  }
}

test();
