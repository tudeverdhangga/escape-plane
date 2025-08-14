import { FC } from "react";
import FormFlight from "../components/form-flight";
import { getAirplanes } from "../../airplanes/lib/data";

const CreateFlightPage: FC = async () => {
	const airplanes = await getAirplanes()

	return (
		<div>
			<div className="flex flex-row items-center justify-between">
				<div className="my-5 text-2xl font-bold">Tambah Data Flights</div>
			</div>
			
			<FormFlight type="add" airplanes={airplanes} />
		</div>
	);
}

export default CreateFlightPage;
