'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { z } from 'zod';
import { Role } from '@/app/prisma/generated/client';

const companySchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  sector: z.string().min(2, 'Le secteur est requis'),
  nif: z.string().optional(),
  rc: z.string().optional(),
});

export async function createCompany(data: z.infer<typeof companySchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== Role.RECRUITER) {
    throw new Error('Seuls les recruteurs peuvent créer une entreprise.');
  }

  if (user.companyId) {
    throw new Error('Vous êtes déjà rattaché à une entreprise.');
  }

  const company = await prisma.company.create({
    data: {
      ...data,
      recruiters: {
        connect: { id: user.id },
      },
    },
  });

  revalidatePath('/dashboard/recruiter');
  revalidatePath('/dashboard/settings');

  return company;
}

export async function updateCompany(
  companyId: string,
  data: z.infer<typeof companySchema>
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.companyId !== companyId) {
    throw new Error(
      "Vous n'avez pas l'autorisation de modifier cette entreprise."
    );
  }

  const company = await prisma.company.update({
    where: { id: companyId },
    data: data,
  });

  revalidatePath('/dashboard/settings');
  return company;
}
