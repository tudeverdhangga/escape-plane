"use server";

import prisma from "~/lib/prisma";

interface CityFilter {
	departureCity: { departureCity: string }[];
	destinationCity: { destinationCity: string }[];
}

export const getCityFilter = async (): Promise<CityFilter> => {
	try {
		const departureCity = await prisma.flight.groupBy({
			by: ["departureCity"],
			where: {
				departureDate: {
					gt: new Date(),
				},
			}
		});
		const destinationCity = await prisma.flight.groupBy({
			by: ["destinationCity"],
			where: {
				departureDate: {
					gt: new Date(),
				},
			}
		});

		return { departureCity, destinationCity };
	} catch (error) {
		console.log(error);
		return { departureCity: [], destinationCity: [] };
	}
};

export const getAirplanes = async () => {
	try {
		const data = await prisma.airplane.findMany({
			where: {
				flight: {
					every: {
						id: undefined,
					},
				},
			},
		});

		return data;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getFlightById = async (id: string) => {
	try {
		const data = await prisma.flight.findFirst({
			where: {
				id: id,
			},
			include: {
				seats: {
					orderBy: {
						seatNumber: "asc",
					},
				},
				plane: true,
			},
		});

		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
