import { getUserByEmail } from "@/components/auth/user";
import { LoginSchema } from "@/components/auth/validation";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          username: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: new Date(),
        };
      },
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "email public_profile"
        }
      },
      profile(profile) {
        try {
          console.log("Facebook profile data:", JSON.stringify(profile, null, 2));
          
          const email = profile.email || `${profile.id}@facebook.com`;
          
          const imageUrl = profile.picture?.data?.url || 
                          profile.picture || 
                          `https://graph.facebook.com/${profile.id}/picture?type=large`;
          
          return {
            id: profile.id,
            username: profile.name || profile.username || 'Facebook User',
            email: email,
            image: imageUrl,
            emailVerified: new Date(),
          };
        } catch (error) {
          console.error("Facebook profile processing error:", error);
          console.error("Original profile data:", JSON.stringify(profile));
          
          return {
            id: profile.id || Math.random().toString(36).substring(2),
            username: 'Facebook User',
            email: `${Date.now()}@temporary.com`,
            emailVerified: new Date(),
          };
        }
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password,
          );

          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ],
} satisfies NextAuthConfig