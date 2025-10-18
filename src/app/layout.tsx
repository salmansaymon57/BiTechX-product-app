import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Nav from '@/components/Nav';
import './globals.css';
import { Providers } from '@/components/providers'; // We'll create this next

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Product Management App',
  description: 'Manage your products efficiently',
};

// In layout.tsx, inside <body> after <Providers>:
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Nav /> {/* Add here for global nav */}
          {children}
        </Providers>
      </body>
    </html>
  );
}