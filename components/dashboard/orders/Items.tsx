import { Fragment } from 'react';

import { Avatar, Badge, Box, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import { NumericFormat } from 'react-number-format';
import { Barcode } from 'tabler-icons-react';

import { Order, OrderItem } from '&/types/types';

interface OrderItemProps {
  fulfilledOrder: boolean;
  unfulfilledOrder: boolean;
  viewedOrder: Order;
}

function Items({ fulfilledOrder, unfulfilledOrder, viewedOrder }: OrderItemProps): JSX.Element {
  const getItemCurrentStatus = (currentStatus: number): JSX.Element => {
    switch (currentStatus) {
      case -1:
        return (
          <Badge color="red" radius="xs">
            Canceled
          </Badge>
        );
      case 0:
        return (
          <Badge color="yellow" radius="xs">
            Pending
          </Badge>
        );
      case 1:
        return <Badge radius="xs">Sent</Badge>;
      case 2:
        return (
          <Badge color="green" radius="xs">
            Delivered
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
    <>
      {unfulfilledOrder && (
        <Stack py={16}>
          <Title className="text-xl" order={2}>
            Unfulfilled
          </Title>

          <Grid align="center">
            {viewedOrder.items.map((item: OrderItem) =>
              item.current_status <= 0 ? (
                <Fragment key={item.ref_id}>
                  <Grid.Col span={5}>
                    <Group>
                      {item.images.length > 0 ? (
                        <Avatar src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_URL}${item.images[0].path}`} size="lg" />
                      ) : (
                        <Avatar size="lg">
                          <Barcode />
                        </Avatar>
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Text weight={500}>{item.name}</Text>

                        <Text color="dimmed" size="sm">
                          {item.ref_id}
                        </Text>
                      </Box>
                    </Group>
                  </Grid.Col>

                  <Grid.Col className="flex justify-around" span={2}>
                    <NumericFormat
                      value={(item.price / 100).toFixed(2)}
                      prefix={getSymbolWithIsoCode(viewedOrder.currency)}
                      displayType="text"
                      thousandSeparator
                    />
                  </Grid.Col>

                  <Grid.Col className="flex justify-around" span={1}>
                    {item.quantity}
                  </Grid.Col>

                  <Grid.Col className="flex justify-around" span={2}>
                    <NumericFormat
                      value={((item.price * item.quantity) / 100).toFixed(2)}
                      prefix={getSymbolWithIsoCode(viewedOrder.currency)}
                      displayType="text"
                      thousandSeparator
                    />
                  </Grid.Col>

                  <Grid.Col className="flex justify-end" span={2}>
                    {getItemCurrentStatus(item.current_status)}
                  </Grid.Col>
                </Fragment>
              ) : null,
            )}
          </Grid>
        </Stack>
      )}

      {fulfilledOrder && (
        <Stack py={16}>
          <Title className="text-xl" order={2}>
            Fulfilled
          </Title>

          <Grid align="center">
            {viewedOrder.items.map((item: OrderItem) =>
              item.current_status >= 1 ? (
                <Fragment key={item.ref_id}>
                  <Grid.Col span={5}>
                    <Group>
                      {item.images.length > 0 ? (
                        <Avatar src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_URL}${item.images[0].path}`} size="lg" />
                      ) : (
                        <Avatar size="lg">
                          <Barcode />
                        </Avatar>
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Text weight={500}>{item.name}</Text>

                        <Text color="dimmed" size="sm">
                          {item.ref_id}
                        </Text>
                      </Box>
                    </Group>
                  </Grid.Col>

                  <Grid.Col className="flex justify-around" span={2}>
                    <NumericFormat
                      value={(item.price / 100).toFixed(2)}
                      prefix={getSymbolWithIsoCode(viewedOrder.currency)}
                      displayType="text"
                      thousandSeparator
                    />
                  </Grid.Col>

                  <Grid.Col className="flex justify-around" span={1}>
                    {item.quantity}
                  </Grid.Col>

                  <Grid.Col className="flex justify-around" span={2}>
                    <NumericFormat
                      value={((item.price * item.quantity) / 100).toFixed(2)}
                      prefix={getSymbolWithIsoCode(viewedOrder.currency)}
                      displayType="text"
                      thousandSeparator
                    />
                  </Grid.Col>

                  <Grid.Col className="flex justify-end" span={2}>
                    {getItemCurrentStatus(item.current_status)}
                  </Grid.Col>
                </Fragment>
              ) : null,
            )}
          </Grid>
        </Stack>
      )}
    </>
  );
}

export default Items;
