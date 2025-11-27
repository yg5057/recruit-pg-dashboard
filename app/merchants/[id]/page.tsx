"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchMerchantDetail } from "@/lib/api";
import { Merchant } from "@/types";
import { format } from "date-fns";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MERCHANT_STATUS_MAP,
  BIZ_TYPE_MAP,
  MERCHANT_STATUS_COLOR_MAP,
} from "@/lib/constants";

export default function MerchantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);

  const mchtCode = params.id as string;

  useEffect(() => {
    if (mchtCode) {
      fetchMerchantDetail(mchtCode)
        .then(setMerchant)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [mchtCode]);

  if (loading)
    return (
      <div className="p-10 flex justify-center text-brand">
        상세 정보를 불러오는 중...
      </div>
    );
  if (!merchant)
    return (
      <div className="p-10 flex justify-center text-text-muted">
        가맹점 정보를 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-blue-100 hover:text-brand-hover text-text-sub transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-text-main tracking-tight">
          가맹점 상세 정보
        </h2>
      </div>

      <div className="rounded-3xl border border-border bg-bg-surface shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-brand">
              <Building2 size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-text-main">
                  {merchant.mchtName}
                </h1>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-md text-xs font-bold border",
                    MERCHANT_STATUS_COLOR_MAP[merchant.status] ||
                      "bg-gray-100 text-text-sub border-gray-200"
                  )}
                >
                  {MERCHANT_STATUS_MAP[merchant.status] || merchant.status}
                </span>
              </div>
              <p className="text-text-muted font-mono text-sm">
                {merchant.mchtCode}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-text-muted" />
              기본 정보
            </h3>
            <InfoItem label="사업자 등록번호" value={merchant.bizNo || "-"} />
            <InfoItem
              label="업종 카테고리"
              value={BIZ_TYPE_MAP[merchant.bizType] || merchant.bizType}
            />
            <InfoItem
              label="등록일"
              value={
                merchant.registeredAt
                  ? format(new Date(merchant.registeredAt), "yyyy년 MM월 dd일")
                  : "-"
              }
            />
            <InfoItem
              label="최종 수정일"
              value={
                merchant.updatedAt
                  ? format(new Date(merchant.updatedAt), "yyyy-MM-dd HH:mm")
                  : "-"
              }
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-text-muted" />
              연락처 정보
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-lg bg-bg-sub flex items-center justify-center text-text-sub shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-muted mb-0.5">
                    사업장 주소
                  </p>
                  <p className="text-text-main font-medium">
                    {merchant.address || "주소 미등록"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-lg bg-bg-sub flex items-center justify-center text-text-sub shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-muted mb-0.5">
                    전화번호
                  </p>
                  <p className="text-text-main font-medium">
                    {merchant.phone || "-"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-lg bg-bg-sub flex items-center justify-center text-text-sub shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-muted mb-0.5">
                    이메일
                  </p>
                  <p className="text-text-main font-medium">
                    {merchant.email || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-dashed border-border pb-2 last:border-0 last:pb-0">
      <span className="text-text-sub text-sm">{label}</span>
      <span className="text-text-main font-medium">{value}</span>
    </div>
  );
}
