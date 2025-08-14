"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC, useActionState } from "react";
import { saveAirplane, updateAirplane } from "../lib/actions";
import type { ActionResult } from "@/app/dashboard/(auth)/signin/form/actions";
import type { Airplane } from "@prisma/client";
import SubmitFormButton from "../../components/submit-form-button";

interface FormAirplaneProps {
	type?: "add" | "edit";
	defaultValues?: Airplane;
}

const initialFormState: ActionResult = {
	errorTitle: null,
	errorDesc: [],
}

const FormAirplane: FC<FormAirplaneProps> = ({ type, defaultValues }) => {
	const updateAirplaceWithId = (_state: ActionResult, formData: FormData) => {
		if (!defaultValues?.id) throw new Error("ID is required for update");
		return updateAirplane(defaultValues.id, formData);
	}
	const saveAirplaneWithState = (_state: ActionResult, formData: FormData) => {
		return saveAirplane(formData);
	}
	const [state, formAction] = useActionState(type === "edit" ? updateAirplaceWithId : saveAirplaneWithState, initialFormState)

	return (
		<div className="w-[40%]">
			{state.errorTitle && (
				<div className="mx-auto my-7 bg-red-500 text-white rounded-lg text-center">
					<h3>{state.errorTitle}</h3>
					<ul className="list-disc list-inside">
						{state.errorDesc?.map((desc, index) => (
							<li key={index}>{desc}</li>
						))}
					</ul>
				</div>
			)}
			<form className="space-y-4" action={formAction}>
				<div className="space-y-2">
					<Label htmlFor="code">Kode Pesawat</Label>
					<Input
						id="code"
						required
						placeholder="Masukkan kode pesawat"
						name="code"
						defaultValue={defaultValues?.code || ""}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="name">Name Pesawat</Label>
					<Input
						id="name"
						required
						placeholder="Masukkan nama pesawat"
						name="name"
						defaultValue={defaultValues?.name || ""}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="image">Upload Foto</Label>
					<Input
						id="image"
						required
						placeholder="Upload foto"
						name="image"
						type="file"
					/>
				</div>
				<SubmitFormButton />
			</form>
		</div>
	)
}

export default FormAirplane;