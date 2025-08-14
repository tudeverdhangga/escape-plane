import { Airplane, Flight, FlightSeat, TypeSeat } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs'
import 'dayjs/locale/id' // Indonesian locale

// Set Indonesian locale as default
dayjs.locale('id')

export const SEAT_VALUES = {
	ECONOMY: {
		label: "Economy",
		additionalPrice: 0,
	},
	BUSINESS: {
		label: "Business",
		additionalPrice: 500000,
	},
	FIRST: {
		label: "First",
		additionalPrice: 750000,
	},
};
export type SeatValuesType = keyof typeof SEAT_VALUES;

export type Checkout = {
	id?: string;
	seat?: TypeSeat;
	flightDetail?: Flight & { plane: Airplane };
	seatDetail?: FlightSeat;
};

export const CHECKOUT_KEY = "CHECKOUT_KEY";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateSeatPerClass = (flightId: string) => {
  const SEAT_CLASS: TypeSeat[] = [
    TypeSeat.ECONOMY,
    TypeSeat.BUSINESS,
    TypeSeat.FIRST,
  ];
  const SEAT_CODE = ["A", "B", "C", "D", "E", "F"]

  const seats: { flightId: string; seatNumber: string; type: TypeSeat }[] = [];

  SEAT_CLASS.forEach((seatClass) => {
    for (let i = 1; i <= 6; i++) {
      SEAT_CODE.forEach((code) => {
        seats.push({
          flightId,
          seatNumber: `${code}${i}`,
          type: seatClass,
        });
      });
    }
  });
  return seats;
}

export const dateFormat = (date: Date, format: string = "DD MMM YYYY, HH:mm"): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return dayjs(date).format(format);
};

export const formatCurrency = (amount: number, currency: string = 'IDR', locale: string = 'id-ID'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const mappingSeats = (seats: FlightSeat[]) => {
  const totalSeatEconomy = seats.filter(seat => seat.type === TypeSeat.ECONOMY).length;
  const totalSeatBusiness = seats.filter(seat => seat.type === TypeSeat.BUSINESS).length;
  const totalSeatFirst = seats.filter(seat => seat.type === TypeSeat.FIRST).length;

  const totalSeatEconomyBooked = seats.filter(seat => seat.type === TypeSeat.ECONOMY && seat.isBooked).length;
  const totalSeatBusinessBooked = seats.filter(seat => seat.type === TypeSeat.BUSINESS && seat.isBooked).length;
  const totalSeatFirstBooked = seats.filter(seat => seat.type === TypeSeat.FIRST && seat.isBooked).length;

  return {
    totalSeatEconomy,
    totalSeatBusiness,
    totalSeatFirst,
    totalSeatEconomyBooked,
    totalSeatBusinessBooked,
    totalSeatFirstBooked
  };
}

export const objectToParams = (obj: { [key: string]: unknown }) => {
	const queryParams = Object.keys(obj)
		.map((key) => {
			if (obj[key] !== null) {
				return `${key}=${obj[key]}`;
			}

			return "";
		})
		.filter((key) => key !== "")
		.join("&");

	return queryParams;
};

export function makeid(length: number) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
		counter += 1;
	}
	return result;
}