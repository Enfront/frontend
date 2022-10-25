import Image from 'next/image';

import {
  ActionIcon,
  Avatar,
  Burger,
  Group,
  MediaQuery,
  Menu,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import { Logout, MoonStars, Settings, Sun } from 'tabler-icons-react';

import accountNavigationConfig, { AccountRoutes } from '../../../configs/AccountNavigationConfig';
import useAuth from '../../../contexts/AuthContext';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
}

function DashboardHeader({ sidebarOpen, setSidebarOpen }: DashboardHeaderProps): JSX.Element {
  const theme = useMantineTheme();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { logout } = useAuth();

  return (
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

      <Image src="/logo.png" width="132" height="37" alt="Enfront logo" />

      <Group>
        <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
          {colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
        </ActionIcon>

        <Menu position="bottom-end" shadow="md" width={200}>
          <Menu.Target>
            <Avatar className="mr-2 cursor-pointer" color="blue" radius="xl" size="md" alt="No image" />
          </Menu.Target>

          <Menu.Dropdown>
            {accountNavigationConfig.map((item: AccountRoutes) => (
              <Menu.Item component={NextLink} href={item.path} icon={<Settings size={14} />} key={item.key}>
                {item.title}
              </Menu.Item>
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
