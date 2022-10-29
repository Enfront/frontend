import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

import { Avatar, Badge, Box, Grid, Group, Paper, Stack, Table, Text, Title, useMantineTheme } from '@mantine/core';
import { Calendar, CalendarTime, Receipt } from 'tabler-icons-react';
import axios, { AxiosResponse } from 'axios';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';
import NumberFormat from 'react-number-format';

import DashboardLayout from '../../components/layouts/DashboardLayout';
import useAuth, { ProtectedRoute } from '../../contexts/AuthContext';
import useShop from '../../contexts/ShopContext';
import { Customer, DashboardProduct, DashboardStats, Order, StatsCard } from '../../types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();

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
      name: 'Last 7 Days Gross Revenue',
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
      id: 2,
      name: 'Gross Revenue',
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

  const getOrderCurrentStatus = (currentStatus: number): JSX.Element => {
    switch (currentStatus) {
      case -6:
        return (
          <Badge color="green" radius="xs">
            Chargeback Won
          </Badge>
        );
      case -5:
        return (
          <Badge color="red" radius="xs">
            Chargeback Lost
          </Badge>
        );
      case -4:
        return (
          <Badge color="yellow" radius="xs">
            Chargeback Pending
          </Badge>
        );
      case -3:
        return (
          <Badge color="indigo" radius="xs">
            Order Refunded
          </Badge>
        );
      case -2:
        return (
          <Badge color="yellow" radius="xs">
            Payment Denied
          </Badge>
        );
      case -1:
        return (
          <Badge color="red" radius="xs">
            Order Canceled
          </Badge>
        );
      case 0:
        return (
          <Badge color="yellow" radius="xs">
            Waiting for Payment
          </Badge>
        );
      case 1:
        return (
          <Badge color="indigo" radius="xs">
            Payment Confirmed
          </Badge>
        );
      case 2:
        return (
          <Badge color="indigo" radius="xs">
            Order in Progress
          </Badge>
        );
      case 3:
        return (
          <Badge color="green" radius="xs">
            Order Delivered
          </Badge>
        );
      default:
        return (
          <Badge color="red" radius="xs">
            Unknown
          </Badge>
        );
    }
  };

  const goToOrderDetails = (orderId: string): void => {
    router.push(`/dashboard/orders/${orderId}`);
  };

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
      tabTitle="Dashboard - Enfront"
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
          <Grid.Col span={4} key={item.name}>
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
          </Grid.Col>
        ))}

        <Grid.Col span={8}>
          <Paper p="md" radius="md" withBorder>
            <Title className="text-lg" order={2} mb={16}>
              Orders by Day
            </Title>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 0,
                  left: -22,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="1 3" />
                <XAxis dataKey="date" tick={{ fontSize: 14 }} tickMargin={12} tickLine={false} />
                <YAxis
                  dataKey="orders"
                  tick={{ fontSize: 14 }}
                  tickMargin={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip />
                <Area type="monotone" dataKey="orders" stroke="#228be6" fill="#4DABF7" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>

        <Grid.Col span={4}>
          <Paper p="md" radius="md" withBorder sx={{ height: 378 }}>
            <Title className="text-lg" order={2} mb={16}>
              Top Selling Products
            </Title>

            <Stack spacing="xl">
              {topProducts.current.map((product) => (
                <Link href={`/dashboard/products/${product.ref_id}`} key={product.name} passHref>
                  <Group className="cursor-pointer">
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

                    <div style={{ flex: 1 }}>
                      <Text size="sm" weight={500}>
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
                    </div>

                    <Text size="sm">{product.orders} Sold</Text>
                  </Group>
                </Link>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={8}>
          <Paper p="md" radius="md" sx={{ height: 400 }} withBorder>
            <Title className="text-lg" order={2} mb={16}>
              Latest Orders
            </Title>

            <Table verticalSpacing="md">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {newOrders.current.map((order) => (
                  <tr className="cursor-pointer" onClick={() => goToOrderDetails(order.ref_id)} key={order.ref_id}>
                    {order.email && <td>{order.email}</td>}

                    {!order.email && order.customer && order.customer.user.email && (
                      <td>{order.customer.user.email}</td>
                    )}

                    {!order.customer && !order.email && <td>Email Not Provided</td>}

                    <td>{format(parseISO(order.created_at), 'MMMM do, yyyy H:mma')}</td>
                    <td>
                      <NumberFormat
                        value={(order.total / 100).toFixed(2)}
                        prefix={getSymbolWithIsoCode(order.currency)}
                        displayType="text"
                        thousandSeparator
                      />
                    </td>
                    <td>{getOrderCurrentStatus(order.current_status)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
        </Grid.Col>

        <Grid.Col span={4}>
          <Paper p="md" radius="md" withBorder sx={{ height: 400 }}>
            <Title className="text-lg" order={2} mb={16}>
              New Customers
            </Title>

            <Stack spacing="xl">
              {newCustomers.current.map((item) => (
                <Link href={`/dashboard/customers/${item.user.ref_id}`} key={item.user.email} passHref>
                  <Group className="cursor-pointer">
                    <Avatar color="blue" radius="xl" />

                    <div style={{ flex: 1 }}>
                      <Text size="sm" weight={500}>
                        {item.user.username ?? 'Anonymous'}
                      </Text>

                      <Text color="dimmed" size="xs">
                        {item.user.email}
                      </Text>
                    </div>

                    {item.user.is_active ? (
                      <Badge color="green" radius="xs">
                        Registered
                      </Badge>
                    ) : (
                      <Badge color="yellow" radius="xs">
                        Anonymous
                      </Badge>
                    )}
                  </Group>
                </Link>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
