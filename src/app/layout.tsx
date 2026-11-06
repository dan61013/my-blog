import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "My Blog",
  description: "A bilingual technical blog about data engineering.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // zh-TW is the default language; i18n routing comes in a later phase.
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
