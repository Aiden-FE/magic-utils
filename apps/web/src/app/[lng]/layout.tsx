import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { dir } from 'i18next';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeStoreProvider } from '@/providers/theme-store';
import { ContextStoreProvider } from '@/providers/context-store';
import { Languages } from '@/config';
import { PageProps } from '@/interfaces';
import '@/assets/styles/global.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export async function generateStaticParams() {
  return Languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: Readonly<
  PageProps & {
    children: React.ReactNode;
  }
>) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={inter.className} suppressHydrationWarning>
        <NextUIProvider>
          <ContextStoreProvider>
            <ThemeStoreProvider>{children}</ThemeStoreProvider>
          </ContextStoreProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
