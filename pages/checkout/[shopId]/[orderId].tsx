import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Anchor, Avatar, Container, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import axios, { AxiosResponse } from 'axios';

import EmailForm from '../../../components/public/checkout/EmailForm';
import PaymentForm from '../../../components/public/checkout/PaymentForm';
import { OrderInfo, OrderItem } from '../../../types/types';

function OrderId(): JSX.Element {
  const router = useRouter();
  const { shopId, orderId, redirect_status } = router.query;

  const [emailStepComplete, setEmailStepComplete] = useState<boolean>(false);
  const [isOrderComplete, setIsOrderComplete] = useState<boolean>(false);

  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    buyer: '',
    created_at: '',
    crypto: {
      txn_id: '',
      status: 0,
      currency1: '',
      currency2: '',
      amount1: '',
      amount2: '',
      fee: '',
      received_amount: '',
      received_confirms: 0,
    },
    currency: '',
    current_status: 0,
    email: '',
    items: [],
    ref_id: '',
    shop: {
      name: '',
      domain: '',
      ref_id: '',
    },
    total: 0,
  });

  const setEmail = (email: string): void => {
    axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
        order_ref: orderId,
        shop_ref: shopId,
        email,
      })
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          setEmailStepComplete(true);
        }
      });
  };

  const getOrderInfo = useCallback(async (): Promise<void> => {
    if (orderId !== undefined) {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/checkout/${orderId}`)
        .then((response: AxiosResponse) => {
          setOrderInfo(response.data.data);

          if (response.data.data.current_status === -1 || response.data.data.current_status >= 1) {
            setIsOrderComplete(true);
            setEmailStepComplete(true);
          }

          if (response.data.data.email !== null && response.data.data.email !== '' && !isOrderComplete) {
            setEmail(response.data.data.email);
          }
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (redirect_status === 'succeeded') {
      showNotification({
        title: 'Your payment has been successful!',
        message: `Please check ${orderInfo.email} to find your key! Thank you for your business!`,
        color: 'green',
        autoClose: false,
      });
    }

    getOrderInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOrderInfo]);

  return (
    <Grid className="h-screen w-full" grow>
      <Grid.Col span={6}>
        {orderId && shopId && (
          <Container size="sm" my={96}>
            {!emailStepComplete && (
              <EmailForm setEmailStepComplete={setEmailStepComplete} getOrderInfo={getOrderInfo} />
            )}

            {!isOrderComplete && emailStepComplete && (
              <PaymentForm
                buyerEmail={orderInfo.email}
                shopCurrency={orderInfo.currency}
                isOrderComplete={isOrderComplete}
                getOrderInfo={getOrderInfo}
                existingCryptoOrder={orderInfo.crypto}
              />
            )}

            {isOrderComplete && emailStepComplete && <Title order={2}>Order Details</Title>}

            {emailStepComplete && (
              <Stack mt={32}>
                <Group position="apart">
                  <Text color="gray" size="sm">
                    Invoice
                  </Text>

                  <Text size="sm">{orderInfo.ref_id}</Text>
                </Group>

                <Group position="apart">
                  <Text color="gray" size="sm">
                    Shop
                  </Text>

                  <Text size="sm">{orderInfo.shop.name}</Text>
                </Group>

                <Group position="apart">
                  <Text color="gray" size="sm">
                    Email{' '}
                    {orderInfo.current_status !== -1 && orderInfo.current_status !== 3 && (
                      <Anchor onClick={() => setEmailStepComplete(false)} component="span" size="sm" ml={4}>
                        (Edit)
                      </Anchor>
                    )}
                  </Text>

                  <Text size="sm">
                    {(orderInfo.email === '' || orderInfo.email == null) && <>Not Provided</>}
                    {orderInfo.email && <>{orderInfo.email}</>}
                  </Text>
                </Group>

                <Group position="apart">
                  <Text color="gray" size="sm">
                    Status
                  </Text>

                  <Text size="sm">
                    {orderInfo.current_status === -1 && <>Order Cancelled</>}

                    {(orderInfo.current_status === 0 ||
                      orderInfo.current_status === 1 ||
                      orderInfo.current_status === 2) && <>Order in Progress</>}

                    {orderInfo.current_status === 3 && <>Order Complete</>}
                  </Text>
                </Group>
              </Stack>
            )}
          </Container>
        )}
      </Grid.Col>

      <Grid.Col className="bg-gray-50" span={6}>
        {orderInfo && (
          <Container size="sm" my={96}>
            <Title order={2} mb={32}>
              Order Summary
            </Title>

            {orderInfo.items.map((product: OrderItem) => (
              <Group position="apart" mb={16} key={product.ref_id}>
                <Group>
                  <Avatar src={`https://jkpay.s3.us-east-2.amazonaws.com${product.images[0].path}`} size="xl" />

                  <Stack spacing="xs">
                    <Text weight={500}>{product.name}</Text>

                    <Text color="dimmed" size="sm">
                      {product.ref_id}
                    </Text>
                  </Stack>
                </Group>

                <Group>
                  <Text size="sm">
                    {product.quantity} x {getSymbolWithIsoCode(orderInfo.currency)} {product.price / 100}
                  </Text>
                </Group>
              </Group>
            ))}
          </Container>
        )}
      </Grid.Col>
    </Grid>
  );
}

export default OrderId;
