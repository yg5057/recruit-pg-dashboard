import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Sidebar from "./_components/Sidebar";

const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-noto-kr",
});

export const metadata: Metadata = {
  title: "PG Dashboard",
  description: "(주)올페이즈 프론트엔드 채용 과제",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.variable} bg-bg-page text-text-main antialiased`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 w-full max-w-[1600px] mx-auto p-8 transition-all duration-300 ease-in-out ml-64 peer-data-[collapsed=true]:ml-20">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
