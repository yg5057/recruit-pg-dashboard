export interface Payment {
  paymentCode: string;
  mchtCode: string;
  amount: string;
  currency: string;
  payType: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  paymentAt: string;
}

export interface Merchant {
  mchtCode: string;
  mchtName: string;
  status: "READY" | "ACTIVE" | "INACTIVE" | "CLOSED";
  bizType: string;
  bizNo?: string;
  address?: string;
  phone?: string;
  email?: string;
  registeredAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
