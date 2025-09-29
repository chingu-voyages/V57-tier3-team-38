import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import axios from "axios";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization:
        "https://github.com/login/oauth/authorize?scope=read:user user:email&prompt=login",
    }),    
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },  
  events: {
    async signOut({ token }) {
      if (!token?.accessToken) return;
      try {
        await axios.delete(
          `https://api.github.com/applications/${process.env.GITHUB_ID}/token`,
          {
            auth: {
              username: process.env.GITHUB_ID!,
              password: process.env.GITHUB_SECRET!,
            },
            data: { access_token: token.accessToken },
          }
        );
        console.log("Revoked GitHub token on sign-out");
      } catch (err) {
        console.error("Failed to revoke GitHub token", err);
      }
    },
  },
});
