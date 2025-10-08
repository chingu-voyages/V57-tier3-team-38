import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      // Request classic repo scope so we can list private repos/PRs
      authorization: { params: { scope: "read:user repo" } },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, user }): Promise<JWT> {
      // On first sign-in, persist the OAuth access token in the JWT
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.tokenType = account.token_type ?? "bearer";
      }
      // optional niceties
      if (user?.name) token.name = user.name;
      if (user?.email) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      // Expose the access token on the server only; don’t ship it to the client anywhere else
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  // required in dev when running behind http://localhost:3000
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
