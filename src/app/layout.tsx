import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "MyPromise — Digital Wedding Invitation",
    template: "%s | MyPromise",
  },
  description:
    "Your love story, beautifully delivered. Premium digital wedding invitations with personalized guest links, RSVP, and more.",
  keywords: [
    "undangan digital",
    "undangan pernikahan",
    "wedding invitation",
    "undangan online",
    "MyPromise",
  ],
  authors: [{ name: "MyPromise" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mypromise.id",
    siteName: "MyPromise",
    title: "MyPromise — Digital Wedding Invitation",
    description:
      "Your love story, beautifully delivered. Premium digital wedding invitations with personalized guest links, RSVP, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyPromise — Digital Wedding Invitation",
    description:
      "Your love story, beautifully delivered. Premium digital wedding invitations with personalized guest links, RSVP, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${jakarta.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-jakarta)" }}>
        {children}
      </body>
    </html>
  );
}
