import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { polar, checkout, portal } from "@polar-sh/better-auth"
import { db } from "@/db"; 
import * as schema from "@/db/schema";
import { polarClient } from  "./polar"
 

export const auth = betterAuth({
    trustHost: true, // ✅ REQUIRED for correct callback URL validation
    useSecureCookies: true, // ✅ REQUIRED for iOS Safari cookie handling
    // iOS OAuth configuration
    baseURL: process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
    // Enable PKCE for OAuth flows (Better Auth handles this by default)
    // Ensure production OAuth endpoints are used
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    authenticatedUsersOnly: true,
                    successUrl: "/upgrade",
                }),
                portal(),
            ]
        })
    ],
    socialProviders: {
        google: {
            prompt: "select_account", 
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            // Ensure production endpoints (not sandbox)
            // Better Auth will use production endpoints by default
            scope: ["openid", "profile", "email"],
        },
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            // Production GitHub OAuth endpoints
            scope: ["read:user", "user:email"],
        }, 
    },
    emailAndPassword: {  
        enabled: true
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    // Session configuration for iOS
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
});

