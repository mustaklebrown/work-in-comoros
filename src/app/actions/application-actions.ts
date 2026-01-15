'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ApplicationStatus, Role } from '@/app/prisma/generated/client';
import { createSafeAction } from '@/lib/safe-action';

export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
  interviewDate?: Date
) =>
  createSafeAction(
    async (user) => {
      // 2. Verify Application Ownership
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true },
      });

      if (!application || application.job.companyId !== user.companyId) {
        throw new Error('Unauthorized: You cannot manage this application.');
      }

      // 3. Update status and interview date
      const updatedApp = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status,
          ...(interviewDate && { interviewDate }),
        },
        include: { job: true },
      });

      // 4. Create Notification for Candidate
      let notificationTitle = 'Mise à jour de candidature';
      let notificationMessage = `Votre candidature pour le poste "${updatedApp.job.title}" a été mise à jour.`;
      let type = 'APPLICATION_UPDATE';

      if (status === 'INTERVIEW' && interviewDate) {
        notificationTitle = 'Entretien Planifié !';
        notificationMessage = `Un entretien a été programmé pour le poste "${
          updatedApp.job.title
        }" le ${interviewDate.toLocaleString('fr-FR')}.`;
        type = 'INTERVIEW_SCHEDULED';
      }

      await prisma.notification.create({
        data: {
          userId: updatedApp.userId,
          title: notificationTitle,
          message: notificationMessage,
          type: type,
        },
      });

      // 5. Revalidate paths
      revalidatePath('/dashboard/recruiter/applications');
      revalidatePath('/dashboard/recruiter');
      return updatedApp;
    },
    { requiredRole: Role.RECRUITER }
  );

export const applyToJob = async (jobId: string) =>
  createSafeAction(
    async (user) => {
      // Optional: Check if already applied
      const existing = await prisma.application.findFirst({
        where: {
          jobId: jobId,
          userId: user.id,
        },
      });

      if (existing) {
        throw new Error('Vous avez déjà postulé à cette offre.');
      }

      const application = await prisma.application.create({
        data: {
          jobId: jobId,
          userId: user.id,
          status: 'PENDING',
        },
      });

      revalidatePath(`/jobs/${jobId}`);
      revalidatePath('/dashboard/recruiter/applications');
      return application;
    },
    { requireAuth: true }
  );
