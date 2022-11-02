import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { AppShell, Header, Navbar, ScrollArea } from '@mantine/core';

import useShop from '../../contexts/ShopContext';

import ThemesHeader from '../dashboard/headers/ThemesHeader';
import ThemesSidenav from '../dashboard/sidenavs/ThemesSidenav';
import { SettingsSchema, ThemeConfigFormData, ThemeProductNew } from '../../types/types';

interface ThemeEditorLayoutProps {
  children: ReactNode;
  metaDescription: string;
  tabTitle: string;
}

function ThemeEditorLayout({ children, metaDescription, tabTitle }: ThemeEditorLayoutProps): JSX.Element {
  const router = useRouter();

  const { themeId } = router.query;
  const { getUserShops, selectedShop } = useShop();

  const [editorSettings, setEditorSettings] = useState<SettingsSchema[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [themeInEditorId, setThemeInEditorId] = useState<string | string[]>('');
  const [existingConfig, setExistingConfig] = useState<
    Record<string | number, ThemeProductNew | string | boolean | number>
  >({});

  const submitThemeConfig = async (publish: number): Promise<void> => {
    const formData: ThemeConfigFormData = {
      status: publish,
      config: JSON.stringify(existingConfig),
      shop: selectedShop.ref_id,
      theme: themeInEditorId,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/themes/config`, formData)
      .then(() => {
        getUserShops();
        router.push('/dashboard/settings');
      })
      .catch((error: AxiosError) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  useEffect(() => {
    if (themeId && selectedShop.ref_id) {
      setThemeInEditorId(themeId);

      const getThemeSettings = (): void => {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/themes/${themeId}/settings`)
          .then((response: AxiosResponse) => {
            setEditorSettings(response.data.data);
          })
          .catch((error: AxiosError) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
      };

      const getThemeConfig = (): void => {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/themes/${themeId}/config/${selectedShop.ref_id}`)
          .then((response: AxiosResponse) => {
            if (response.data.data) {
              setExistingConfig(response.data.data);
            } else {
              setExistingConfig({});
            }
          })
          .catch((error: AxiosError) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
      };

      getThemeSettings();
      getThemeConfig();
    }
  }, [selectedShop, themeId]);

  return (
    <>
      <Head>
        <title>{tabTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="noindex" />

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
      </Head>

      <AppShell
        padding={32}
        navbarOffsetBreakpoint="sm"
        header={
          <Header className="left-[300px]" height={70} p="md">
            <ThemesHeader
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              submitThemeConfig={submitThemeConfig}
              themeInEditor={themeInEditorId}
            />
          </Header>
        }
        navbar={
          <Navbar className="top-0 h-screen" m="md" hiddenBreakpoint="sm" hidden={!sidebarOpen} width={{ sm: 300 }}>
            <Navbar.Section component={ScrollArea} scrollbarSize={2} mt="xs" px="xs" grow offsetScrollbars>
              <ThemesSidenav
                existingConfig={existingConfig}
                setExistingConfig={setExistingConfig}
                settingsScheme={editorSettings}
              />
            </Navbar.Section>
          </Navbar>
        }
      >
        {children}
      </AppShell>
    </>
  );
}

export default ThemeEditorLayout;
