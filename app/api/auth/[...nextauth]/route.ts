import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import db from "@/config/db"
import { ExtendedProfile, User } from "@/types"
import { setCookie } from "@/app/actions"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }): Promise<any> {
      const user: User | any = (await db.query(`SELECT * FROM users WHERE id = $1`, [token.sub])).rows[0]
      session.user = user
      await setCookie(user.id)
      return session
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === 'google' && profile) {
        const userProfile = profile as ExtendedProfile
        await db.query(`INSERT INTO users (id, name, email, image) 
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO NOTHING;`, [userProfile.sub, userProfile.name, userProfile.email, userProfile.picture])
        token.id = userProfile.sub
      }
      return token
    },
  },
})

export { handler as GET, handler as POST }
