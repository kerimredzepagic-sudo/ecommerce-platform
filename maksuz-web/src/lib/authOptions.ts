import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Call our backend to create/authenticate user
          const response = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              email: user.email,
              firstName: user.name?.split(" ")[0] || "User",
              lastName: user.name?.split(" ").slice(1).join(" ") || "",
              avatarUrl: user.image,
            }),
          });

          if (!response.ok) {
            console.error("Backend auth failed:", await response.text());
            return false;
          }

          const data = await response.json();
          
          // Store tokens and user data in the user object for JWT callback
          (user as any).backendData = {
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            user: data.data.user,
            isNewUser: data.data.isNewUser,
            profileCompleted: data.data.profileCompleted,
          };

          return true;
        } catch (error) {
          console.error("Google auth error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        const backendData = (user as any).backendData;
        if (backendData) {
          return {
            ...token,
            accessToken: backendData.accessToken,
            refreshToken: backendData.refreshToken,
            user: backendData.user,
            isNewUser: backendData.isNewUser,
            profileCompleted: backendData.profileCompleted,
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Pass backend data to the session
      if (token) {
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
        (session as any).backendUser = token.user;
        (session as any).isNewUser = token.isNewUser;
        (session as any).profileCompleted = token.profileCompleted;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to complete-profile if new user hasn't completed profile
      // The actual redirect logic is handled client-side after session check
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

