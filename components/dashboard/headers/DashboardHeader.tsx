import Image from 'next/future/image';

import { Avatar, Burger, Group, Menu, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { Logout, MoonStars, Settings, Sun } from 'tabler-icons-react';

import { useMediaQuery } from '@mantine/hooks';
import accountNavigationConfig, { AccountRoutes } from '../../../configs/AccountNavigationConfig';
import useAuth from '../../../contexts/AuthContext';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
}

function DashboardHeader({ sidebarOpen, setSidebarOpen }: DashboardHeaderProps): JSX.Element {
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery('(min-width: 900px)');

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { logout } = useAuth();

  return (
    <Group className="h-full" align="center" px={0} spacing={0} position="apart">
      {!isDesktop && (
        <Burger
          color={theme.colors.gray[6]}
          opened={sidebarOpen}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          size="sm"
        />
      )}

      <Image src="/logo.png" width={isDesktop ? '132' : '98'} height={isDesktop ? '37' : '28'} alt="Enfront logo" />

      <Group noWrap>
        <Menu position="bottom-end" shadow="md" width={isDesktop ? 200 : '100%'}>
          <Menu.Target>
            <Avatar className="mr-2 cursor-pointer" color="blue" radius="xl" size="md" alt="No image" />
          </Menu.Target>

          <Menu.Dropdown>
            {accountNavigationConfig.map((item: AccountRoutes) => (
              <>
                <Menu.Item component={NextLink} href={item.path} icon={<Settings size={14} />} key={item.key}>
                  {item.title}
                </Menu.Item>

                <Menu.Item
                  onClick={() => toggleColorScheme()}
                  icon={colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
                  key="logout"
                >
                  Change Theme
                </Menu.Item>
              </>
            ))}

            <Menu.Divider />

            <Menu.Item onClick={() => logout()} icon={<Logout size={14} />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}

export default DashboardHeader;
