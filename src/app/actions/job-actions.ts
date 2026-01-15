'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ContractType, Island, Role } from '@/app/prisma/generated/client';
import { createSafeAction } from '@/lib/safe-action';

const jobSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(50),
  locationIsland: z.nativeEnum(Island),
  locationCity: z.string().min(2),
  contractType: z.nativeEnum(ContractType),
  salaryKMF: z.string().optional(),
});

const revalidateJobPaths = () => {
  revalidatePath('/dashboard/recruiter/jobs');
  revalidatePath('/dashboard/recruiter');
  revalidatePath('/jobs');
};

export const createJob = async (formData: z.infer<typeof jobSchema>) =>
  createSafeAction(
    async (user) => {
      const result = await prisma.job.create({
        data: {
          title: formData.title,
          description: formData.description,
          locationIsland: formData.locationIsland,
          locationCity: formData.locationCity,
          contractType: formData.contractType,
          salaryKMF: formData.salaryKMF ? parseFloat(formData.salaryKMF) : null,
          companyId: user.companyId!,
        },
      });
      revalidateJobPaths();
      return result;
    },
    { requiredRole: Role.RECRUITER }
  );

export const deleteJob = async (jobId: string) =>
  createSafeAction(
    async (user) => {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { companyId: true },
      });

      if (!job || job.companyId !== user.companyId) {
        throw new Error('Unauthorized or job not found');
      }

      await prisma.job.delete({ where: { id: jobId } });
      revalidateJobPaths();
    },
    { requiredRole: Role.RECRUITER }
  );

export const updateJob = async (
  jobId: string,
  formData: z.infer<typeof jobSchema>
) =>
  createSafeAction(
    async (user) => {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { companyId: true },
      });

      if (!job || job.companyId !== user.companyId) {
        throw new Error('Unauthorized or job not found');
      }

      const result = await prisma.job.update({
        where: { id: jobId },
        data: {
          title: formData.title,
          description: formData.description,
          locationIsland: formData.locationIsland,
          locationCity: formData.locationCity,
          contractType: formData.contractType,
          salaryKMF: formData.salaryKMF ? parseFloat(formData.salaryKMF) : null,
        },
      });
      revalidateJobPaths();
      return result;
    },
    { requiredRole: Role.RECRUITER }
  );
