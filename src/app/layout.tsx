// app/layout.tsx
import './globals.css';
import { Navbar, Footer, PromoBanner } from '@/layouts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <Navbar />
        <div className="pt-24">
          <PromoBanner />
        </div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
