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
          console.log("Processing Facebook profile:", JSON.stringify(profile, null, 2));
          
          if (!profile.email) {
            console.error("Facebook profile missing email:", profile);
            throw new Error("Email not provided by Facebook");
          }
          
          return {
            id: profile.id,
            username: profile.name,
            email: profile.email,
            image: profile.picture?.data?.url,
            emailVerified: new Date(),
          };
        } catch (error) {
          console.error("Error processing Facebook profile:", error);
          throw error;
        }
      },
      checks: ["state"],
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