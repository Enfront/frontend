import { ReactNode } from 'react';
import Head from 'next/head';

import PublicHeader from '../public/headers/PublicHeader';
import Footer from '../public/footers/Footer';

interface LayoutProps {
  children: ReactNode;
  metaDescription: string;
  pageTitle: string;
}

function PublicLayout({ children, pageTitle, metaDescription }: LayoutProps): JSX.Element {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
      </Head>

      <PublicHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default PublicLayout;
