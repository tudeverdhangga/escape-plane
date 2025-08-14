"use server"

import { cookies } from "next/headers";
import { getUser, lucia } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logout(): Promise<void> {
	const { session } = await getUser()

	if (!session) {
		redirect("/dashboard/signin");
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	(await cookies()).set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes
	);

	redirect("/dashboard/signin");	
}