import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Grid, Group, Menu, Stack, Title, useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Ban, BrandPaypal, ChevronDown, UserOff } from 'tabler-icons-react';
import axios, { AxiosResponse } from 'axios';

import { ProtectedRoute } from '../../../contexts/AuthContext';
import useShop from '../../../contexts/ShopContext';

import DashboardLayout from '../../../components/layouts/DashboardLayout';
import Items from '../../../components/dashboard/orders/Items';
import Activity from '../../../components/dashboard/orders/Activity';
import Details from '../../../components/dashboard/orders/Details';
import { BlacklistFormData, Order, OrderComment, OrderGeoData, OrderItem, OrderStatus } from '../../../types/types';

export const initialViewedOrder: Order = {
  customer: {
    completed_order_count: 0,
    user: {
      email: '',
      first_name: '',
      last_name: '',
      username: '',
      is_active: false,
      ref_id: '',
      created_at: '',
      subscription_tier: 0,
    },
  },
  created_at: '',
  currency: '',
  current_status: 0,
  email: '',
  gateway: '',
  geo_data: {
    browser: '',
    city: '',
    country: '',
    ip_address: '',
    latitude: 0,
    longitude: 0,
    os: '',
    postal_code: '',
    region: '',
    using_vpn: false,
  },
  paypal_email: '',
  items: [],
  ref_id: '',
  shop: {
    domain: '',
    name: '',
    ref_id: '',
  },
  statuses: [],
  total: 0,
  updated_at: '',
};

function OrderId(): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();

  const { orderId } = router.query;
  const { selectedShop } = useShop();

  const [comments, setComments] = useState<number>(0);
  const [fulfilledOrder, setFulfilledOrder] = useState<boolean>(false);
  const [unfulfilledOrder, setUnfulfilledOrder] = useState<boolean>(false);
  const [viewedOrder, setViewedOrder] = useState<Order>(initialViewedOrder);

  const [customerData, setCustomerData] = useState<OrderGeoData>({
    browser: '',
    city: '',
    country: '',
    ip_address: '',
    latitude: 0,
    longitude: 0,
    os: '',
    postal_code: '',
    region: '',
    using_vpn: false,
  });

  const addToBlacklist = (type: 'user' | 'ip_address' | 'paypal_email', value: string): void => {
    const formData: BlacklistFormData = {
      [type]: value,
      shop: selectedShop.ref_id,
      note: `Created from order ${viewedOrder.ref_id}.`,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/blacklists`, formData)
      .then(() => {
        showNotification({
          title: 'Success!',
          message: 'A blacklist item has been created.',
          color: 'green',
        });
      })
      .catch(() => {
        showNotification({
          title: 'Uh Oh!',
          message: 'There was an issue creating the blacklist item.',
          color: 'red',
        });
      });
  };

  const countComments = (statuses: OrderStatus[] | OrderComment[]): void => {
    let commentCounter = 0;
    statuses.forEach((status: OrderStatus | OrderComment) => {
      if ((status as OrderComment).comment !== undefined) {
        commentCounter += 1;
      }
    });

    setComments(commentCounter);
  };

  const getOrderInfo = useCallback(async (): Promise<void> => {
    if (orderId != null) {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`)
        .then((response: AxiosResponse) => {
          response.data.data.items.forEach((item: OrderItem) => {
            if (item.current_status >= 1) {
              setFulfilledOrder(true);
            } else {
              setUnfulfilledOrder(true);
            }
          });

          countComments(response.data.data.statuses);
          setCustomerData(response.data.data.geo_data);
          setViewedOrder(response.data.data);
        })
        .catch(() => {
          router.push('/dashboard/orders');

          showNotification({
            title: 'Order Not Found',
            message: 'There was an issue trying to find the order you were looking for.',
            color: 'red',
          });
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    getOrderInfo();

    return () => {
      setViewedOrder(initialViewedOrder);
      setFulfilledOrder(false);
      setUnfulfilledOrder(false);
      setComments(0);
    };
  }, [getOrderInfo, orderId]);

  return (
    <DashboardLayout
      tabTitle="Order Details | Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Grid
        className={`${
          theme.colorScheme === 'dark' ? 'divide-[#373A40]' : 'divide-[#dee2e6]'
        } divide-x divide-y-0 divide-solid`}
      >
        <Grid.Col
          className={`${
            theme.colorScheme === 'dark' ? 'divide-[#373A40]' : 'divide-[#dee2e6]'
          } divide-x-0 divide-y divide-solid`}
          span={8}
          mt={24}
          pr={32}
        >
          <Group position="apart" mb={16}>
            <Title className="text-2xl" order={1}>
              {orderId}
            </Title>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button className="pr-3" variant="outline" rightIcon={<ChevronDown size={14} />}>
                  Actions
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>BlacklistItem</Menu.Label>

                {viewedOrder.paypal_email && (
                  <Menu.Item
                    onClick={() => addToBlacklist('paypal_email', viewedOrder.paypal_email)}
                    icon={<BrandPaypal size={14} />}
                  >
                    Ban PayPal Email
                  </Menu.Item>
                )}

                <Menu.Item
                  onClick={() => addToBlacklist('ip_address', customerData.ip_address)}
                  icon={<Ban size={14} />}
                >
                  Ban IP Address
                </Menu.Item>

                {viewedOrder.customer.user && (
                  <Menu.Item
                    onClick={() => addToBlacklist('user', viewedOrder.customer.user.ref_id)}
                    icon={<UserOff size={14} />}
                  >
                    Ban User
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Items fulfilledOrder={fulfilledOrder} unfulfilledOrder={unfulfilledOrder} viewedOrder={viewedOrder} />

          <Stack pt={16}>
            <Title className="text-xl" order={2}>
              Order Activity
            </Title>

            <Activity getOrderInfo={getOrderInfo} orderId={orderId} viewedOrder={viewedOrder} />
          </Stack>
        </Grid.Col>

        <Grid.Col span={4} pl={32}>
          <Title className="text-xl" order={2}>
            Order Details
          </Title>

          <Details commentCount={comments} customerData={customerData} viewedOrder={viewedOrder} />
        </Grid.Col>
      </Grid>
    </DashboardLayout>
  );
}

export default ProtectedRoute(OrderId);
