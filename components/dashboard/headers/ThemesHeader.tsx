import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { ActionIcon, Burger, Button, Group, MediaQuery, Select, useMantineTheme } from '@mantine/core';
import { DeviceDesktop, DeviceMobile, DeviceTablet } from 'tabler-icons-react';
import axios, { AxiosError } from 'axios';

import useTheme from '../../../contexts/ThemeContext';
import useShop from '../../../contexts/ShopContext';
import ChangeTheme from '../themes/ChangeTheme';

interface ThemesHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
  submitThemeConfig: (publish: number) => void;
  themeInEditor: string | string[];
}

function ThemesHeader({
  sidebarOpen,
  setSidebarOpen,
  submitThemeConfig,
  themeInEditor,
}: ThemesHeaderProps): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();

  const { editorViewport, setEditorViewport, setThemePage } = useTheme();
  const { getUserShops, selectedShop } = useShop();

  const [changeThemeVisible, setChangeThemeVisible] = useState<boolean>(false);

  const checkIfCanPublish = (): void => {
    if (selectedShop.current_theme.ref_id === themeInEditor) {
      submitThemeConfig(1);
    } else {
      setChangeThemeVisible(true);
    }
  };

  const setThemeAssociation = (themeRefId: string): void => {
    const formData = {
      shop: selectedShop.ref_id,
      theme: themeRefId,
      status: 1,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/themes/config`, formData)
      .then(() => {
        router.push(`/dashboard/themes/${themeRefId}`);
        getUserShops();
      })
      .catch((error: AxiosError) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  return (
    <>
      <Group sx={{ height: '100%' }} px={20} position="apart">
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            color={theme.colors.gray[6]}
            opened={sidebarOpen}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            mr="xl"
            size="sm"
          />
        </MediaQuery>

        <Group spacing="xs">
          <ActionIcon onClick={() => setEditorViewport('mobile')} disabled={editorViewport === 'mobile'}>
            <DeviceMobile />
          </ActionIcon>

          <ActionIcon onClick={() => setEditorViewport('tablet')} disabled={editorViewport === 'tablet'}>
            <DeviceTablet />
          </ActionIcon>

          <ActionIcon onClick={() => setEditorViewport('desktop')} disabled={editorViewport === 'desktop'}>
            <DeviceDesktop />
          </ActionIcon>
        </Group>

        <Select
          onChange={(page: string) => setThemePage(page)}
          placeholder="Choose a page to edit"
          defaultValue="index"
          data={[
            { value: 'index', label: 'Index' },
            { value: 'collection', label: 'Collections' },
            { value: 'product/test', label: 'Product' },
            { value: 'cart/test', label: 'Cart' },
            { value: 'login', label: 'Login' },
            { value: 'register', label: 'Register' },
            { value: 'activate', label: 'Activate Account' },
            { value: 'forgot', label: 'Forgot Password' },
            { value: 'reset', label: 'Reset Password' },
          ]}
        />

        <Group spacing="xs">
          <Link href="/dashboard/settings" passHref>
            <Button variant="outline" color="red" component="a">
              Cancel
            </Button>
          </Link>

          {selectedShop.current_theme.ref_id !== themeInEditor && (
            <Button onClick={() => submitThemeConfig(0)}>Save</Button>
          )}

          <Button onClick={() => checkIfCanPublish()}>Save & Publish</Button>
        </Group>
      </Group>

      <ChangeTheme
        changeTheme={setThemeAssociation}
        opened={changeThemeVisible}
        setOpened={setChangeThemeVisible}
        themeId={themeInEditor as string}
      />
    </>
  );
}

export default ThemesHeader;
