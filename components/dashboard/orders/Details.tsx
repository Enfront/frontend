import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Anchor, Badge, Group, Popover, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import {
  AccessPoint,
  BrandPaypal,
  BrandStripe,
  Calendar,
  CurrencyBitcoin,
  DeviceDesktop,
  Lock,
  Mail,
  MapPin,
  Message,
  Receipt2,
  Signature,
  User,
} from 'tabler-icons-react';

import { Order, OrderGeoData } from '&/types/types';

const DeviceMap = dynamic(() => import('./DeviceMap'), { ssr: false });

interface OrderDetailsProps {
  commentCount: number;
  customerData: OrderGeoData;
  viewedOrder: Order;
}

function Details({ commentCount, customerData, viewedOrder }: OrderDetailsProps): JSX.Element {
  const theme = useMantineTheme();

  const [opened, setOpened] = useState<boolean>(false);

  const getOrderGatewayIcon = (gateway: string): JSX.Element => {
    switch (gateway) {
      case 'paypal':
        return <BrandPaypal className="h-5 w-5 text-gray-400" />;
      case 'stripe':
        return <BrandStripe className="h-5 w-5 text-gray-400" />;
      case 'bitcoin':
        return <CurrencyBitcoin className="h-5 w-5 text-gray-400" />;
      default:
        return <Receipt2 className="h-5 w-5 text-gray-400" />;
    }
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
          <Badge color="blue" radius="xs">
            Refunded
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
            Canceled
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
          <Badge color="blue" radius="xs">
            Payment Confirmed
          </Badge>
        );
      case 2:
        return (
          <Badge color="blue" radius="xs">
            In Progress
          </Badge>
        );
      case 3:
        return (
          <Badge color="green" radius="xs">
            Completed
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
    <Stack
      className={`${
        theme.colorScheme === 'dark' ? 'divide-[#373A40]' : 'divide-[#dee2e6]'
      } divide-x-0 divide-y divide-solid`}
    >
      <Stack spacing="xs">
        <Group mt={16}>
          <AccessPoint className="h-5 w-5 text-gray-400" />
          {getOrderCurrentStatus(viewedOrder.current_status)}
        </Group>

        {viewedOrder.gateway && (
          <Group mt={8}>
            {getOrderGatewayIcon(viewedOrder.gateway)}

            <Text size="sm" transform="capitalize">
              Paid with {viewedOrder.gateway}
            </Text>
          </Group>
        )}

        <Group mt={8}>
          <Message className="h-5 w-5 text-gray-400" />
          <Text size="sm">{commentCount} comment(s)</Text>
        </Group>

        <Group mt={8}>
          <Calendar className="h-5 w-5 text-gray-400" />
          {viewedOrder.created_at !== '' && (
            <Text size="sm">
              Created on{' '}
              <time dateTime={viewedOrder.created_at}>
                {format(parseISO(viewedOrder.created_at), 'MMM do, yyyy H:mma')}
              </time>
            </Text>
          )}
        </Group>

        <Group mt={8}>
          <Calendar className="h-5 w-5 text-gray-400" />
          {viewedOrder.updated_at !== '' && (
            <Text size="sm">
              Last updated on{' '}
              <time dateTime={viewedOrder.updated_at}>
                {format(parseISO(viewedOrder.updated_at), 'MMM do, yyyy H:mma')}
              </time>
            </Text>
          )}
        </Group>
      </Stack>

      <Stack
        className={`${
          theme.colorScheme === 'dark' ? 'divide-[#373A40]' : 'divide-[#dee2e6]'
        } divide-x-0 divide-y divide-solid`}
      >
        <Stack spacing="xs" pt={16}>
          <Title className="text-xl" order={2}>
            Customer Details
          </Title>

          <Group mt={8}>
            <User className="h-5 w-5 text-gray-400" />
            <Link href={`/dashboard/customers/${viewedOrder.customer.user.ref_id}`} passHref>
              <Anchor>
                <Text size="sm">
                  {viewedOrder.customer.user.is_active ? viewedOrder.customer.user.username : 'Anonymous Customer'}
                </Text>
              </Anchor>
            </Link>
          </Group>

          {viewedOrder.customer.user.first_name && (
            <Group mt={8}>
              <Signature className="h-5 w-5 text-gray-400" />
              <Text size="sm" transform="capitalize">
                {viewedOrder.customer.user.first_name} {viewedOrder.customer.user.last_name}
              </Text>
            </Group>
          )}

          <Group mt={8}>
            <Mail className="h-5 w-5 text-gray-400" />
            <Text size="sm">
              {viewedOrder.customer.user.email ? <>{viewedOrder.customer.user.email}</> : <>Waiting For Email</>}
            </Text>
          </Group>

          {viewedOrder.paypal_email && (
            <Group mt={8}>
              <BrandPaypal className="h-5 w-5 text-gray-400" />
              <Text size="sm">{viewedOrder.paypal_email}</Text>
            </Group>
          )}
        </Stack>

        {customerData && customerData.ip_address !== '' && (
          <Stack spacing="xs" pt={16}>
            <Title className="text-xl" order={2}>
              Customer Device Details
            </Title>

            <Group mt={8}>
              <DeviceDesktop className="h-5 w-5 text-gray-400" />

              <Text size="sm">
                {customerData.browser}, {customerData.os}
              </Text>
            </Group>

            <Group mt={8}>
              <Lock className="h-5 w-5 text-gray-400" />
              <Text size="sm">{customerData.using_vpn ? 'VPN Enabled' : 'Not Using a VPN'}</Text>
            </Group>

            {customerData.latitude && (
              <Group mt={8}>
                <MapPin className="h-5 w-5 text-gray-400" />

                <Popover
                  onChange={() => setOpened(false)}
                  opened={opened}
                  position="bottom"
                  trapFocus={false}
                  closeOnEscape={false}
                  transition="pop-top-left"
                  withArrow
                >
                  <Popover.Target>
                    <Text onMouseEnter={() => setOpened(true)} onMouseLeave={() => setOpened(false)} size="sm">
                      {customerData.city}, {customerData.country}
                    </Text>
                  </Popover.Target>

                  <Popover.Dropdown>
                    <DeviceMap latitude={customerData.latitude} longitude={customerData.longitude} />
                  </Popover.Dropdown>
                </Popover>
              </Group>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default Details;
