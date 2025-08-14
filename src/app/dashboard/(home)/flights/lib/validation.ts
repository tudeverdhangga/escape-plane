import z from "zod";

export const flightFormSchema = z.object({
	// First row: Airplane and Price
	planeId: z
		.string({ message: "Pesawat harus dipilih" })
		.min(1, { message: "Pesawat harus dipilih" }),
	price: z
		.string({ message: "Harga tiket tidak boleh kosong" })
		.refine(
			(price) => {
				const numPrice = parseFloat(price);
				return !isNaN(numPrice) && numPrice > 0;
			},
			{ message: "Harga tiket harus berupa angka positif" }
		),
	
	// Second row: Departure details
	departureCity: z
		.string({ message: "Kota keberangkatan tidak boleh kosong" })
		.min(2, { message: "Kota keberangkatan harus memiliki minimal 2 karakter" }),
	departureDate: z
		.string({ message: "Tanggal keberangkatan tidak boleh kosong" })
		.refine(
			(date) => {
				const departureDate = new Date(date);
				const now = new Date();
				return departureDate > now;
			},
			{ message: "Tanggal keberangkatan harus di masa depan" }
		),
	departureCityCode: z
		.string({ message: "Kode kota keberangkatan tidak boleh kosong" })
		.min(3, { message: "Kode kota keberangkatan harus memiliki minimal 3 karakter" })
		.max(3, { message: "Kode kota keberangkatan maksimal 3 karakter" }),

	// Third row: Arrival details
	destinationCity: z
		.string({ message: "Kota tujuan tidak boleh kosong" })
		.min(2, { message: "Kota tujuan harus memiliki minimal 2 karakter" }),
	arrivalDate: z
		.string({ message: "Tanggal kedatangan tidak boleh kosong" }),
	destinationCityCode: z
		.string({ message: "Kode kota tujuan tidak boleh kosong" })
		.min(3, { message: "Kode kota tujuan harus memiliki minimal 3 karakter" })
		.max(3, { message: "Kode kota tujuan maksimal 3 karakter" }),
}).refine(
	(data) => {
		const departureDate = new Date(data.departureDate);
		const arrivalDate = new Date(data.arrivalDate);
		return arrivalDate > departureDate;
	},
	{
		message: "Tanggal kedatangan harus setelah tanggal keberangkatan",
		path: ["arrivalDate"],
	}
).refine(
	(data) => {
		return data.departureCity.toLowerCase() !== data.destinationCity.toLowerCase();
	},
	{
		message: "Kota keberangkatan dan tujuan tidak boleh sama",
		path: ["destinationCity"],
	}
).refine(
	(data) => {
		return data.departureCityCode.toLowerCase() !== data.destinationCityCode.toLowerCase();
	},
	{
		message: "Kode kota keberangkatan dan tujuan tidak boleh sama",
		path: ["destinationCityCode"],
	}
);

