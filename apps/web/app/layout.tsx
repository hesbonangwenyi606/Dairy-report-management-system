import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Construction Site Management & Daily Reporting System',
  description: 'Centralized platform for construction projects, labour, inventory, safety, and reporting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
