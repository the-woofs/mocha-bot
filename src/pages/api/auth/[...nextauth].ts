import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions ={
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: { params: { scope: "identify" } },
      profile: (profile) => {
        let userAvatar = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
        return {
          id: profile.id,
          snowflake: profile.id,
          name: profile.username,
          image: userAvatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.userId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // Add property to session, like an access_token from a provider.
      session.user.id = token.userId;
      return session;
    },
  },
};

export default NextAuth(authOptions)