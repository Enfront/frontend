import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';

import { Avatar, Badge, Pagination, Stack, Table, Text, Title } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import NumberFormat from 'react-number-format';

import { CustomerOrder, OrderItem } from '&/types/types';

interface OrderHistoryProps {
  orders: CustomerOrder[];
  setPage: Dispatch<SetStateAction<number>>;
  totalOrdersCount: number;
}

function OrderHistory({ orders, setPage, totalOrdersCount }: OrderHistoryProps): JSX.Element {
  const router = useRouter();

  const gotoOrder = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}`);
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

  return (
    <Stack spacing={0}>
      <Title className="text-xl" order={2}>
        Order History
      </Title>

      <Table verticalSpacing="md" highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Items</th>
            <th>Order Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        {totalOrdersCount > 0 ? (
          <tbody>
            {orders.map((order: CustomerOrder) => (
              <tr className="cursor-pointer" onClick={() => gotoOrder(order.ref_id)} key={order.ref_id}>
                <td>{order.ref_id}</td>
                <td>
                  <Avatar.Group>
                    {order.items.map((item: OrderItem) => (
                      <Avatar
                        className="outline outline-1 outline-offset-[-2px] outline-gray-300"
                        src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_URL}${item.images[0].path}`}
                        size="lg"
                        radius="sm"
                        key={item.ref_id}
                      />
                    ))}
                  </Avatar.Group>
                </td>
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
              <td colSpan={5}>
                <Text align="center" color="dimmed" size="md">
                  No orders found
                </Text>
              </td>
            </tr>
          </tbody>
        )}
      </Table>

      {totalOrdersCount > 10 && (
        <Pagination
          className="my-12"
          onChange={setPage}
          total={Math.floor(totalOrdersCount / 10)}
          position="right"
          withEdges
        />
      )}
    </Stack>
  );
}

export default OrderHistory;
