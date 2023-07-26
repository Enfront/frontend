import { Dispatch, SetStateAction } from 'react';
import { NextRouter } from 'next/router';

import { Badge, Divider, Group, Pagination, Paper, Stack, Table, Text } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import NumberFormat from 'react-number-format';

import { Order, OrderPagination, ShopData } from '&/types/types';

interface OrderListProps {
  isDesktop: boolean;
  page: number;
  orders: OrderPagination;
  router: NextRouter;
  setPage: Dispatch<SetStateAction<number>>;
  selectedShop: ShopData;
  shownOrders: Order[];
}

function OrderList({
  isDesktop,
  page,
  orders,
  router,
  setPage,
  selectedShop,
  shownOrders,
}: OrderListProps): JSX.Element {
  const goToOrderDetails = (orderId: string): void => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  const changeOrderPage = (pageNumber: number): void => {
    // eslint-disable-next-line no-param-reassign
    router.query.page = pageNumber.toString();
    router.push(router);
    setPage(pageNumber);
  };

  const getOrderCurrentStatus = (currentStatus: number, classes?: string): JSX.Element => {
    switch (currentStatus) {
      case -6:
        return (
          <Badge className={classes} color="green" radius="xs">
            Chargeback Won
          </Badge>
        );
      case -5:
        return (
          <Badge className={classes} color="red" radius="xs">
            Chargeback Lost
          </Badge>
        );
      case -4:
        return (
          <Badge className={classes} color="yellow" radius="xs">
            Chargeback Pending
          </Badge>
        );
      case -3:
        return (
          <Badge className={classes} color="indigo" radius="xs">
            Order Refunded
          </Badge>
        );
      case -2:
        return (
          <Badge className={classes} color="yellow" radius="xs">
            Payment Denied
          </Badge>
        );
      case -1:
        return (
          <Badge className={classes} color="red" radius="xs">
            Order Canceled
          </Badge>
        );
      case 0:
        return (
          <Badge className={classes} color="yellow" radius="xs">
            Waiting for Payment
          </Badge>
        );
      case 1:
        return (
          <Badge className={classes} color="indigo" radius="xs">
            Payment Confirmed
          </Badge>
        );
      case 2:
        return (
          <Badge className={classes} color="indigo" radius="xs">
            Order in Progress
          </Badge>
        );
      case 3:
        return (
          <Badge className={classes} color="green" radius="xs">
            Order Delivered
          </Badge>
        );
      default:
        return (
          <Badge className={classes} color="red" radius="xs">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <>
      {isDesktop ? (
        <Table verticalSpacing="md" highlightOnHover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Order Date</th>
              <th>Gateway</th>
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
                    <Text transform="capitalize">{order.gateway ?? 'None'}</Text>
                  </td>

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
      ) : (
        <>
          {shownOrders.map((order: Order) => (
            <Paper
              p={16}
              radius="md"
              shadow="sm"
              mb={16}
              onClick={() => goToOrderDetails(order.ref_id)}
              key={order.ref_id}
              withBorder
            >
              <Stack spacing={2}>
                <Text size="xs" weight={500} lineClamp={1}>
                  {order.ref_id}
                </Text>

                <Text color="dimmed" size="xs" lineClamp={1}>
                  {order.email}
                </Text>
              </Stack>

              <Divider my="sm" />

              <Group position="apart" mb={8} noWrap>
                <Text color="dimmed" size="xs">
                  Total
                </Text>

                <Text size="xs" weight={500}>
                  <NumberFormat
                    value={(order.total / 100).toFixed(2)}
                    prefix={getSymbolWithIsoCode(selectedShop.currency)}
                    displayType="text"
                    thousandSeparator
                  />
                </Text>
              </Group>

              <Group position="apart" mb={8} noWrap>
                <Text color="dimmed" size="xs">
                  Gateway
                </Text>

                <Text size="xs" weight={500} transform="capitalize">
                  {order.gateway ?? 'None'}
                </Text>
              </Group>

              <Group position="apart" mb={8} noWrap>
                <Text color="dimmed" size="xs">
                  Created
                </Text>

                <Text size="xs" weight={500}>
                  {format(parseISO(order.created_at), 'MMM do, H:mma')}
                </Text>
              </Group>

              {getOrderCurrentStatus(order.current_status, 'w-full')}
            </Paper>
          ))}
        </>
      )}

      {shownOrders.length > 0 && (
        <Pagination
          value={page}
          onChange={changeOrderPage}
          total={Math.ceil(orders.count / 10)}
          position={isDesktop ? 'right' : 'center'}
          size={isDesktop ? 'md' : 'sm'}
          withEdges={isDesktop}
          mt={48}
        />
      )}
    </>
  );
}

export default OrderList;
