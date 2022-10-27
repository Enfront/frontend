import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import axios, { AxiosResponse } from 'axios';
import NumberFormat from 'react-number-format';
import { format, parseISO } from 'date-fns';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import { Search } from 'tabler-icons-react';
import { Badge, Box, Pagination, Table, Text, TextInput, Title, useMantineTheme } from '@mantine/core';

import useShop from '../../../contexts/ShopContext';
import { ProtectedRoute } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Order, OrderPagination } from '../../../types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();
  const { selectedShop } = useShop();

  const initialOrder: OrderPagination = {
    count: 0,
    next: '',
    previous: '',
    results: [],
  };

  const [orders, setOrders] = useState<OrderPagination>(initialOrder);
  const [shownOrders, setShownOrders] = useState<Order[]>([]);
  const [page, setPage] = useState<number>(router.query.page ? parseInt(router.query.page as string, 10) : 1);

  const goToOrderDetails = (orderId: string): void => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  const changeOrderPage = (pageNumber: number): void => {
    router.query.page = pageNumber.toString();
    router.push(router);
    setPage(pageNumber);
  };

  const searchOrders = (event: ChangeEvent<HTMLInputElement>): void => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/shop/${selectedShop.ref_id}?q=${event.target.value}`)
      .then((response: AxiosResponse) => {
        setOrders(response.data.data);
        setShownOrders(response.data.data.results);
      })
      .catch(() => {
        setOrders(initialOrder);
        setShownOrders([]);
      });
  };

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

  useEffect(() => {
    const getOrders = (): void => {
      if (selectedShop.ref_id !== '') {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/shop/${selectedShop.ref_id}?page=${page}`)
          .then((response: AxiosResponse) => {
            setOrders(response.data.data);
            setShownOrders(response.data.data.results);
          })
          .catch(() => {
            setOrders(initialOrder);
            setShownOrders([]);
          });
      }
    };

    getOrders();

    return () => {
      setShownOrders([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShop, page]);

  return (
    <DashboardLayout
      tabTitle="Dashboard - Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Title className="text-2xl" order={1} mb={24}>
        All Orders
      </Title>

      <Box
        sx={{
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        }}
      >
        <div className="mb-10 flex justify-between rounded-md p-4">
          <TextInput
            className="w-4/12"
            onChange={(event: ChangeEvent<HTMLInputElement>) => searchOrders(event)}
            placeholder="Search"
            label="Search for orders"
            icon={<Search size={16} />}
          />
        </div>
      </Box>

      <Table verticalSpacing="md" highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Order Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        {shownOrders.length > 0 ? (
          <tbody>
            {shownOrders.map((order: Order) => (
              <tr className="cursor-pointer" onClick={() => goToOrderDetails(order.ref_id)} key={order.ref_id}>
                <td>{order.ref_id}</td>

                {order.email && <td>{order.email}</td>}

                {!order.email && order.customer && order.customer.user.email && <td>{order.customer.user.email}</td>}

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
        ) : (
          <tbody>
            <tr>
              <td colSpan={6}>
                <Text align="center" color="dimmed" size="md">
                  No orders found
                </Text>
              </td>
            </tr>
          </tbody>
        )}
      </Table>

      {shownOrders.length > 0 && (
        <Pagination
          className="mt-12"
          page={page}
          onChange={changeOrderPage}
          total={Math.ceil(orders.count / 10)}
          position="right"
          withEdges
        />
      )}
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
