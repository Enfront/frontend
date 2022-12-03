import { ReactNode } from 'react';
import Head from 'next/head';
import Image from 'next/future/image';

import { useMediaQuery } from '@mantine/hooks';

import backgroundImage from '../../public/backgrounds/background-auth.jpg';

interface AuthLayoutProps {
  children: ReactNode;
  metaDescription: string;
  pageTitle: string;
}

function AuthLayout({ children, metaDescription, pageTitle }: AuthLayoutProps): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 900px)');

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

      <main className="relative flex h-screen justify-center md:px-12 lg:px-0">
        <Image
          src="/logo.png"
          width={isDesktop ? '132' : '98'}
          height={isDesktop ? '37' : '28'}
          alt="Enfront logo"
          priority
          style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 99 }}
        />

        <div className="relative z-10 flex flex-1 flex-col bg-white py-10 px-4 shadow-2xl sm:justify-center md:flex-none md:px-28">
          <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">{children}</div>
        </div>

        <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
          <Image className="absolute inset-0 h-full w-full object-cover" src={backgroundImage} alt="" unoptimized />
        </div>
      </main>
    </>
  );
}

export default AuthLayout;
