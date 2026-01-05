import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // Vercel과 같은 서버리스 환경에서 호스트 자동 감지
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        const user = session.user as {
          id: string;
          name?: string | null;
          email?: string | null;
          image?: string | null;
        };
        user.id = token.id as string;
        user.name = token.name ?? null;
        user.email = token.email ?? null;
        user.image = token.image ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

