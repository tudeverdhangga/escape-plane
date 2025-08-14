"use server"

import prisma from "~/lib/prisma"

export async function getUsers() {
	try {
		const users = await prisma.user.findMany({
			where: {
				role: "CUSTOMER"
			},
			select: {
				id: true,
				name: true,
				email: true,
				passport: true,
				role: true,
			},
			orderBy: {
				name: 'asc',
			}
		});
		return users;
	} catch (error) {
		console.error("Error fetching users:", error);
		return [];
	}
}

export async function getUserById(id: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				passport: true,
			},
		});
		return user;
	} catch (error) {
		console.error("Error fetching user:", error);
		return null;
	}
}
