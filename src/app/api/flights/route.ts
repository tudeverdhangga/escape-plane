import type { NextRequest } from "next/server";
import prisma from "~/lib/prisma";
import type { TypeSeat } from "@/generated/prisma";

export async function POST(request: NextRequest) {
	const body = await request.json();

	let departureDate: Date | null = null;

	if (body.date) {
		departureDate = new Date(body.date);
		departureDate.setHours(1);
	}
	try {
		const data = await prisma.flight.findMany({
			where: {
				departureCity: body.departure !== null ? body.departure : {},
				destinationCity: body.arrival !== null ? body.arrival : {},
				seats:
					body.seat !== null
						? {
								some: {
									type: body.seat as TypeSeat,
									isBooked: false,
								},
						  }
						: {},
				departureDate:
					departureDate !== null
						? {
								gte: departureDate,
						  }
						: {},
				planeId:
					body.planeIds.length > 0
						? {
								in: body.planeIds,
						  }
						: {},
			},
			include: {
				plane: true,
			},
		});

		const serializedData = data.map(flight => ({
			...flight,
			price: flight.price.toString(),
		}));

		return Response.json({ data: serializedData });
	} catch (error) {
		console.error("🚀 ~ POST ~ error:", error);
		return Response.json(
			{
				error: true,
				error_message: "Failed to get data",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
