import { useEffect, useState } from 'react';

import { Box, Group, Paper, SimpleGrid, Text, Title, useMantineTheme } from '@mantine/core';
import { Calendar, CalendarTime, Receipt } from 'tabler-icons-react';
import axios, { AxiosResponse } from 'axios';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import NumberFormat from 'react-number-format';

import DashboardLayout from '../../components/layouts/DashboardLayout';
import { ProtectedRoute } from '../../contexts/AuthContext';
import useShop from '../../contexts/ShopContext';
import { DashboardStats, StatsCard } from '../../types/types';

function Index(): JSX.Element {
  const theme = useMantineTheme();

  const { selectedShop } = useShop();

  const [shopStats, setShopStats] = useState<DashboardStats>({
    all_orders: 0,
    past_orders: [],
    total_profit: 0,
    past_profit: 0,
  });

  const stats: StatsCard[] = [
    {
      id: 1,
      name: 'Total Orders',
      stat: shopStats.all_orders,
      icon: (
        <Box sx={{ color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4] }}>
          <Receipt size={24} />
        </Box>
      ),
    },
    {
      id: 2,
      name: 'Last 7 Days Gross Revenue',
      // stat: getSymbolWithIsoCode(selectedShop.currency) + (shopStats.past_profit / 100).toFixed(2),
      stat: (
        <NumberFormat
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
      id: 3,
      name: 'Gross Revenue',
      // stat: getSymbolWithIsoCode(selectedShop.currency) + (shopStats.total_profit / 100).toFixed(2),
      stat: (
        <NumberFormat
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
  ];

  const data = [...Array(7)].map((_, i: number): { date: string; orders: number } => {
    return {
      date: format(new Date().setDate(new Date().getDate() - 6 + i), 'MMM do'),
      orders: shopStats.past_orders[i] || 0,
    };
  });

  useEffect(() => {
    if (selectedShop.ref_id !== '') {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/shop/${selectedShop.ref_id}`)
        .then((response: AxiosResponse) => {
          setShopStats(response.data.data);
        });
    }
  }, [selectedShop.ref_id]);

  return (
    <DashboardLayout
      tabTitle="Dashboard - Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Title order={1} mb={16}>
        Welcome back!
      </Title>

      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        {stats.map((item: StatsCard) => (
          <Paper withBorder p="md" radius="md" key={item.id}>
            <Group position="apart">
              <Text className="font-bold" size="sm" color="dimmed">
                {item.name}
              </Text>

              {item.icon}
            </Group>

            <Group align="flex-end" spacing="xs" mt={25}>
              <Text className="text-2xl font-bold">{item.stat}</Text>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      <div className="my-16" style={{ height: '450px' }}>
        <Title order={2} mb={16}>
          Orders
        </Title>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 14 }} tickMargin={12} />
            <YAxis dataKey="orders" tick={{ fontSize: 14 }} tickMargin={12} />
            <Tooltip />
            <Area type="monotone" dataKey="orders" stroke="#228be6" fill="#4DABF7" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
