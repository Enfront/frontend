import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Button, Divider, Grid, Input, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import axios, { AxiosResponse } from 'axios';

import { ShopPaymentFormData } from '../../../types/types';
import useShop from '../../../contexts/ShopContext';

function PaymentsTab(): JSX.Element {
  const { selectedShop } = useShop();

  const [actionPending, setActionPending] = useState<boolean>(false);
  const [stripeConnected, setStripeConnected] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      bitcoin_address: '',
      paypal_email: '',
    },
  });

  const connectStripe = (): void => {
    setActionPending(true);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/payments/providers/${selectedShop.ref_id}`, {
        stripe: true,
      })
      .then((response: AxiosResponse) => {
        const newWindow = window.open(response.data.data.url, '_self', 'noopener, noreferrer');
        if (newWindow) newWindow.opener = null;
        setActionPending(false);
      })
      .catch(() => {
        setActionPending(false);

        showNotification({
          title: 'Uh Oh!',
          message: 'There was an issue connecting to Stripe.',
          color: 'red',
        });
      });
  };

  const disconnectStripe = (): void => {
    setActionPending(true);

    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/payments/providers/${selectedShop.ref_id}`, {
        data: {
          provider: 1,
        },
      })
      .then(() => {
        setStripeConnected(false);
        setActionPending(false);
      })
      .catch(() => {
        showNotification({
          title: 'Uh Oh!',
          message: 'There was an issue removing your Stripe account.',
          color: 'red',
        });
      });
  };

  const onSubmitPaymentInfo = (data: ShopPaymentFormData): void => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/payments/providers/${selectedShop.ref_id}`, {
        email: data.paypal_email,
        bitcoin_address: data.bitcoin_address,
      })
      .then(() => {
        showNotification({
          title: 'Settings Saved!',
          message: 'Your payment settings have been saved.',
          color: 'green',
        });
      })
      .catch(() => {
        showNotification({
          title: 'Uh Oh!',
          message: 'There was an issue saving your payment settings.',
          color: 'red',
        });
      });
  };

  useEffect(() => {
    const checkConnectedProviders = async (): Promise<void> => {
      if (selectedShop.ref_id !== '') {
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/payments/providers/${selectedShop.ref_id}`)
          .then((response: AxiosResponse) => {
            if (response && response.status === 200) {
              form.setFieldValue('paypal_email', response.data.data.paypal_email);
              form.setFieldValue('bitcoin_address', response.data.data.bitcoin_address);

              if (response.data.data.stripe_id) {
                setStripeConnected(true);
              }
            }
          });
      }
    };

    checkConnectedProviders();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShop]);

  return (
    <form onSubmit={form.onSubmit((values: ShopPaymentFormData) => onSubmitPaymentInfo(values))}>
      <Grid align="end">
        <Grid.Col span={12}>
          <Image src="/brands/bitcoin_logo.png" height={43} width={150} alt="Bitcoin Logo" />
        </Grid.Col>

        <Grid.Col span={12} md={6} pr={48}>
          <Text size="sm">
            Bitcoin funds will not go directly to this address; instead, Enfront will use it as a payout address.
            Payouts will be made to this address every Sunday.
          </Text>
        </Grid.Col>

        <Grid.Col span={12} md={4}>
          <TextInput
            placeholder="P2PKH, P2SH, Bech32"
            label="Payout Address"
            {...form.getInputProps('bitcoin_address')}
          />
        </Grid.Col>

        <Grid.Col span={12} md={2}>
          <Input.Wrapper>
            <Button type="submit" fullWidth>
              Save Bitcoin Address
            </Button>
          </Input.Wrapper>
        </Grid.Col>

        <Grid.Col span={12}>
          <Divider my="xl" />
        </Grid.Col>

        <Grid.Col span={12}>
          <Image src="/brands/paypal_logo.png" height={38} width={150} alt="PayPal Logo" />
        </Grid.Col>

        <Grid.Col span={12} md={6} pr={48}>
          <Text size="sm">
            A PayPal account is required to accept payments through this gateway. After you have an account with PayPal
            input your email address to the right and click &ldquo;Save PayPal Info&rdquo;.
          </Text>
        </Grid.Col>

        <Grid.Col span={12} md={4}>
          <TextInput
            placeholder="PayPal Email"
            label="PayPal Email"
            type="email"
            {...form.getInputProps('paypal_email')}
          />
        </Grid.Col>

        <Grid.Col span={12} md={2}>
          <Input.Wrapper label="&nbsp;">
            <Button type="submit" fullWidth>
              Save PayPal Email
            </Button>
          </Input.Wrapper>
        </Grid.Col>

        <Grid.Col span={12}>
          <Divider my="xl" />
        </Grid.Col>

        <Grid.Col span={12}>
          <Image src="/brands/stripe_logo.png" height={43} width={112} alt="Stripe Logo" />
        </Grid.Col>

        <Grid.Col span={12} md={6} pr={48}>
          {!selectedShop.country.stripe_available && (
            <Text size="sm" color="red">
              Stripe is not available in your businesses operating country.
            </Text>
          )}

          <Text size="sm">
            A Stripe account is required to accept payments through this gateway. If you do not have a Stripe account
            yet, you can click the button to the right and create one.
          </Text>
        </Grid.Col>

        <Grid.Col span={12} md={6}>
          {!stripeConnected ? (
            <Button
              className="block w-full bg-[#6A5BFA] hover:bg-[#6355ea]"
              onClick={connectStripe}
              loading={actionPending}
              disabled={!selectedShop.country.stripe_available}
            >
              Connect Stripe
            </Button>
          ) : (
            <Button
              className="block w-full bg-[#6A5BFA] hover:bg-[#6355ea]"
              onClick={disconnectStripe}
              loading={actionPending}
            >
              Disconnect Stripe
            </Button>
          )}
        </Grid.Col>
      </Grid>
    </form>
  );
}

export default PaymentsTab;
