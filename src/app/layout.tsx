import './globals.css';
import { Navbar, Footer, PromoBanner } from '@/layouts';

export const metadata = {
  title: 'El Reno Nail Spa',
  description: 'Nail spa services in El Reno, OK',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <Navbar />
        <div className=" pt-24">
          <PromoBanner />
        </div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
