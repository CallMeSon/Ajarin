const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Manually parse .env.local
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = env.match(/DATABASE_URL="([^"]+)"/);
if (dbUrlMatch) {
  process.env.DATABASE_URL = dbUrlMatch[1];
} else {
  const dbUrlMatch2 = env.match(/DATABASE_URL=([^\n]+)/);
  if (dbUrlMatch2) process.env.DATABASE_URL = dbUrlMatch2[1];
}

const prisma = new PrismaClient();

async function main() {
  const users = [
    { username: 'admin', email: 'admin@ajarin.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { username: 'mentee', email: 'mentee@ajarin.com', password: 'mentee123', role: 'mentee', name: 'Mentee User' },
    { username: 'mentor', email: 'mentor@ajarin.com', password: 'mentor123', role: 'mentor', name: 'Mentor User' }
  ];

  console.log('Seeding users into', process.env.DATABASE_URL.substring(0, 30) + '...');
  
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        email: u.email,
        passwordHash: passwordHash,
        role: u.role,
        name: u.name,
        onboardingCompleted: true
      }
    });
    console.log(`Created user: ${u.username}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
