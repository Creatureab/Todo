import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/page/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Todo Dashboard",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <main>{children}</main>
            </body>
        </html>
    );
}
