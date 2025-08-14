import type { User } from "lucia";
import useCheckoutData from "./useCheckoutData";
import { useMemo, useState } from "react";
import { SEAT_VALUES, type SeatValuesType } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
	user: User | null;
};

type MidtransResult = {
	order_id: string;
	transaction_status: string;
	[key: string]: unknown;
};

const useTransaction = ({ user }: Props) => {
	const { data } = useCheckoutData();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const router = useRouter();

	const selectedSeat = useMemo(() => {
		return SEAT_VALUES[(data?.seat as SeatValuesType) ?? "ECONOMY"];
	}, [data?.seat]);

	const transactionMutate = useMutation({
		mutationFn: (data: unknown) =>
			axios
				.post("/api/transactions/create", data)
				.then((res) => res.data),
	});

	const updateTransactionMutate = useMutation({
		mutationFn: (data: { order_id: string; transaction_status: string }) =>
			axios
				.post("/api/transactions/update", data)
				.then((res) => res.data),
	});

	const payTransaction = async () => {
		if (!data && !user) {
			return null;
		}

		const flightPrice = Number(data?.flightDetail?.price ?? 0);
		const totalPrice = flightPrice + selectedSeat.additionalPrice;

		const bodyData = {
			bookingDate: new Date(),
			customerId: user?.id,
			flightId: data?.flightDetail?.id,
			price: totalPrice,
			seatId: data?.seatDetail?.id,
			departureCityCode: data?.flightDetail?.departureCityCode,
			destinationCityCode: data?.flightDetail?.destinationCityCode,
		};

		try {
			setIsLoading(true);
			const transaction = await transactionMutate.mutateAsync(bodyData);

			// handle midtrans
			window.snap.pay(transaction.midtrans.token, {
				onSuccess: async (result: MidtransResult) => {
					console.log('✅ Payment Success:', result);
					try {
						// Update transaction status before redirect
						await updateTransactionMutate.mutateAsync({
							order_id: result.order_id,
							transaction_status: 'settlement'
						});
						toast.success("Payment successful! Redirecting...");
						router.push("/success-checkout");
					} catch (error) {
						console.error('❌ Failed to update transaction:', error);
						toast.error("Payment successful but failed to update status. Redirecting...");
						router.push("/success-checkout");
					}
				},
				onPending: async (result: MidtransResult) => {
					console.log('⏳ Payment Pending:', result);
				},
				onError: (result: unknown) => {
					console.error('❌ Payment Error:', result);
					toast.error("Payment failed. Please try again.");
				},
				onClose: (result: unknown) => {
					console.log('🚪 Payment Closed:', result);
					toast.warning("Payment was cancelled.");
				},
			});

			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.error("❌ Failed to create transaction:", error);
			toast.error("Failed to process payment. Please try again.");
		}
	};

	return {
		payTransaction,
		isLoading,
	};
};

export default useTransaction;
