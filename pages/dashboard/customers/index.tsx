import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Badge, Box, Group, Pagination, Table, Text, TextInput, Title, useMantineTheme } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import axios, { AxiosResponse } from 'axios';
import { format, parseISO } from 'date-fns';

import DashboardLayout from '../../../components/layouts/DashboardLayout';
import useShop from '../../../contexts/ShopContext';
import { ProtectedRoute } from '../../../contexts/AuthContext';
import { Customer, CustomerPagination } from '../../../types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();

  const { selectedShop } = useShop();

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

  const [page, setPage] = useState(router.query.page ? parseInt(router.query.page as string, 10) : 1);

  const searchCustomers = (event: ChangeEvent<HTMLInputElement>): void => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/customers/shop/${selectedShop.ref_id}?q=${event.target.value}`)
      .then((response: AxiosResponse) => {
        setCustomers(response.data.data);
        setShownCustomers(response.data.data.results);
      });
  };

  const changeCustomerPage = (pageNumber: number): void => {
    router.query.page = pageNumber.toString();
    router.push(router);
    setPage(pageNumber);
  };

  const gotoCustomerDetails = (customerId: string): void => {
    router.push(`/dashboard/customers/${customerId}`);
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
      <Group mb={24}>
        <Title order={1}>All Customers</Title>
      </Group>

      <Box
        sx={{
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        }}
      >
        <div className="mb-10 flex justify-between rounded-md p-4">
          <TextInput
            className="w-4/12"
            onChange={(event: ChangeEvent<HTMLInputElement>) => searchCustomers(event)}
            placeholder="Search"
            label="Search for a customer"
            icon={<Search size={16} />}
          />
        </div>
      </Box>

      <Table verticalSpacing="md" highlightOnHover>
        <thead>
          <tr>
            <th>Date Added</th>
            <th>Email</th>
            <th>Completed Orders</th>
            <th>Status</th>
          </tr>
        </thead>
        {shownCustomers.length > 0 ? (
          <tbody>
            {shownCustomers.map((customer: Customer) => (
              <tr
                className="cursor-pointer"
                onClick={() => gotoCustomerDetails(customer.user.ref_id)}
                key={customer.user.ref_id}
              >
                <td>
                  {customer.user.created_at ? format(parseISO(customer.user.created_at), 'MMMM do, yyyy H:mma') : ''}
                </td>
                <td>{customer.user.email}</td>
                <td>{customer.completed_order_count}</td>
                <td>
                  {customer.user.is_active ? (
                    <Badge color="green" radius="xs">
                      Registered
                    </Badge>
                  ) : (
                    <Badge color="yellow" radius="xs">
                      Anonymous
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={5}>
                <Text align="center" color="dimmed" size="md">
                  No customers found
                </Text>
              </td>
            </tr>
          </tbody>
        )}
      </Table>

      {customers.count >= 10 && (
        <Pagination
          className="mt-12"
          page={page}
          onChange={changeCustomerPage}
          total={Math.floor(customers.count / 10)}
          position="right"
          withEdges
        />
      )}
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
