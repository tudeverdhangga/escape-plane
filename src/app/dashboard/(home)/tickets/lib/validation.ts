import { z } from "zod";

export const ticketFormSchema = z.object({
	code: z
		.string({ message: "Kode tiket tidak boleh kosong" })
		.min(3, { message: "Kode tiket harus memiliki minimal 3 karakter" }),
	flightId: z
		.string({ message: "Penerbangan harus dipilih" })
		.min(1, { message: "Penerbangan harus dipilih" }),
	customerId: z
		.string({ message: "Pelanggan harus dipilih" })
		.min(1, { message: "Pelanggan harus dipilih" }),
	seatId: z
		.string({ message: "Kursi harus dipilih" })
		.min(1, { message: "Kursi harus dipilih" }),
	bookingDate: z
		.string({ message: "Tanggal booking tidak boleh kosong" })
		.refine(
			(date) => {
				const bookingDate = new Date(date);
				return !isNaN(bookingDate.getTime());
			},
			{ message: "Format tanggal booking tidak valid" }
		),
	price: z
		.string({ message: "Harga tiket tidak boleh kosong" })
		.refine(
			(price) => {
				const numPrice = parseFloat(price);
				return !isNaN(numPrice) && numPrice > 0;
			},
			{ message: "Harga tiket harus berupa angka positif" }
		),
	status: z
		.enum(["PENDING", "SUCCESS", "FAILED"], {
			message: "Status tiket harus dipilih"
		}),
	tokenMidtrans: z
		.string()
		.optional()
});
