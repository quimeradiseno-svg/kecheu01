import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://kecheu-hecho-para-habitar.mateunatalia.chatgpt.site'),
  title: 'Kecheu — Hecho para habitar. Epuyén, Patagonia.',
  description: 'Tres cabañas de barro y madera, una casa y un taller de cerámica. La historia de una familia y su forma de habitar Epuyén, Patagonia Argentina.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
  openGraph: { type:'website', locale:'es_AR', title:'Kecheu — Hecho para habitar.', description:'Barro, madera y vida. Tres cabañas y un taller de cerámica en Epuyén, Patagonia.', url:'https://kecheu-hecho-para-habitar.mateunatalia.chatgpt.site', images:[{url:'https://kecheu-hecho-para-habitar.mateunatalia.chatgpt.site/og.png',width:1729,height:910,alt:'Kecheu. Hecho para habitar. Epuyén, Patagonia.'}] },
  twitter: { card:'summary_large_image', title:'Kecheu — Hecho para habitar.', description:'Barro, madera y vida en Epuyén, Patagonia.', images:['https://kecheu-hecho-para-habitar.mateunatalia.chatgpt.site/og.png'] },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="es-AR"><body>{children}</body></html>;}
