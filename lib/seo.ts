import type { Metadata } from "next"

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      locale: "en_NZ",
      type: "website",
      siteName: "Siboost",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
