import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import FormUser from "../components/form-user";

export default function CreateUserPage() {
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
					<h1 className="text-3xl font-bold">Tambah User Baru</h1>
					<p className="text-gray-600">Buat akun pengguna atau admin baru</p>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<FormUser type="add" />
			</div>
		</div>
	);
}
