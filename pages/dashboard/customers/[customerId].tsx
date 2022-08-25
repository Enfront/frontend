import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, Divider, Stack, useMantineTheme } from '@mantine/core';
import { Calendar, Coin, Receipt, Receipt2 } from 'tabler-icons-react';
import axios, { AxiosResponse } from 'axios';
import { format, parseISO } from 'date-fns';

import { ProtectedRoute } from '../../../contexts/AuthContext';
import useShop from '../../../contexts/ShopContext';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Details from '../../../components/dashboard/customers/Details';
import Notes from '../../../components/dashboard/customers/Notes';
import OrderHistory from '../../../components/dashboard/customers/OrderHistory';
import { CustomerDetails, Note, Order, StatsCard } from '../../../types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();

  const { customerId } = router.query;
  const { selectedShop } = useShop();

  const [customer, setCustomer] = useState<CustomerDetails>({
    all_order_count: 0,
    completed_order_count: 0,
    total_spent: 0,
    orders: {
      count: 0,
      next: undefined,
      previous: undefined,
      results: [],
    },
    user: {
      created_at: '',
      email: '',
      first_name: '',
      is_active: false,
      last_name: '',
      ref_id: '',
      username: '',
      subscription_tier: 0,
    },
  });

  const [notes, setNotes] = useState<Note[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<StatsCard[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);

  const getCustomerInfo = async (): Promise<void> => {
    if (customerId && selectedShop.ref_id !== '') {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}/shop/${selectedShop.ref_id}?page=${page}`)
        .then((response: AxiosResponse) => {
          setCustomer(response.data.data);
          setOrders(response.data.data.orders.results);
          setTotalOrdersCount(response.data.data.all_order_count);

          setStats([
            {
              id: 1,
              name: 'Register Date',
              stat: format(parseISO(response.data.data.user.created_at), 'MMMM do, yyyy'),
              icon: (
                <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
                  <Calendar size={24} />
                </Box>
              ),
            },
            {
              id: 2,
              name: 'Completed Orders',
              stat: response.data.data.completed_order_count,
              icon: (
                <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
                  <Receipt2 size={24} />
                </Box>
              ),
            },
            {
              id: 3,
              name: 'Total Orders',
              stat: response.data.data.all_order_count,
              icon: (
                <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
                  <Receipt size={24} />
                </Box>
              ),
            },
            {
              id: 4,
              name: 'Total Spent',
              stat: `$ ${(response.data.data.total_spent / 100).toFixed(2)}`,
              icon: (
                <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
                  <Coin size={24} />
                </Box>
              ),
            },
          ]);
        });
    }
  };

  const getCustomerNotes = async (): Promise<void> => {
    if (customerId) {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}/note`)
        .then((response: AxiosResponse) => {
          setNotes(response.data.data);
        });
    }
  };

  useEffect(() => {
    getCustomerNotes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  useEffect(() => {
    getCustomerInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, page, selectedShop]);

  return (
    <DashboardLayout
      tabTitle="Dashboard - Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Stack>
        <Details
          customer={customer}
          customerId={customerId}
          getCustomerInfo={getCustomerInfo}
          getCustomerNotes={getCustomerNotes}
          stats={stats}
        />

        <Divider my={24} />

        {notes && notes.length > 0 && (
          <>
            <Notes getCustomerNotes={getCustomerNotes} notes={notes} />
            <Divider my={24} />
          </>
        )}

        <OrderHistory orders={orders} setPage={setPage} totalOrdersCount={totalOrdersCount} />
      </Stack>
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
