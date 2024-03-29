import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Flex, TextInput, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import axios, { AxiosResponse } from 'axios';
import { Search } from 'tabler-icons-react';

import EmptyMessage from '&/components/dashboard/EmptyMessage';
import OrderList from '&/components/dashboard/orders/OrderList';
import DashboardLayout from '&/components/layouts/DashboardLayout';
import { ProtectedRoute } from '&/contexts/AuthContext';
import useShop from '&/contexts/ShopContext';
import { Order, OrderPagination } from '&/types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 900px)');

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
      tabTitle="Orders | Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      {shownOrders.length > 0 ? (
        <>
          <Flex
            align={isDesktop ? 'center' : 'stretch'}
            direction={isDesktop ? 'row' : 'column'}
            gap={16}
            justify="space-between"
            mb={isDesktop ? 48 : 24}
          >
            <Title className="text-2xl" order={1}>
              All Orders
            </Title>

            <TextInput
              onChange={(event: ChangeEvent<HTMLInputElement>) => searchOrders(event)}
              placeholder="Search for an order"
              aria-label="Search for a specific order"
              icon={<Search size={16} />}
            />
          </Flex>

          <OrderList
            isDesktop={isDesktop}
            orders={orders}
            page={page}
            router={router}
            selectedShop={selectedShop}
            setPage={setPage}
            shownOrders={shownOrders}
          />
        </>
      ) : (
        <EmptyMessage
          title="You Have No Orders"
          description="When you do, they will show up here."
          url="/dashboard/products/new"
        />
      )}
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
