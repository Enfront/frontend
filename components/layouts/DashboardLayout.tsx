import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { AppShell, Container, Header, Navbar } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import navigationConfig, { DashboardRoutes } from '../../configs/NavigationConfig';
import utils from '../../utils/utils';

import DashboardHeader from '../dashboard/headers/DashboardHeader';
import Links from '../dashboard/side-navs/Links';
import Shops from '../dashboard/side-navs/Shops';

interface LayoutProps {
  children: ReactNode;
  metaDescription: string;
  tabTitle: string;
}

function DashboardLayout({ children, metaDescription, tabTitle }: LayoutProps): JSX.Element {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 900px)');

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const currentRouteInfo: DashboardRoutes = utils.getRouteInfo(navigationConfig, router.pathname);

  return (
    <>
      <Head>
        <title>{tabTitle}</title>
        <meta name="description" content={metaDescription} />

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
      </Head>

      <AppShell
        padding={32}
        navbarOffsetBreakpoint="sm"
        header={
          <Header height={70} p="md">
            <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </Header>
        }
        navbar={
          <Navbar p="md" hiddenBreakpoint="sm" hidden={!sidebarOpen} width={{ sm: 300 }}>
            <Navbar.Section grow mt="xs">
              <Links currentRouteInfo={currentRouteInfo} />
            </Navbar.Section>

            <Navbar.Section>
              <Shops />
            </Navbar.Section>
          </Navbar>
        }
      >
        {isDesktop ? (
          <Container className="h-full" size="xl">
            {children}
          </Container>
        ) : (
          <>{children}</>
        )}
      </AppShell>
    </>
  );
}

export default DashboardLayout;
