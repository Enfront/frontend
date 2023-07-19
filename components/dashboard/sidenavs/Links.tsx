import { useState } from 'react';
import Link from 'next/link';

import { Box, Collapse, createStyles, Flex, Group, Text, ThemeIcon, Title, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons';

import { DashboardRoutes } from '&/configs/NavigationConfig';
import useShop from '&/contexts/ShopContext';

interface LinksProps {
  currentRouteInfo: DashboardRoutes;
  links: DashboardRoutes;
}

const useStyles = createStyles((theme) => ({
  control: {
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    display: 'block',
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    marginBottom: 4,
    padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
    width: '100%',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    cursor: 'pointer',
    display: 'block',
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    marginLeft: 30,
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    textDecoration: 'none',

    '&:hover': {
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },
}));

function Links({ currentRouteInfo, links }: LinksProps): JSX.Element {
  const { shopProcessing, selectedShop } = useShop();
  const { classes, theme } = useStyles();

  const [opened, setOpened] = useState(!!currentRouteInfo?.submenu);

  const hasLinks = Array.isArray(links.submenu);

  return (
    <>
      <UnstyledButton
        className={classes.control}
        onClick={() => setOpened((o) => !o)}
        sx={() => ({
          backgroundColor:
            // eslint-disable-next-line no-nested-ternary
            currentRouteInfo?.key === links.key && theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : currentRouteInfo?.key === links.key && theme.colorScheme !== 'dark'
              ? theme.colors.gray[0]
              : 'transparent',
        })}
      >
        <Group position="apart" spacing={0}>
          {links.path ? (
            <Link href={!shopProcessing && selectedShop.ref_id !== '' ? links.path : '/dashboard'} passHref>
              <Flex align="center">
                <ThemeIcon color={links.color} size="lg" variant="light">
                  {links.icon}
                </ThemeIcon>

                <Title weight={currentRouteInfo?.key === links.key ? 500 : 400} size="sm" ml="md">
                  {links.title}
                </Title>
              </Flex>
            </Link>
          ) : (
            <Flex align="center">
              <ThemeIcon color={links.color} size="lg" variant="light">
                {links.icon}
              </ThemeIcon>

              <Title weight={currentRouteInfo?.key === links.key ? 500 : 400} size="sm" ml="md">
                {links.title}
              </Title>
            </Flex>
          )}

          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              size={14}
              stroke={1.5}
              style={{
                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>

      {hasLinks && links.submenu ? (
        <Collapse in={opened}>
          {links.submenu.map((link: DashboardRoutes) => (
            <Box key={link.title}>
              {link.path && (
                <Link href={link.path} passHref>
                  <Text className={classes.link} key={link.title}>
                    {link.title}
                  </Text>
                </Link>
              )}
            </Box>
          ))}
        </Collapse>
      ) : null}
    </>
  );
}

export default Links;
