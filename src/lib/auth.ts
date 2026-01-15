import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'CANDIDATE',
      },
      companyId: {
        type: 'string',
        required: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache for 5 minutes
    },
  },
  trustedOrigins: [
    'http://localhost:3000',
    // Allow local network access for testing
    'http://192.168.1.84:3000',
    // Production domains
    'https://work-in-comoros.km',
    'https://work-in-comoros.vercel.app',
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean) as string[],
});
