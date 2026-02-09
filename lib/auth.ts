import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { authConfig } from "./auth.config";
import { rateLimit } from "./rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user?.id) {
        token.id = user.id;
        token.tokenVersion = (user as { tokenVersion?: number }).tokenVersion ?? 0;
      }

      // Server-only: re-validate tokenVersion to catch password resets
      if (trigger !== "signIn" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { tokenVersion: true },
        });
        if (!dbUser || dbUser.tokenVersion !== token.tokenVersion) {
          return { ...token, id: null };
        }
      }

      return token;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        // Rate limit login attempts by email to prevent brute-force
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const ip =
          (request instanceof Request
            ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
            : undefined) || "unknown";

        const { success } = rateLimit(`login:${ip}`, {
          maxRequests: 10,
          windowMs: 15 * 60 * 1000, // 10 attempts per 15 minutes
        });
        if (!success) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          tokenVersion: user.tokenVersion,
        };
      },
    }),
  ],
});
