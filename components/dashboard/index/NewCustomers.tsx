import { MutableRefObject } from 'react';
import Link from 'next/link';

import { Avatar, Badge, Flex, Group, Paper, Stack, Text, Title } from '@mantine/core';

import { Customer } from '../../../types/types';

interface NewCustomersProps {
  isDesktop: boolean;
  newCustomers: MutableRefObject<Customer[]>;
}

function NewCustomers({ isDesktop, newCustomers }: NewCustomersProps): JSX.Element {
  return (
    <Paper
      className="no-scrollbar overflow-x-auto overflow-y-hidden"
      radius="md"
      p="md"
      h={isDesktop ? 400 : 'initial'}
      withBorder
    >
      <Title className="text-lg" order={2} mb={16}>
        New Customers
      </Title>

      <Stack spacing="xl">
        {newCustomers.current.map((item) => (
          <Link href={`/dashboard/customers/${item.user.ref_id}`} key={item.user.email} passHref>
            <Flex
              className="cursor-pointer"
              align={isDesktop ? 'center' : 'flex-start'}
              direction={isDesktop ? 'row' : 'column'}
              gap={isDesktop ? 18 : 8}
              justify={isDesktop ? 'space-between' : 'stretch'}
            >
              <Group noWrap>
                <Avatar color="brand" radius="xl" />

                <Stack spacing={2}>
                  <Text className="truncate" size="sm" weight={500} maw={isDesktop ? 175 : '100%'}>
                    {item.user.username ?? 'Anonymous'}
                  </Text>

                  <Text className="truncate" color="dimmed" size="xs" maw={isDesktop ? 175 : '100%'}>
                    {item.user.email}
                  </Text>
                </Stack>
              </Group>

              {item.user.is_active ? (
                <Badge color="green" radius="xs" fullWidth={!isDesktop} miw="min-content">
                  Registered
                </Badge>
              ) : (
                <Badge color="yellow" radius="xs" fullWidth={!isDesktop} miw="min-content">
                  Anonymous
                </Badge>
              )}
            </Flex>
          </Link>
        ))}
      </Stack>
    </Paper>
  );
}

export default NewCustomers;
