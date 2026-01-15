import prisma from '@/lib/prisma';
import {
  PrismaClient,
  Role,
  Island,
  ContractType,
  ApplicationStatus,
} from '../src/app/prisma/generated/client/client';

async function main() {
  console.log('🌱 Starting seeding...');

  // Optional: Clean up database
  // await prisma.application.deleteMany();
  // await prisma.job.deleteMany();
  // await prisma.company.deleteMany();
  // await prisma.user.deleteMany();

  // 1. Create a Company
  const comoresTelecom = await prisma.company.create({
    data: {
      name: 'Comores Telecom',
      sector: 'Télécommunications',
      nif: '123456789',
      rc: 'RC-MOR-2024-001',
      isVerified: true,
    },
  });

  const huri = await prisma.company.create({
    data: {
      name: 'Huri Money',
      sector: 'Fintech',
      nif: '987654321',
      rc: 'RC-MOR-2024-002',
      isVerified: true,
    },
  });

  console.log('🏢 Companies created');

  // 2. Create Users (Recruiter & Candidates)
  const recruiter = await prisma.user.create({
    data: {
      email: 'recruteur@comorestelecom.km',
      name: 'Moussa Larifou',
      role: Role.RECRUITER,
      companyId: comoresTelecom.id,
      phone: '+2693330000',
      phoneVerified: true,
    },
  });

  const candidate1 = await prisma.user.create({
    data: {
      email: 'ali.soilihi@email.km',
      name: 'Ali Soilihi',
      role: Role.CANDIDATE,
      phone: '+2693331111',
    },
  });

  const candidate2 = await prisma.user.create({
    data: {
      email: 'fatima.mze@email.km',
      name: 'Fatima Mze',
      role: Role.CANDIDATE,
      phone: '+2693332222',
    },
  });

  const candidate3 = await prisma.user.create({
    data: {
      email: 'karim.ibrahim@email.km',
      name: 'Karim Ibrahim',
      role: Role.CANDIDATE,
      phone: '+2693333333',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@workincomoros.km',
      name: 'Super Admin',
      role: Role.ADMIN,
      phone: '+2693339999',
      phoneVerified: true,
    },
  });

  console.log('👥 Users created');

  // 3. Create Jobs
  const jobDev = await prisma.job.create({
    data: {
      title: 'Développeur Fullstack React',
      description:
        'Nous recherchons un développeur expérimenté en React et Node.js pour rejoindre notre équipe à Moroni.',
      locationIsland: Island.GRANDE_COMORE,
      locationCity: 'Moroni',
      contractType: ContractType.CDI,
      salaryKMF: 450000,
      companyId: comoresTelecom.id,
    },
  });

  const jobComptable = await prisma.job.create({
    data: {
      title: 'Comptable Junior',
      description: 'Tenue de la comptabilité générale et analytique.',
      locationIsland: Island.ANJOUAN,
      locationCity: 'Mutsamudu',
      contractType: ContractType.CDD,
      salaryKMF: 150000,
      companyId: huri.id,
    },
  });

  const jobChauffeur = await prisma.job.create({
    data: {
      title: 'Chauffeur-Livreur',
      description: 'Livraison de colis dans la région de Fomboni.',
      locationIsland: Island.MOHELI,
      locationCity: 'Fomboni',
      contractType: ContractType.PRESTATION,
      salaryKMF: 80000,
      companyId: comoresTelecom.id,
    },
  });

  console.log('💼 Jobs created');

  // 4. Create Applications
  await prisma.application.create({
    data: {
      status: ApplicationStatus.PENDING,
      userId: candidate1.id,
      jobId: jobDev.id,
    },
  });

  await prisma.application.create({
    data: {
      status: ApplicationStatus.INTERVIEW,
      userId: candidate2.id,
      jobId: jobDev.id,
    },
  });

  await prisma.application.create({
    data: {
      status: ApplicationStatus.REJECTED,
      userId: candidate3.id,
      jobId: jobChauffeur.id,
    },
  });

  await prisma.application.create({
    data: {
      status: ApplicationStatus.ACCEPTED,
      userId: candidate1.id,
      jobId: jobChauffeur.id, // Ali applied to both? Why not.
    },
  });

  console.log('📄 Applications created');
  console.log('✅ Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
