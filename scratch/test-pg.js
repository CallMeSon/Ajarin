const { Pool } = require("pg");

const poolerUrl = "postgresql://postgres.uxyenkrqmygzpjdmiwzo:Sontoloyo2026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
const directUrl = "postgresql://postgres.uxyenkrqmygzpjdmiwzo:Sontoloyo2026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";
// Wait, direct URL should be port 5432 and different host, or just different port.
// Let's test connection
async function test() {
  console.log("Testing Pooler URL...");
  try {
    const pool1 = new Pool({ connectionString: poolerUrl });
    const res1 = await pool1.query("SELECT 1 AS num");
    console.log("Pooler URL success:", res1.rows[0]);
    await pool1.end();
  } catch (err) {
    console.error("Pooler URL failed:", err.message);
  }

  console.log("\nTesting Direct URL...");
  try {
    const pool2 = new Pool({ connectionString: directUrl });
    const res2 = await pool2.query("SELECT 1 AS num");
    console.log("Direct URL success:", res2.rows[0]);
    await pool2.end();
  } catch (err) {
    console.error("Direct URL failed:", err.message);
  }
}

test();
