import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ password: z.string().min(1) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { password } = parsedCredentials.data;
          const accessPassword = process.env.ACCESS_PASSWORD;
          
          // Simple string comparison for the single access password
          // Note: In a real app, you might want to hash this too, but for simple access, string compare is fine if the env var is secure.
          if (accessPassword && password === accessPassword) {
             return {
                id: '1',
                name: 'Admin',
                email: 'admin@local',
             };
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
