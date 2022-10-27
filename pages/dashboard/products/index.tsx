import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import axios, { AxiosResponse } from 'axios';
import NumberFormat from 'react-number-format';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import { Edit, Search } from 'tabler-icons-react';
import { ActionIcon, Badge, Box, Button, Group, Table, Text, TextInput, Title, useMantineTheme } from '@mantine/core';

import useShop from '../../../contexts/ShopContext';
import { ProtectedRoute } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Product } from '../../../types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();

  const { selectedShop } = useShop();

  const [products, setProducts] = useState<Product[]>([]);
  const [shownProducts, setShownProducts] = useState<Product[]>([]);

  const gotoProductDetails = (refId: string): void => {
    router.push(`/dashboard/products/${refId}`);
  };

  const gotoEditProduct = (refId: string): void => {
    router.push({
      pathname: `/dashboard/products/${refId}`,
      query: { edit: true },
    });
  };

  const searchProducts = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.currentTarget;
    const data = products.filter((object: Product) => {
      const stringSomething = Object.values(object).toString().toLowerCase();
      return stringSomething.includes(value.toLowerCase());
    });

    setShownProducts(data);
  };

  const getStockStatus = (stockCount: number): JSX.Element => {
    if (stockCount === 0) {
      return (
        <Badge color="red" radius="xs">
          Out of Stock
        </Badge>
      );
    }

    if (stockCount > 0 && stockCount < 10) {
      return (
        <Badge color="yellow" radius="xs">
          Limited Stock
        </Badge>
      );
    }

    return (
      <Badge color="green" radius="xs">
        In Stock
      </Badge>
    );
  };

  const getProductStatus = (status: number): JSX.Element => {
    if (status === 1) {
      return (
        <Badge color="green" radius="xs">
          Listed
        </Badge>
      );
    }

    return (
      <Badge color="red" radius="xs">
        Unlisted
      </Badge>
    );
  };

  const getProducts = useCallback((): void => {
    if (selectedShop.ref_id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/products/shop/${selectedShop.ref_id}`)
        .then((response: AxiosResponse) => {
          setProducts(response.data.data);
          setShownProducts(response.data.data);
        })
        .catch(() => {
          setProducts([]);
          setShownProducts([]);
        });
    }
  }, [selectedShop]);

  useEffect(() => {
    getProducts();

    return () => {
      setShownProducts([]);
    };
  }, [getProducts]);

  return (
    <DashboardLayout
      tabTitle="Dashboard - Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Group position="apart" mb={24}>
        <Title className="text-2xl" order={1}>
          All Products
        </Title>

        <Link href="/dashboard/products/new" passHref>
          <Button component="a">Create Product</Button>
        </Link>
      </Group>

      <Box
        sx={{
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        }}
      >
        <div className="mb-10 flex justify-between rounded-md p-4">
          <TextInput
            className="w-4/12"
            onChange={(event: ChangeEvent<HTMLInputElement>) => searchProducts(event)}
            placeholder="Search"
            label="Search for products"
            icon={<Search size={16} />}
          />
        </div>
      </Box>

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
                          layout="fill"
                          alt={`${product.name} product image`}
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
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
