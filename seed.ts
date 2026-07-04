require('dotenv').config({ path: '.env.local' });
import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const users = [
    { username: 'admin', email: 'admin@ajarin.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { username: 'mentee', email: 'mentee@ajarin.com', password: 'mentee123', role: 'mentee', name: 'Mentee User' },
    { username: 'mentor', email: 'mentor@ajarin.com', password: 'mentor123', role: 'mentor', name: 'Mentor User' }
  ];

  console.log('Seeding users...');
  
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
    process.exit(0);
  });
