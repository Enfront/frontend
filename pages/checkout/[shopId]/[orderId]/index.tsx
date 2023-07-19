import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Anchor, Avatar, Container, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios, { AxiosResponse } from 'axios';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';
import { Tag } from 'tabler-icons-react';

import EmailForm from '&/components/public/checkout/EmailForm';
import PaymentForm from '&/components/public/checkout/PaymentForm';
import { OrderInfo, OrderItem } from '&/types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const { shopId, orderId, redirect_status } = router.query;

  const [emailStepComplete, setEmailStepComplete] = useState<boolean>(false);
  const [isOrderComplete, setIsOrderComplete] = useState<boolean>(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    buyer: '',
    created_at: '',
    crypto: {
      activated: true,
      additionalData: {},
      amount: '',
      cryptoCode: 'BTC',
      destination: '',
      due: '',
      networkFee: '',
      paymentLink: '',
      paymentMethod: '',
      paymentMethodPaid: '',
      payments: [],
      rate: '',
      totalPaid: '',
      status: 'Invalid',
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

  const getOrderInfo = async (): Promise<void> => {
    if (orderId !== undefined) {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/checkout/${orderId}`)
        .then((response: AxiosResponse) => {
          setOrderInfo(response.data.data);

          if (response.data.data.email !== null && response.data.data.email !== '') {
            setEmailStepComplete(true);
          }

          if (response.data.data.current_status !== -2 && response.data.data.current_status !== 0) {
            setIsOrderComplete(true);

            if (redirect_status === 'success') {
              setIsOrderComplete(true);

              showNotification({
                title: 'Your payment has been successful!',
                message: 'Please check your email to find your key! Thank you for your business!',
                color: 'green',
                autoClose: false,
              });
            } else {
              showNotification({
                title: `We're sorry.`,
                message: `There was a problem with your payment. Please use another payment method or contact the shop's
                staff to resolve this issue.`,
                color: 'red',
                autoClose: false,
              });
            }
          }
        });
    }
  };

  useEffect(() => {
    getOrderInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

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
                getOrderInfo={getOrderInfo}
                existingCryptoOrder={orderInfo.crypto}
                shopCurrency={orderInfo.currency}
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
                  {product.images.length > 0 ? (
                    <Avatar src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_URL}${product.images[0].path}`} size="xl" />
                  ) : (
                    <Avatar color="brand" size="xl">
                      <Tag size={42} />
                    </Avatar>
                  )}

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

export default Index;
