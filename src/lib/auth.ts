import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, Session, User } from "lucia";
import prisma from "~/lib/prisma";
import { RoleUser } from "@/generated/prisma";
import { cache } from "react";
import { cookies } from "next/headers";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production",
		}
	},
	getUserAttributes: (attributes) => {
		return {
			name: attributes.name,
			email: attributes.email,
			role: attributes.role,
			passport: attributes.passport
		};
	}
})

export const getUser = cache(async (): Promise<{ user: User | null; session: Session | null }> => {
	const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
	
	if (!sessionId) return {
		user: null,
		session: null
	};
	
	const result = await lucia.validateSession(sessionId);
	
	try {
		if (result.session && result.session.fresh) {
			const sessionCookie = lucia.createSessionCookie(result.session.id);
			(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
		if (!result.session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
	} catch {
		// Next.js throws error when attempting to set cookies when rendering page
	}
	return result;
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: {
			name: string
			email: string
			role: RoleUser
			passport: string | null
		}
	}
}