import Image from 'next/future/image';
import { NextRouter } from 'next/router';

import { ActionIcon, Badge, Divider, Group, Paper, Stack, Table, Text, Title } from '@mantine/core';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import NumberFormat from 'react-number-format';
import { Edit } from 'tabler-icons-react';

import { Product, ShopData } from '&/types/types';

interface ProductListProps {
  isDesktop: boolean;
  router: NextRouter;
  shownProducts: Product[];
  selectedShop: ShopData;
}

function ProductList({ isDesktop, router, shownProducts, selectedShop }: ProductListProps): JSX.Element {
  const gotoProductDetails = (refId: string): void => {
    router.push(`/dashboard/products/${refId}`);
  };

  const gotoEditProduct = (refId: string): void => {
    router.push({
      pathname: `/dashboard/products/${refId}`,
      query: { edit: true },
    });
  };

  const getStockStatus = (stockCount: number, classes?: string): JSX.Element => {
    if (stockCount === 0) {
      return (
        <Badge className={classes} color="red" radius="xs">
          Out of Stock
        </Badge>
      );
    }

    if (stockCount > 0 && stockCount < 10) {
      return (
        <Badge className={classes} color="yellow" radius="xs">
          Limited Stock
        </Badge>
      );
    }

    return (
      <Badge className={classes} color="green" radius="xs">
        In Stock
      </Badge>
    );
  };

  const getProductStatus = (status: number, classes?: string): JSX.Element => {
    if (status === -2) {
      return (
        <Badge className={classes} color="red" radius="xs">
          Out of Stock
        </Badge>
      );
    }

    if (status === 1) {
      return (
        <Badge className={classes} color="green" radius="xs">
          Listed
        </Badge>
      );
    }

    return (
      <Badge className={classes} color="yellow" radius="xs">
        Unlisted
      </Badge>
    );
  };

  return (
    <>
      {isDesktop ? (
        <Table verticalSpacing="md" highlightOnHover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Stock Status</th>
              <th>Product Status</th>
              <th />
            </tr>
          </thead>

          {shownProducts && shownProducts.length > 0 ? (
            <tbody>
              {shownProducts.map((product: Product) => (
                <tr className="cursor-pointer" onClick={() => gotoProductDetails(product.ref_id)} key={product.ref_id}>
                  <td>
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 flex-shrink-0">
                        {product.images.length > 0 ? (
                          <Image
                            className="block rounded object-cover"
                            src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_URL}${product.images[0].path}`}
                            alt={`${product.name} product image`}
                            fill
                          />
                        ) : (
                          <span className="block h-10 w-10 rounded bg-gray-400" />
                        )}
                      </div>

                      <div className="ml-4">
                        <Title order={6}>{product.name}</Title>

                        <Text color="dimmed" size="xs">
                          {product.ref_id}
                        </Text>
                      </div>
                    </div>
                  </td>

                  <td>
                    <NumberFormat
                      value={(product.price / 100).toFixed(2)}
                      prefix={getSymbolWithIsoCode(selectedShop.currency)}
                      displayType="text"
                      thousandSeparator
                    />
                  </td>

                  <td>{product.stock}</td>

                  <td>{getStockStatus(product.stock)}</td>

                  <td>{getProductStatus(product.status)}</td>

                  <td>
                    <ActionIcon onClick={() => gotoEditProduct(product.ref_id)} size="sm" variant="transparent">
                      <Edit />
                    </ActionIcon>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <Text align="center" color="dimmed" size="md">
                    No products found
                  </Text>
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      ) : (
        <>
          {shownProducts.map((product: Product) => (
            <Paper
              onClick={() => gotoProductDetails(product.ref_id)}
              p={16}
              radius="md"
              shadow="sm"
              mb={16}
              key={product.ref_id}
              withBorder
            >
              <Group align="flex-start" spacing={8} noWrap>
                <div className="relative h-10 w-10 flex-shrink-0">
                  {product.images.length > 0 ? (
                    <Image
                      className="block rounded object-cover"
                      src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_URL}${product.images[0].path}`}
                      alt={`${product.name} product image`}
                      fill
                    />
                  ) : (
                    <span className="block h-10 w-10 rounded bg-gray-400" />
                  )}
                </div>

                <Stack spacing={2}>
                  <Text size="xs" weight={500} lineClamp={1}>
                    {product.name}
                  </Text>

                  <Text color="dimmed" size="xs" lineClamp={1}>
                    {product.ref_id}
                  </Text>
                </Stack>
              </Group>

              <Divider my="sm" />

              <Group position="apart" mb={8}>
                <Text color="dimmed" size="xs">
                  Price
                </Text>

                <Text size="xs" weight={500}>
                  <NumberFormat
                    value={(product.price / 100).toFixed(2)}
                    prefix={getSymbolWithIsoCode(selectedShop.currency)}
                    displayType="text"
                    thousandSeparator
                  />
                </Text>
              </Group>

              <Group position="apart" mb={8}>
                <Text color="dimmed" size="xs">
                  Stock
                </Text>

                <Text size="xs" weight={500}>
                  {product.stock}
                </Text>
              </Group>

              <Group position="apart" spacing="xs" noWrap>
                {getProductStatus(product.status, 'w-full')}
                {getStockStatus(product.stock, 'w-full')}
              </Group>
            </Paper>
          ))}
        </>
      )}
    </>
  );
}

export default ProductList;
