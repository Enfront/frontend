import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Button, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { PayPalButton } from '@repeatgg/react-paypal-button-v2';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios, { AxiosResponse } from 'axios';

import { AcceptedCryptoAddresses, CryptoTxnInfo, PayPalOnApprove } from '../../../types/types';
import CryptoModal from './CryptoModal';
import StripeModal from './StripeModal';

interface PaymentFormProps {
  buyerEmail: string;
  existingCryptoOrder: CryptoTxnInfo;
  getOrderInfo: () => void;
  shopCurrency: string;
}

function PaymentForm({ buyerEmail, getOrderInfo, existingCryptoOrder, shopCurrency }: PaymentFormProps): JSX.Element {
  const router = useRouter();
  const { orderId, shopId } = router.query;

  const [acceptedCryptos, setAcceptedCryptos] = useState<AcceptedCryptoAddresses[]>([
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      address: '',
      logo: '/brands/bitcoin.png',
    },
  ]);

  const [stripePromise, setStripePromise] = useState<Stripe | PromiseLike<Stripe | null> | null>(null);
  const [showPayPal, setShowPayPal] = useState<boolean>(false);
  const [showStripeButton, setShowStripeButton] = useState<boolean>(false);
  const [showCrypto, setShowCrypto] = useState<boolean>(false);
  const [isCryptoPaymentVisible, setIsCryptoPaymentVisible] = useState<boolean>(false);
  const [isStripePaymentVisible, setIsStripePaymentVisible] = useState<boolean>(false);
  const [cryptoInProgress, setCryptoInProgress] = useState<boolean>(false);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [stripeClientSecret, setStripeClientSecret] = useState<string>('');
  const [buttonRowColumns, setButtonRowColumns] = useState<number>(0);

  const setupUpStripeSdk = async (accountId: string): Promise<void> => {
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setStripePromise(
        loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
          stripeAccount: accountId,
        }),
      );
    }
  };

  const startStripeCheckout = async (): Promise<void> => {
    if (stripeClientSecret === '') {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/payments/stripe`, {
          order_ref: orderId,
          shop_ref: shopId,
          email: buyerEmail,
        })
        .then((response: AxiosResponse) => {
          setStripeClientSecret(response.data.data.client_secret);
          setIsStripePaymentVisible(true);
        });
    } else {
      setIsStripePaymentVisible(true);
    }
  };

  useEffect(() => {
    const checkConnectedProviders = async (): Promise<void> => {
      if (shopId !== undefined) {
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/payments/providers/${shopId}`)
          .then((response: AxiosResponse) => {
            if (response && response.status === 200) {
              setButtonRowColumns(Object.keys(response.data.data).length);

              if (response.data.data.paypal_email) {
                setShowPayPal(true);
              }

              if (response.data.data.stripe_id) {
                setShowStripeButton(true);
                setupUpStripeSdk(response.data.data.stripe_id);
              }

              if (response.data.data.bitcoin_address) {
                setShowCrypto(true);
                setAcceptedCryptos([
                  {
                    name: 'Bitcoin',
                    symbol: 'BTC',
                    address: '',
                    logo: '/brands/bitcoin.png',
                  },
                ]);
              }
            }
          });
      }
    };

    const checkCryptoStatus = (): void => {
      if (existingCryptoOrder?.status === 'Processing') {
        setIsCryptoPaymentVisible(true);
        setCryptoInProgress(true);
      }
    };

    const getCsrfToken = async (): Promise<void> => {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/users/csrf`, {
          withCredentials: true,
        })
        .then((response: AxiosResponse) => {
          setCsrfToken(response.headers['x-csrftoken']);
        });
    };

    checkConnectedProviders();
    checkCryptoStatus();
    getCsrfToken();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  return (
    <>
      {orderId && shopId && !cryptoInProgress && (
        <Stack spacing="xs">
          <Title order={2} mb={16}>
            Choose a Payment Method
          </Title>

          {!showPayPal && !showCrypto && !showStripeButton && (
            <Text align="center">This seller has not set up any payment gateways.</Text>
          )}

          <SimpleGrid cols={buttonRowColumns}>
            {showCrypto && (
              <Button
                className="h-[42px]"
                onClick={() => setIsCryptoPaymentVisible(true)}
                variant="outline"
                color="gray"
              >
                Cryptocurrency
              </Button>
            )}

            {showPayPal && shopId && (
              <div>
                <PayPalButton
                  createOrder={() => {
                    return fetch('/api/v1/payments/paypal', {
                      method: 'post',
                      headers: {
                        'content-type': 'application/json',
                        'X-CSRFToken': csrfToken,
                      },
                      body: JSON.stringify({
                        order_ref: orderId,
                        shop_ref: shopId,
                        email: buyerEmail,
                      }),
                    })
                      .then((res) => {
                        return res.json();
                      })
                      .then((data) => {
                        return data.data.id;
                      });
                  }}
                  onApprove={(data: PayPalOnApprove) => {
                    return fetch(`/api/v1/payments/paypal/${data.orderID}/${orderId}?email=${buyerEmail}`).then(
                      (response: Response) => {
                        getOrderInfo();

                        if (response.status === 403) {
                          showNotification({
                            title: `We're sorry.`,
                            message: `There was an issue with your payment. Please use another payment method or contact
                            the shop's staff to resolve this issue.`,
                            color: 'red',
                            autoClose: false,
                          });
                        } else {
                          router.push(`/checkout/${shopId}/${orderId}/processing`);
                        }
                      },
                    );
                  }}
                  options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                    disableFunding: 'card,credit',
                    intent: 'authorize',
                    currency: 'USD',
                  }}
                  style={{ layout: 'horizontal', tagline: false, height: 42 }}
                />
              </div>
            )}

            {showStripeButton && (
              <Button
                className="block h-[42px] w-full bg-[#6A5BFA] hover:bg-[#6355ea]"
                onClick={() => startStripeCheckout()}
              >
                <Image src="/brands/stripe_logo_white.png" height={36} width={72} />
              </Button>
            )}
          </SimpleGrid>
        </Stack>
      )}

      {stripePromise && stripeClientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
          <StripeModal
            getOrderInfo={getOrderInfo}
            isVisible={isStripePaymentVisible}
            setIsVisible={setIsStripePaymentVisible}
          />
        </Elements>
      )}

      <CryptoModal
        acceptedCryptos={acceptedCryptos}
        buyerEmail={buyerEmail}
        shopCurrency={shopCurrency}
        isVisible={isCryptoPaymentVisible}
        setIsVisible={setIsCryptoPaymentVisible}
        existingCryptoOrder={existingCryptoOrder}
      />
    </>
  );
}

export default PaymentForm;
