import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Group, Stack, TextInput, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Search } from 'tabler-icons-react';
import axios, { AxiosResponse } from 'axios';

import CustomerList from '../../../components/dashboard/customers/CustomerList';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import useShop from '../../../contexts/ShopContext';
import { ProtectedRoute } from '../../../contexts/AuthContext';
import { Customer, CustomerPagination } from '../../../types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 900px)');

  const { selectedShop } = useShop();

  const [page, setPage] = useState<number>(router.query.page ? parseInt(router.query.page as string, 10) : 1);

  const [customers, setCustomers] = useState<CustomerPagination>({
    count: 0,
    next: '',
    previous: '',
    results: [],
  });

  const [shownCustomers, setShownCustomers] = useState<Customer[]>([
    {
      completed_order_count: 0,
      user: {
        created_at: '',
        email: '',
        first_name: '',
        last_name: '',
        ref_id: '',
        username: '',
        subscription_tier: 0,
        is_active: false,
      },
    },
  ]);

  const searchCustomers = (event: ChangeEvent<HTMLInputElement>): void => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/customers/shop/${selectedShop.ref_id}?q=${event.target.value}`)
      .then((response: AxiosResponse) => {
        setCustomers(response.data.data);
        setShownCustomers(response.data.data.results);
      });
  };

  useEffect(() => {
    const getAllCustomers = async (): Promise<void> => {
      if (selectedShop.ref_id !== '') {
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/customers/shop/${selectedShop.ref_id}?page=${page}`)
          .then((response: AxiosResponse) => {
            setCustomers(response.data.data);
            setShownCustomers(response.data.data.results);
          });
      }
    };

    getAllCustomers();
  }, [page, selectedShop]);

  return (
    <DashboardLayout
      tabTitle="Dashboard - Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      {isDesktop ? (
        <Group position="apart" mb={48}>
          <Title className="text-2xl" order={1}>
            All Customers
          </Title>

          <TextInput
            onChange={(event: ChangeEvent<HTMLInputElement>) => searchCustomers(event)}
            placeholder="Search for a customer"
            aria-label="Search for a specific customer"
            icon={<Search size={16} />}
          />
        </Group>
      ) : (
        <Stack mb={24}>
          <Title className="text-2xl" order={1}>
            All Customers
          </Title>

          <TextInput
            onChange={(event: ChangeEvent<HTMLInputElement>) => searchCustomers(event)}
            placeholder="Search for a customer"
            aria-label="Search for a specific customer"
            icon={<Search size={16} />}
          />
        </Stack>
      )}

      <CustomerList
        customers={customers}
        isDesktop={isDesktop}
        page={page}
        router={router}
        setPage={setPage}
        shownCustomers={shownCustomers}
      />
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
