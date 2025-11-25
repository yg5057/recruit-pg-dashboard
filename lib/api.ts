import axios from "axios";
import { ApiResponse, Merchant, Payment } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchPayments = async (): Promise<Payment[]> => {
  const response = await api.get<ApiResponse<Payment[]>>("/payments/list");
  return response.data.data;
};

export const fetchMerchants = async (): Promise<Merchant[]> => {
  const response = await api.get<ApiResponse<Merchant[]>>("/merchants/list");
  return response.data.data;
};

export const fetchMerchantDetail = async (
  mchtCode: string
): Promise<Merchant> => {
  const response = await api.get<ApiResponse<Merchant>>(
    `/merchants/details/${mchtCode}`
  );
  return response.data.data;
};
