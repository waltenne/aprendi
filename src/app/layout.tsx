import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { UmamiAnalytics } from '@/components/analytics';
import { Toaster } from '@/components/ui/toaster';
import { getBaseMetadata, getOrganizationJsonLd } from '@/lib/seo';
import { getAllLevels, getAllAreas, getAllTags } from '@/lib/loaders/courses';
import { getAllInstructors } from '@/lib/loaders/instructors';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = getBaseMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = getOrganizationJsonLd();
  const levels = getAllLevels();
  const instructors = getAllInstructors().map(i => ({ id: i.id, name: i.name }));
  const areas = getAllAreas();
  const tags = getAllTags();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <UmamiAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <React.Suspense fallback={<div />}> 
            <SidebarLayout levels={levels} instructors={instructors} areas={areas} tags={tags}>
              {children}
              <Toaster />
            </SidebarLayout>
          </React.Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
