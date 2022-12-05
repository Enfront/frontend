import Image from 'next/future/image';

import { Avatar, Burger, Code, Group, Menu, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useMediaQuery, useShallowEffect } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { NextLink } from '@mantine/next';
import { FileDiff, Logout, MoonStars, Settings, Sun } from 'tabler-icons-react';

import WhatsNew from '../WhatsNew';
import useAuth from '../../../contexts/AuthContext';
import accountNavigationConfig, { AccountRoutes } from '../../../configs/AccountNavigationConfig';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
}

function DashboardHeader({ sidebarOpen, setSidebarOpen }: DashboardHeaderProps): JSX.Element {
  const updateNumber = 3;

  const modals = useModals();
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery('(min-width: 900px)');

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { logout, userDetails } = useAuth();

  const openWhatsNewModal = () => {
    modals.openModal({
      title: <Code>Dec 3rd 2022</Code>,
      centered: true,
      children: <WhatsNew />,
    });
  };

  useShallowEffect(() => {
    const hasSeen = localStorage.getItem(`_enfront_whats_new_${updateNumber.toString()}`);
    const lastHasSeen = localStorage.getItem(`_enfront_whats_new_${(updateNumber - 1).toString()}`);

    if (lastHasSeen) {
      localStorage.removeItem(`_enfront_whats_new_${(updateNumber - 1).toString()}`);
    }

    if (!hasSeen) {
      localStorage.setItem(`_enfront_whats_new_${updateNumber.toString()}`, 'true');
      openWhatsNewModal();
    }
  }, []);

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

      <Image
        src="/logo.png"
        width={isDesktop ? '132' : '98'}
        height={isDesktop ? '37' : '28'}
        alt="Enfront logo"
        priority
      />

      <Group noWrap>
        <Menu position="bottom-end" shadow="md" width={isDesktop ? 200 : '100%'}>
          <Menu.Target>
            <Avatar className="cursor-pointer" color="brand" radius="xl" size="md" alt="Account dropdown" />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>
              <Text size="xs" weight={500}>
                Signed in as
              </Text>

              <Text
                color={colorScheme === 'dark' ? theme.colors.dark[0] : theme.black}
                size="sm"
                weight={600}
                lineClamp={1}
              >
                {userDetails.username}
              </Text>
            </Menu.Label>

            <Menu.Divider />

            {accountNavigationConfig.map((item: AccountRoutes) => (
              <Menu.Item component={NextLink} href={item.path} icon={<Settings size={16} />} lh={1.15} key={item.key}>
                {item.title}
              </Menu.Item>
            ))}

            <Menu.Item onClick={() => openWhatsNewModal()} icon={<FileDiff size={16} />}>
              What&apos;s New
            </Menu.Item>

            <Menu.Item
              onClick={() => toggleColorScheme()}
              icon={colorScheme === 'dark' ? <Sun size={16} /> : <MoonStars size={16} />}
            >
              Change Theme
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item onClick={() => logout()} icon={<Logout size={16} />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}

export default DashboardHeader;
