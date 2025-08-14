import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import FormUser from "../../components/form-user";
import { getUserById } from "../../lib/data";

interface EditUserPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
	const { id } = await params;
	const user = await getUserById(id);

	if (!user) {
		notFound();
	}

	return (
		<div className="max-w-4xl mx-auto md:p-6 2xl:p-10">
			<div className="mb-6 flex items-center gap-4">
				<Button variant="outline" size="sm" asChild>
					<Link href="/dashboard/users">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Kembali
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold">Edit User</h1>
					<p className="text-gray-600">Perbarui informasi user {user.name}</p>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<FormUser 
					type="edit" 
					defaultValues={{
						id: user.id,
						name: user.name,
						email: user.email,
						passport: user.passport,
						role: user.role,
					}}
				/>
			</div>
		</div>
	);
}
