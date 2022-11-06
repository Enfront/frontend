import { MutableRefObject } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Flex, Group, Paper, Stack, Text, Title } from '@mantine/core';
import NumberFormat from 'react-number-format';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';

import { DashboardProduct, ShopData } from '../../../types/types';

interface TopProducts {
  isDesktop: boolean;
  selectedShop: ShopData;
  topProducts: MutableRefObject<DashboardProduct[]>;
}

function TopProducts({ isDesktop, selectedShop, topProducts }: TopProducts): JSX.Element {
  return (
    <Paper
      className="no-scrollbar overflow-x-auto overflow-y-hidden"
      radius="md"
      p="md"
      h={isDesktop ? 378 : 'initial'}
      withBorder
    >
      <Title className="text-lg" order={2} mb={16}>
        Top Products
      </Title>

      <Stack spacing="xl">
        {topProducts.current.map((product: DashboardProduct) => (
          <Link href={`/dashboard/products/${product.ref_id}`} key={product.name} passHref>
            <Flex
              className="cursor-pointer"
              align="flex-start"
              justify="space-between"
              gap={isDesktop ? 18 : 8}
              wrap={isDesktop ? 'nowrap' : 'wrap'}
            >
              <Group noWrap>
                <div className="relative h-10 w-10 flex-shrink-0">
                  {product.images.length > 0 ? (
                    <Image
                      className="block rounded object-cover"
                      src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_URL}${product.images[0].path}`}
                      layout="fill"
                      alt={`${product.name} product image`}
                    />
                  ) : (
                    <span className="block h-10 w-10 rounded bg-gray-400" />
                  )}
                </div>

                <Stack spacing={0}>
                  <Text className="truncate" size="sm" weight={500} maw={isDesktop ? 190 : 130}>
                    {product.name}
                  </Text>

                  <Text color="dimmed" size="xs">
                    <NumberFormat
                      value={(product.price / 100).toFixed(2)}
                      prefix={getSymbolWithIsoCode(selectedShop.currency)}
                      displayType="text"
                      thousandSeparator
                    />
                  </Text>
                </Stack>
              </Group>

              <Text size="sm" miw="max-content">
                {product.orders} Sold
              </Text>
            </Flex>
          </Link>
        ))}
      </Stack>
    </Paper>
  );
}

export default TopProducts;
