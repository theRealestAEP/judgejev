import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Judge Jev — Plead your case',
  description:
    'Five pieces of evidence. One chance to explain yourself. An endless courtroom game judged by Jev.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
