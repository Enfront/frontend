import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, Grid, Text, Title, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import axios, { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import { NumericFormat } from 'react-number-format';
import { Calendar, CalendarTime, Receipt } from 'tabler-icons-react';

import LatestOrders from '&/components/dashboard/index/LatestOrders';
import NewCustomers from '&/components/dashboard/index/NewCustomers';
import OrdersByDay from '&/components/dashboard/index/OrdersByDay';
import QuickStats from '&/components/dashboard/index/QuickStats';
import TopProducts from '&/components/dashboard/index/TopProducts';
import DashboardLayout from '&/components/layouts/DashboardLayout';
import useAuth, { ProtectedRoute } from '&/contexts/AuthContext';
import useShop from '&/contexts/ShopContext';
import { Customer, DashboardProduct, DashboardStats, Order, StatsCard } from '&/types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery('(min-width: 900px)');

  const { isProcessing, selectedShop } = useShop();
  const { userDetails } = useAuth();

  const topProducts = useRef<DashboardProduct[]>([]);
  const newCustomers = useRef<Customer[]>([]);
  const newOrders = useRef<Order[]>([]);
  const welcomeMessage = useRef<string>('');
  const [shopStats, setShopStats] = useState<DashboardStats>({
    all_orders: 0,
    past_orders: [],
    total_profit: 0,
    past_profit: 0,
  });

  const stats: StatsCard[] = [
    {
      id: 1,
      name: '7-Day Gross Revenue',
      stat: (
        <NumericFormat
          value={(shopStats.past_profit / 100).toFixed(2)}
          prefix={getSymbolWithIsoCode(selectedShop.currency)}
          displayType="text"
          thousandSeparator
        />
      ),
      icon: (
        <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
          <Calendar size={24} />
        </Box>
      ),
    },
    {
      id: 2,
      name: 'Gross Revenue',
      stat: (
        <NumericFormat
          value={(shopStats.total_profit / 100).toFixed(2)}
          prefix={getSymbolWithIsoCode(selectedShop.currency)}
          displayType="text"
          thousandSeparator
        />
      ),
      icon: (
        <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
          <CalendarTime size={24} />
        </Box>
      ),
    },
    {
      id: 3,
      name: 'Total Orders',
      stat: shopStats.all_orders,
      icon: (
        <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
          <Receipt size={24} />
        </Box>
      ),
    },
  ];

  const data = [...Array(7)].map((_, i: number): { date: string; orders: number } => {
    return {
      date: format(new Date().setDate(new Date().getDate() - 6 + i), 'MMM do'),
      orders: shopStats.past_orders[i] || 0,
    };
  });

  useEffect(() => {
    const getShopStats = async (): Promise<void> => {
      if (selectedShop.ref_id !== '' && !isProcessing) {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/shop/${selectedShop.ref_id}`)
          .then((response: AxiosResponse) => {
            setShopStats(response.data.data);
            newCustomers.current = response.data.data.new_customers;
            newOrders.current = response.data.data.new_orders;
            topProducts.current = response.data.data.top_products;
          });
      }
    };

    const getUsersTime = async (): Promise<void> => {
      const usersTime = new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' });

      switch (true) {
        case (usersTime >= '00:00' && usersTime <= '04:59') || (usersTime >= '18:00' && usersTime <= '23:59'):
          welcomeMessage.current = 'Good Evening';
          break;

        case usersTime >= '05:00' && usersTime <= '11:59':
          welcomeMessage.current = 'Good Morning';
          break;

        case usersTime >= '12:00' && usersTime <= '17:59':
          welcomeMessage.current = 'Good Afternoon';
          break;

        default:
          welcomeMessage.current = 'Welcome back';
          break;
      }
    };

    getShopStats();
    getUsersTime();
  }, [isProcessing, selectedShop.ref_id]);

  return (
    <DashboardLayout
      tabTitle="Dashboard | Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Title className="text-2xl" order={1} mb={4} weight={600}>
        {welcomeMessage.current}, {userDetails.username}!
      </Title>

      <Text size="sm" mb={32}>
        Here&apos;s what is happening with your shop today!
      </Text>

      <Grid>
        {stats.map((item: StatsCard) => (
          <Grid.Col span={12} md={4} key={item.name}>
            <QuickStats stats={item} />
          </Grid.Col>
        ))}

        <Grid.Col span={12} md={8}>
          <OrdersByDay data={data} />
        </Grid.Col>

        <Grid.Col span={12} md={4}>
          <TopProducts isDesktop={isDesktop} selectedShop={selectedShop} topProducts={topProducts} />
        </Grid.Col>

        {isDesktop && (
          <Grid.Col span={12} md={8}>
            <LatestOrders newOrders={newOrders} router={router} />
          </Grid.Col>
        )}

        <Grid.Col span={12} md={4}>
          <NewCustomers isDesktop={isDesktop} newCustomers={newCustomers} />
        </Grid.Col>
      </Grid>
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
