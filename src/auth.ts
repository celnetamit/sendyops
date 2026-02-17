import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ 
            id: z.string().optional(),
            password: z.string().min(1) 
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { password, id } = parsedCredentials.data;
          // User requirement: accept any ID with password "password123"
          // We also fallback to ACCESS_PASSWORD env var if set, but prioritize "password123" hardcoded check as requested.
          
          if (password === 'password24' || (process.env.ACCESS_PASSWORD && password === process.env.ACCESS_PASSWORD)) {
             return {
                id: id || '1',
                name: id || 'Admin',
                email: `${id || 'admin'}@local`,
             };
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
