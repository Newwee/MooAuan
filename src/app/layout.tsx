import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DUO POP — มินิเกมเล่น 2 คนสุดคิ้วท์ | MooAuan',
  description:
    'เว็บเล่นมินิเกมออนไลน์ 2 คนสำหรับคู่รักและเพื่อนสนิท โทนพาสเทลน่ารัก เล่นง่าย สนุกได้ทันที ไม่ต้องดาวน์โหลด',
  keywords: [
    'DUO POP',
    'MooAuan',
    'มินิเกม 2 คน',
    'เกมคู่รัก',
    'เกมเล่นกับแฟน',
    'Same Brain',
    'Tap Battle',
    'Memory Match',
    'เกมออนไลน์เล่น 2 คน',
  ],
  authors: [{ name: 'MooAuan Studio' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFF7F4',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="h-full antialiased selection:bg-[#FFB8D2] selection:text-[#41364F]">
      <body className="min-h-full flex flex-col font-sans bg-[#FFF7F4] text-[#41364F]">
        {children}
      </body>
    </html>
  );
}
