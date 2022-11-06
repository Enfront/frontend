import { MutableRefObject } from 'react';
import { NextRouter } from 'next/router';

import { Badge, Paper, Table, Title } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import NumberFormat from 'react-number-format';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';

import { Order } from '../../../types/types';

interface LatestOrdersProps {
  newOrders: MutableRefObject<Order[]>;
  router: NextRouter;
}

function LatestOrders({ newOrders, router }: LatestOrdersProps): JSX.Element {
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

  return (
    <Paper className="no-scrollbar overflow-x-auto overflow-y-hidden" p="md" radius="md" h={400} withBorder>
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
            <tr
              className="cursor-pointer whitespace-nowrap"
              onClick={() => goToOrderDetails(order.ref_id)}
              key={order.ref_id}
            >
              {order.email && <td>{order.email}</td>}
              {!order.customer.user.email && !order.email && <td>Email Not Provided</td>}
              {!order.email && order.customer && order.customer.user.email && <td>{order.customer.user.email}</td>}

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
  );
}

export default LatestOrders;
