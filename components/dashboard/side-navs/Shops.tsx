import { useState } from 'react';
import { useRouter } from 'next/router';

import { Avatar, Box, Button, Group, Menu, Stack, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { ChevronRight } from 'tabler-icons-react';

import useShop from '../../../contexts/ShopContext';
import CreateShop from '../shop/CreateShop';
import { ShopData } from '../../../types/types';

function Shops(): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();

  const { selectedShop, setSelectedShopByIdOrData, shopData } = useShop();
  const [createShopOpen, setCreateShopOpen] = useState<boolean>(false);

  const selectShop = (shop_ref: string): void => {
    setSelectedShopByIdOrData(shop_ref);
    router.push('/dashboard');
  };

  const ShopButton = (
    <Box
      sx={{
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        paddingTop: theme.spacing.sm,
      }}
    >
      <UnstyledButton
        sx={{
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          display: 'block',
          padding: theme.spacing.xs,
          width: '100%',
          '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        }}
      >
        <Group position="apart" noWrap>
          <Group className="max-w-[85%]" spacing="xs" noWrap>
            <Avatar color="brand" radius="xl" />

            <Stack className="max-w-[85%]" spacing={0}>
              <Text className="truncate" size="sm" weight={500}>
                {selectedShop.name}
              </Text>

              <Text className="truncate" color="dimmed" size="xs">
                {selectedShop.email}
              </Text>
            </Stack>
          </Group>

          <ChevronRight size={18} />
        </Group>
      </UnstyledButton>
    </Box>
  );

  return (
    <>
      {shopData ? (
        <Menu position="top" shadow="md" width={267}>
          <Menu.Target>{ShopButton}</Menu.Target>

          <Menu.Dropdown>
            {shopData.map((shop: ShopData) => (
              <Menu.Item onClick={() => selectShop(shop.ref_id)} key={shop.ref_id}>
                <Stack spacing={0}>
                  <Text size="sm" weight={500}>
                    {shop.name}
                  </Text>

                  <Text color="dimmed" size="xs">
                    {shop.email}
                  </Text>
                </Stack>
              </Menu.Item>
            ))}

            <Menu.Divider />

            <Menu.Item onClick={() => setCreateShopOpen(true)}>Create New Shop</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Button onClick={() => setCreateShopOpen(true)} fullWidth>
          Create Shop
        </Button>
      )}

      <CreateShop isVisible={createShopOpen} setIsVisible={setCreateShopOpen} />
    </>
  );
}

export default Shops;
