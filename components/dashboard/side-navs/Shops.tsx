import { useState } from 'react';
import { useRouter } from 'next/router';

import { Avatar, Box, Button, Divider, Group, Menu, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
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
        <Group>
          <Avatar color="blue" radius="xl" />

          <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {selectedShop.name}
            </Text>

            <Text color="dimmed" size="xs">
              {selectedShop.email}
            </Text>
          </Box>

          <ChevronRight size={18} />
        </Group>
      </UnstyledButton>
    </Box>
  );

  return (
    <>
      {shopData ? (
        <Menu control={ShopButton} gutter={16} placement="center" size="lg" sx={{ width: '100%' }}>
          {shopData.map((shop: ShopData) => (
            <Menu.Item onClick={() => selectShop(shop.ref_id)} key={shop.ref_id}>
              <Group>
                <Box sx={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {shop.name}
                  </Text>

                  <Text color="dimmed" size="xs">
                    {shop.email}
                  </Text>
                </Box>
              </Group>
            </Menu.Item>
          ))}

          <Divider />

          <Menu.Item onClick={() => setCreateShopOpen(true)}>Create New Shop</Menu.Item>
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
