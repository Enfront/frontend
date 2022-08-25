import Link from 'next/link';

import { ThemeIcon, UnstyledButton, Group, Text, MantineTheme } from '@mantine/core';

import navigationConfig, { DashboardRoutes } from '../../../configs/NavigationConfig';
import useShop from '../../../contexts/ShopContext';

interface LinksProps {
  currentRouteInfo: DashboardRoutes;
}

function Links({ currentRouteInfo }: LinksProps): JSX.Element {
  const { shopProcessing, selectedShop } = useShop();

  return (
    <>
      {navigationConfig.map((item: DashboardRoutes) => (
        <Link href={!shopProcessing && selectedShop.ref_id !== '' ? item.path : '/dashboard'} key={item.key} passHref>
          <UnstyledButton
            sx={(theme: MantineTheme) => ({
              backgroundColor:
                // eslint-disable-next-line no-nested-ternary
                currentRouteInfo?.key === item.key && theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : currentRouteInfo?.key === item.key && theme.colorScheme !== 'dark'
                  ? theme.colors.gray[0]
                  : 'transparent',
              borderRadius: theme.radius.sm,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
              display: 'block',
              padding: theme.spacing.xs,
              width: '100%',
              '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
              },
            })}
          >
            <Group>
              <ThemeIcon color={item.color} size="lg" variant="light">
                {item.icon}
              </ThemeIcon>

              <Text weight={currentRouteInfo?.key === item.key ? 500 : 400} size="sm">
                {item.title}
              </Text>
            </Group>
          </UnstyledButton>
        </Link>
      ))}
    </>
  );
}

export default Links;
