import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ExtendedProfile, User } from "@shared/types";
import ProfileImageResizer from "@/utils/profile-image-resizer";
import supabase from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }): Promise<any> {
      const { data, error } = await supabase.from("users").select("*").eq("id", token.sub).single()
      if (!error) {
        session.user = data;
      }
      session.user.image = await ProfileImageResizer(session.user.image!);
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === 'google' && profile) {
        const userProfile = profile as ExtendedProfile;
        await supabase.from("users").upsert({
          id: userProfile.sub,
          name: userProfile,
          email: userProfile.email,
          image: userProfile.picture
        }, { onConflict: 'id', ignoreDuplicates: true })
      }
      return token;
    },
  },
  session: {
    strategy: "jwt"
  },
};