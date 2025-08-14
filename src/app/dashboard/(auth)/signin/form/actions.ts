"use server"

import { redirect } from "next/navigation";
import { formSchema } from "./validation";
import bcrypt from 'bcrypt';
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import prisma from "~/lib/prisma";

export interface ActionResult {
	errorTitle: string | null;
	errorDesc: string[] | null;
}

export async function handleSignIn(formData: FormData): Promise<ActionResult> {
	const values = formSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!values.success) {
		return {
			errorTitle: "Invalid form data",
			errorDesc: values.error.issues.map(issue => issue.message) || [],
		};
	}

	const isExistingUser = await prisma.user.findFirst({
		where: {
			email: values.data.email,
		},
	});
	if (!isExistingUser) {
		return {
			errorTitle: "User not found",
			errorDesc: ["The email address you entered does not match any account."],
		};
	}

	const validPassword = await bcrypt.compare(values.data.password, isExistingUser.password);
	if (!validPassword) {
		return {
			errorTitle: "Invalid credentials",
			errorDesc: ["The password you entered is incorrect."],
		};
	}

	const session = await lucia.createSession(isExistingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	const cookieStore = await cookies();
	cookieStore.set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes
	);

	return redirect("/dashboard");
}