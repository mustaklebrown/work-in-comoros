'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function markNotificationAsRead(notificationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  await prisma.notification.update({
    where: {
      id: notificationId,
      userId: session.user.id, // Security check
    },
    data: {
      isRead: true,
    },
  });

  revalidatePath('/dashboard/candidate');
  revalidatePath('/dashboard/recruiter');
}

export async function markAllNotificationsAsRead() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  revalidatePath('/dashboard/candidate');
  revalidatePath('/dashboard/recruiter');
}
