import path from "node:path";
import fs from "node:fs";
import { defineConfig } from "prisma/config";

// Load environment variables from .env.local untuk Prisma CLI
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile(envPath);
  }
}

// Prisma v7 memisahkan konfigurasi datasource dari schema.prisma
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
