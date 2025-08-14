"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
	Select, 
	SelectContent, 
	SelectItem, 
	SelectTrigger, 
	SelectValue 
} from '@/components/ui/select';
import React, { FC } from 'react';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { useActionState } from "react";
import { saveUser, updateUser } from '../lib/actions';
import type { ActionResult } from "@/app/dashboard/(auth)/signin/form/actions";
import type { RoleUser } from "@/generated/prisma";

interface FormUserProps {
	type?: "add" | "edit";
	defaultValues?: {
		id?: string;
		name?: string;
		email?: string;
		passport?: string | null;
		role?: RoleUser;
	};
}

const initialFormState: ActionResult = {
	errorTitle: null,
	errorDesc: [],
}

const SubmitButton: FC<{ type?: "add" | "edit" }> = ({ type }) => {
	const { pending } = useFormStatus();
	
	return (
		<Button type="submit" disabled={pending}>
			{pending 
				? (type === "edit" ? "Updating..." : "Menyimpan...") 
				: (type === "edit" ? "Update User" : "Simpan User")
			}
		</Button>
	);
};

const FormUser: FC<FormUserProps> = ({ type, defaultValues }) => {
	const updateUserWithId = (_state: ActionResult, formData: FormData) => {
		if (!defaultValues?.id) throw new Error("ID is required for update");
		return updateUser(defaultValues.id, _state, formData);
	}
	const saveUserWithState = (_state: ActionResult, formData: FormData) => {
		return saveUser(_state, formData);
	}
	const [state, formAction] = useActionState(type === "edit" ? updateUserWithId : saveUserWithState, initialFormState);

	return (
		<div className="space-y-6">
			{/* Error Display */}
			{state.errorTitle && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
					<h3 className="font-medium text-red-800">{state.errorTitle}</h3>
					{state.errorDesc && state.errorDesc.length > 0 && (
						<ul className="mt-2 text-sm list-disc list-inside space-y-1">
							{state.errorDesc.map((desc: string, index: number) => (
								<li key={index}>{desc}</li>
							))}
						</ul>
					)}
				</div>
			)}

			<form action={formAction} className="space-y-6">
				<div className="grid grid-cols-2 gap-6">
					{/* Name */}
					<div className="space-y-2">
						<Label htmlFor="name">Nama Lengkap</Label>
						<Input
							id="name"
							name="name"
							placeholder="Masukkan nama lengkap"
							required
							defaultValue={defaultValues?.name}
						/>
					</div>

					{/* Email */}
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="Masukkan email"
							required
							defaultValue={defaultValues?.email}
						/>
					</div>

					{/* Password (only for create) */}
					{type === "add" && (
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Masukkan password"
								required
							/>
						</div>
					)}

					{/* Password for edit (optional) */}
					{type === "edit" && (
						<div className="space-y-2">
							<Label htmlFor="password">Password Baru (kosongkan jika tidak ingin mengubah)</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Masukkan password baru"
							/>
						</div>
					)}

					{/* Passport */}
					<div className="space-y-2">
						<Label htmlFor="passport">Nomor Paspor (Opsional)</Label>
						<Input
							id="passport"
							name="passport"
							placeholder="Masukkan nomor paspor"
							defaultValue={defaultValues?.passport || ""}
						/>
					</div>

					{/* Role */}
					<div className="space-y-2">
						<Label htmlFor="role">Role</Label>
						<Select name="role" defaultValue={defaultValues?.role || "CUSTOMER"}>
							<SelectTrigger id="role" className='w-full'>
								<SelectValue placeholder="Pilih role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="CUSTOMER">Customer</SelectItem>
								<SelectItem value="ADMIN">Admin</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end space-x-4">
					<SubmitButton type={type} />
				</div>
			</form>
		</div>
	);
};

export default FormUser;
