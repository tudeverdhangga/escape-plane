import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { FC } from "react";
import { useFormStatus } from "react-dom";
import { deleteFlight } from "../lib/actions";

interface DeleteFlightProps {
	id: string
}

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			disabled={pending}
			type="submit"
			variant="destructive"
			size="sm"
		>
			<Trash className="mr-2 h-4 w-4" />
			Delete
		</Button>
	);
}

const DeleteFlight: FC<DeleteFlightProps> = ({ id }) => {
	const handleDelete = async () => {
		await deleteFlight(id);
	};
	
	return (
		<form action={handleDelete}>
			<SubmitButton />
		</form>
	);
}
 
export default DeleteFlight;