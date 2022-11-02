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

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://enfront.io/" />
        <meta property="og:title" content="Enfront" />
        <meta property="og:image" content="https://enfront.io/social-logo.png" />
        <meta
          property="og:description"
          content="Enfront takes e-commerce to the next level by offering a vast amount of innovative tools designed to
          simplify and accelerate the process."
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://enfront.io/" />
        <meta property="twitter:title" content="Enfront" />
        <meta property="twitter:image" content="https://enfront.io/social-logo.png" />
        <meta
          property="twitter:description"
          content="Enfront takes e-commerce to the next level by offering a vast amount of innovative tools designed to
          simplify and accelerate the process."
        />

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
