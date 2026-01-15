import { PrismaClient } from '@/app/prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, PoolConfig } from 'pg';

/**
 * Configure PostgreSQL connection pool with sensible defaults for serverless.
 */
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 10, // Limit connections in serverless to prevent exhaustion
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

// Fix SSL warning for Neon/Postgres - verify-full is safer for production
if (poolConfig.connectionString) {
  if (!poolConfig.connectionString.includes('sslmode=')) {
    poolConfig.connectionString +=
      (poolConfig.connectionString.includes('?') ? '&' : '?') +
      'sslmode=verify-full';
  } else {
    poolConfig.connectionString = poolConfig.connectionString.replace(
      /sslmode=(require|prefer|verify-ca)/,
      'sslmode=verify-full'
    );
  }
}

const pool = new Pool(poolConfig);
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
