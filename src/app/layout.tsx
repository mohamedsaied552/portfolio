import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteInfo } from "@/data/contact";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohamedsaied.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteInfo.name} — Software Engineer & Flutter Developer`,
    template: `%s | ${siteInfo.name}`,
  },
  description: `${siteInfo.about} ${siteInfo.aboutExtended}`,
  keywords: [
    "Mohamed Saied",
    "Flutter Developer",
    "Mobile Developer",
    "Software Engineer",
    "Egypt",
    "GLIDER",
    "React",
    "Three.js",
    "Portfolio",
  ],
  authors: [{ name: siteInfo.name }],
  creator: siteInfo.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteInfo.name,
    title: `${siteInfo.name} — Interactive Portfolio`,
    description: siteInfo.about,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteInfo.name} — Software Engineer Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteInfo.name} — Software Engineer`,
    description: siteInfo.about,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteInfo.name,
  jobTitle: siteInfo.role,
  nationality: siteInfo.country,
  description: siteInfo.about,
  knowsAbout: [
    "Flutter",
    "Mobile Development",
    "Software Engineering",
    "ASP.NET Core",
    "SignalR",
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Bachelor of Information Technology",
  },
  url: siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${syne.variable} ${jetbrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
