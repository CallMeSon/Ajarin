const { Pool } = require('pg');

async function checkConnection(url, name) {
  const pool = new Pool({ connectionString: url });
  try {
    const res = await pool.query('SELECT 1 as val');
    console.log(`[SUCCESS] ${name}`);
    return true;
  } catch (err) {
    console.log(`[FAILED] ${name} - ${err.message}`);
    return false;
  } finally {
    await pool.end();
  }
}

async function main() {
  const p = "Sontoloyo2026";
  const ref = "uxyenkrqmygzpjdmiwzo";

  const urls = [
    { name: "Original Transaction (postgres.ref)", url: `postgresql://postgres.${ref}:${p}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` },
    { name: "Original Session (postgres.ref)", url: `postgresql://postgres.${ref}:${p}@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres` },
    { name: "No Ref Transaction", url: `postgresql://postgres:${p}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` },
    { name: "No Ref Session", url: `postgresql://postgres:${p}@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres` },
    { name: "Direct IPv4", url: `postgresql://postgres:${p}@db.${ref}.supabase.co:5432/postgres` },
  ];

  for (const item of urls) {
    await checkConnection(item.url, item.name);
  }
}

main();
