// 결제 관련 매핑
export const PAYMENT_STATUS_MAP: Record<string, string> = {
  PENDING: "결제 대기",
  SUCCESS: "결제 완료",
  FAILED: "결제 실패",
  CANCELLED: "환불 완료",
};

export const PAYMENT_TYPE_MAP: Record<string, string> = {
  ONLINE: "온라인",
  DEVICE: "단말기",
  MOBILE: "모바일",
  VACT: "가상계좌",
  BILLING: "정기결제",
};

// 결제 상태별 뱃지 색상
export const STATUS_COLOR_MAP: Record<string, string> = {
  SUCCESS: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-rose-100 text-rose-700",
  CANCELLED: "bg-orange-100 text-orange-700",
  PENDING: "bg-gray-100 text-gray-700",
};

// 가맹점 관련 매핑
export const MERCHANT_STATUS_MAP: Record<string, string> = {
  ACTIVE: "영업",
  READY: "대기",
  INACTIVE: "중단",
  CLOSED: "폐업",
};

export const BIZ_TYPE_MAP: Record<string, string> = {
  CAFE: "카페/식음료",
  SHOP: "쇼핑몰",
  MART: "마트/유통",
  APP: "IT/플랫폼",
  TRAVEL: "여행/숙박",
  EDU: "교육/학원",
  TEST: "테스트",
};

// 가맹점 상태별 뱃지 색상
export const MERCHANT_STATUS_COLOR_MAP: Record<string, string> = {
  ACTIVE: "bg-blue-50 text-brand border-blue-100",
  READY: "bg-yellow-50 text-yellow-700 border-yellow-100",
  INACTIVE: "bg-orange-50 text-orange-700 border-orange-100",
  CLOSED: "bg-gray-100 text-text-sub border-gray-200",
};
