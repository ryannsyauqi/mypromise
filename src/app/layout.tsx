import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Great_Vibes, Cormorant_Garamond, Jost, DM_Sans, Libre_Baskerville, Bodoni_Moda } from "next/font/google";
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

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${jakarta.variable} ${greatVibes.variable} ${cormorant.variable} ${jost.variable} ${dmSans.variable} ${libreBaskerville.variable} ${bodoniModa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-jakarta)" }}>
        {children}
        <script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          defer
        ></script>
      </body>
    </html>
  );
}
