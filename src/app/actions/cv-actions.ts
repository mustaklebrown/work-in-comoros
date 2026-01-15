'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSafeAction } from '@/lib/safe-action';

const cvSchema = z.object({
  headline: z.string().optional(),
  summary: z.string().optional(),
  skills: z.string().optional(),
  location: z.string().optional(),
  experience: z.array(z.any()).optional(),
  education: z.array(z.any()).optional(),
});

export const updateCVProfile = async (data: z.infer<typeof cvSchema>) =>
  createSafeAction(
    async (user) => {
      const result = await prisma.user.update({
        where: { id: user.id },
        data: {
          headline: data.headline,
          summary: data.summary,
          skills: data.skills,
          location: data.location,
          experience: data.experience || [],
          education: data.education || [],
        },
      });

      revalidatePath('/dashboard/settings');
      revalidatePath('/dashboard/candidate');
      return result;
    },
    { requireAuth: true }
  );
