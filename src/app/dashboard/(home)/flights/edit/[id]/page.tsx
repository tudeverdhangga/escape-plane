import { FC } from "react";
import FormFlight from "../../components/form-flight";
import { getAirplanes } from "../../../airplanes/lib/data";
import { getFlightById } from "../../lib/actions";

type Params = {
	id: string;
}

interface EditFlightPageProps {
	params: Promise<Params>;
}

const EditFlightPage: FC<EditFlightPageProps> = async ({ params }) => {
	const { id } = await params;
	const data = await getFlightById(id);
	const airplanes = await getAirplanes()

	return (
		<div>
			<div className="flex flex-row items-center justify-between">
				<div className="my-5 text-2xl font-bold">Edit Data Flight</div>
			</div>

			<FormFlight
				type="edit"
				defaultValues={data}
				airplanes={airplanes}
			/>
		</div>
	)
}

export default EditFlightPage;