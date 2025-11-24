import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./reset.css";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-noto-kr",
});

export const metadata: Metadata = {
  title: "Payment Dashboard",
  description: "(주)올페이즈 프론트엔드 채용 과제",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="flex min-h-screen bg-gray-100">
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-6 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
