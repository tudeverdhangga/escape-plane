import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

async function main() {
	const userFeed = await prisma.user.create({
		data: {
			name: "Admin",
			email: "admin@gmail.com",
			role: "ADMIN",
			password: bcrypt.hashSync("admin123", 10),
		}
	})

	console.log({ userFeed })
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})