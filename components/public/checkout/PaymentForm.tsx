import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Button, createStyles, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { PayPalButton } from '@repeatgg/react-paypal-button-v2';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ChevronDown } from 'tabler-icons-react';
import axios, { AxiosResponse } from 'axios';

import { AcceptedCryptoAddresses, CoinPaymentsIpnData, PayPalOnApprove } from '../../../types/types';
import CryptoModal from './CryptoModal';
import StripeModal from './StripeModal';

interface PaymentFormProps {
  buyerEmail: string;
  shopCurrency: string;
  isOrderComplete: boolean;
  getOrderInfo: () => void;
  existingCryptoOrder: CoinPaymentsIpnData;
}

const useStyles = createStyles(() => ({
  stripeButton: {
    backgroundColor: '#6A5BFA',
    display: 'block',
    height: 45,
    width: '100%',

    '&:hover': {
      backgroundColor: '#6355ea',
    },
  },
}));

function PaymentForm({
  buyerEmail,
  shopCurrency,
  isOrderComplete,
  getOrderInfo,
  existingCryptoOrder,
}: PaymentFormProps): JSX.Element {
  const router = useRouter();
  const { classes } = useStyles();
  const { orderId, shopId } = router.query;

  const [acceptedCryptos, setAcceptedCryptos] = useState<AcceptedCryptoAddresses[]>([
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      address: '',
      logo: '/bitcoin.png',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '',
      logo: '/ethereum.png',
    },
    {
      name: 'Litecoin',
      symbol: 'LTC',
      address: '',
      logo: '/litecoin.jpg',
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
    setStripePromise(
      loadStripe(
        'pk_test_51KujSgGgc4vlkPQkNtccVaqmhgNq4yGp4U5T8MmyBvkVHCNzCSVz0erpaRuzRETE7Wa0fO6MUPa6ECztMOUOypJW00atxjOK2F',
        {
          stripeAccount: accountId,
        },
      ),
    );
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
    const checkStripeLogin = async (): Promise<void> => {
      if (shopId !== undefined) {
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/${shopId}`)
          .then((response: AxiosResponse) => {
            if (response && response.status === 200) {
              setButtonRowColumns((prev: number) => prev + 1);
              setShowStripeButton(true);
              setupUpStripeSdk(response.data.data.id);
            }
          })
          .catch(() => {
            setShowStripeButton(false);
          });
      }
    };

    const checkPayPalLogin = async (): Promise<void> => {
      if (shopId !== undefined) {
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/payments/paypal/${shopId}`)
          .then((response: AxiosResponse) => {
            if (response.status === 204) {
              setShowPayPal(false);
            } else {
              setShowPayPal(true);
              setButtonRowColumns((prev: number) => prev + 1);
            }
          });
      }
    };

    /**
     * Not implemented yet
     */
    const getCryptoAddresses = async (): Promise<void> => {
      setShowCrypto(false);
      setAcceptedCryptos([]);
    };

    const checkCryptoStatus = (): void => {
      if (existingCryptoOrder && existingCryptoOrder.status === 1) {
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

    checkStripeLogin();
    checkPayPalLogin();
    getCryptoAddresses();
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
                className="h-[45px]"
                onClick={() => setIsCryptoPaymentVisible(true)}
                rightIcon={<ChevronDown size={14} />}
                variant="outline"
                color="gray"
              >
                Crypto Options
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
                    // Capture the funds from the transaction
                    return fetch(`/api/v1/payments/paypal/${data.orderID}/${orderId}?email=${buyerEmail}`).then(
                      (response: Response) => {
                        getOrderInfo();

                        if (response.status === 403) {
                          setShowPayPal(false);

                          showNotification({
                            title: `We're sorry.`,
                            message: `Your PayPal account has been banned by this shop. Please use another
                            payment method or contact the shop's staff to resolve this issue.`,
                            color: 'red',
                            autoClose: false,
                          });
                        } else {
                          showNotification({
                            title: 'Your payment has been successful!',
                            message: `Please check ${buyerEmail} to find your key! Thank you for your business!`,
                            color: 'green',
                            autoClose: false,
                          });
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
              <Button className={classes.stripeButton} onClick={() => startStripeCheckout()}>
                <Image src="/stripe_logo_white.png" height={36} width={72} />
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
        isOrderComplete={isOrderComplete}
        getOrderInfo={getOrderInfo}
        existingCryptoOrder={existingCryptoOrder}
      />
    </>
  );
}

export default PaymentForm;
