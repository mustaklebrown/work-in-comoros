import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Role } from '@/app/prisma/generated/client';

/**
 * Standard server action response interface
 */
export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

/**
 * Higher-order function to handle server action errors and typical authentication logic
 */
export async function createSafeAction<T>(
  logic: (user?: any) => Promise<T>,
  options?: {
    requireAuth?: boolean;
    requiredRole?: Role;
  }
): Promise<ActionResponse<T>> {
  try {
    let user = null;

    if (options?.requireAuth || options?.requiredRole) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session || !session.user) {
        return { success: false, error: 'Authentication required' };
      }

      user = session.user as any;

      if (options.requiredRole && (user as any).role !== options.requiredRole) {
        return { success: false, error: 'Unauthorized access' };
      }
    }

    const result = await logic(user);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Action error:', error);
    return {
      success: false,
      error:
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : error.message || 'Unknown error',
    };
  }
}
