import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import axios, { AxiosResponse } from 'axios';
import { Search } from 'tabler-icons-react';
import { Button, Group, Stack, TextInput, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import ProductList from '../../../components/dashboard/products/ProductList';
import useShop from '../../../contexts/ShopContext';
import { ProtectedRoute } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Product } from '../../../types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 900px)');

  const { selectedShop } = useShop();

  const [products, setProducts] = useState<Product[]>([]);
  const [shownProducts, setShownProducts] = useState<Product[]>([]);

  const searchProducts = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.currentTarget;
    const data = products.filter((object: Product) => {
      const stringSomething = Object.values(object).toString().toLowerCase();
      return stringSomething.includes(value.toLowerCase());
    });

    setShownProducts(data);
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
      {isDesktop ? (
        <Group position="apart" mb={48}>
          <Title className="text-2xl" order={1}>
            All Products
          </Title>

          <Group>
            <TextInput
              onChange={(event: ChangeEvent<HTMLInputElement>) => searchProducts(event)}
              placeholder="Search for a product"
              aria-label="Search for a specific product"
              icon={<Search size={16} />}
            />

            <Link href="/dashboard/products/new" passHref>
              <Button component="a">Create Product</Button>
            </Link>
          </Group>
        </Group>
      ) : (
        <Stack mb={24}>
          <Title className="text-2xl" order={1}>
            All Products
          </Title>

          <TextInput
            onChange={(event: ChangeEvent<HTMLInputElement>) => searchProducts(event)}
            placeholder="Search for a product"
            aria-label="Search for a specific product"
            icon={<Search size={16} />}
          />

          <Link href="/dashboard/products/new" passHref>
            <Button component="a">Create Product</Button>
          </Link>
        </Stack>
      )}

      <ProductList isDesktop={isDesktop} router={router} selectedShop={selectedShop} shownProducts={shownProducts} />
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
