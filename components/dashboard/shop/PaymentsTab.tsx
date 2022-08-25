import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Button, createStyles, Divider, Grid, InputWrapper, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import axios, { AxiosResponse } from 'axios';

import { ShopPaymentFormData } from '../../../types/types';
import useShop from '../../../contexts/ShopContext';

const useStyles = createStyles(() => ({
  stripeButton: {
    backgroundColor: '#6A5BFA',
    display: 'block',
    width: '100%',

    '&:hover': {
      backgroundColor: '#6355ea',
    },
  },
}));

function PaymentsTab(): JSX.Element {
  const { classes } = useStyles();
  const { selectedShop } = useShop();

  const [actionPending, setActionPending] = useState<boolean>(false);
  const [stripeConnected, setStripeConnected] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      paypal_email: '',
    },
  });

  const connectStripe = (): void => {
    setActionPending(true);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/${selectedShop.ref_id}`)
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
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/${selectedShop.ref_id}`)
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
      .post(`${process.env.NEXT_PUBLIC_API_URL}/payments/paypal/${selectedShop.ref_id}`, {
        email: data.paypal_email,
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
    const checkPayPalLogin = async (): Promise<void> => {
      if (selectedShop.ref_id !== '') {
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/payments/paypal/${selectedShop.ref_id}`)
          .then((response: AxiosResponse) => {
            if (response && response.status === 200) {
              form.setFieldValue('paypal_email', response.data.data.email);
            }
          });
      }
    };

    const checkStripeLogin = async (): Promise<void> => {
      if (selectedShop.ref_id !== '') {
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/${selectedShop.ref_id}`)
          .then((response: AxiosResponse) => {
            if (response && response.status === 200) {
              setStripeConnected(true);
            }
          })
          .catch(() => {
            setStripeConnected(false);
          });
      }
    };

    checkPayPalLogin();
    checkStripeLogin();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShop]);

  return (
    <form onSubmit={form.onSubmit((values: ShopPaymentFormData) => onSubmitPaymentInfo(values))}>
      <Grid mt={24} align="center">
        <Grid.Col span={12}>
          <Image src="/paypal_logo.png" height={38} width={150} alt="PayPal Logo" />
        </Grid.Col>

        <Grid.Col span={6} pr={48}>
          <Text size="sm">
            A PayPal account is required to accept payments through this gateway. After you have an account with PayPal
            input your email address to the right and click &ldquo;Save PayPal Info&rdquo;.
          </Text>
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput placeholder="PayPal Email" label="PayPal Email" {...form.getInputProps('paypal_email')} />
        </Grid.Col>

        <Grid.Col span={2}>
          <InputWrapper label="&nbsp;">
            <Button type="submit" fullWidth>
              Save PayPal Info
            </Button>
          </InputWrapper>
        </Grid.Col>

        <Grid.Col span={12}>
          <Divider my="xl" />
        </Grid.Col>

        <Grid.Col span={12}>
          <Image src="/stripe_logo.png" height={43} width={112} alt="Stripe Logo" />
        </Grid.Col>

        <Grid.Col span={6} pr={48}>
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

        <Grid.Col span={6}>
          {!stripeConnected ? (
            <Button
              className={classes.stripeButton}
              onClick={connectStripe}
              loading={actionPending}
              disabled={!selectedShop.country.stripe_available}
            >
              Connect Stripe
            </Button>
          ) : (
            <Button className={classes.stripeButton} onClick={disconnectStripe} loading={actionPending}>
              Disconnect Stripe
            </Button>
          )}
        </Grid.Col>
      </Grid>
    </form>
  );
}

export default PaymentsTab;
