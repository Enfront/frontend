import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { ActionIcon, Avatar, Modal, Stack, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { ArrowNarrowLeft, ArrowNarrowRight, Check } from 'tabler-icons-react';
import axios, { AxiosResponse } from 'axios';

import { AcceptedCryptoAddresses, CoinPaymentsIpnData, CoinPaymentsTxnInfo } from '../../../types/types';

interface CryptoModalProps {
  acceptedCryptos: AcceptedCryptoAddresses[];
  buyerEmail: string;
  shopCurrency: string;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  isOrderComplete: boolean;
  getOrderInfo: () => void;
  existingCryptoOrder: CoinPaymentsIpnData;
}

function CryptoModal({
  acceptedCryptos,
  buyerEmail,
  shopCurrency,
  isVisible,
  setIsVisible,
  isOrderComplete,
  getOrderInfo,
  existingCryptoOrder,
}: CryptoModalProps): JSX.Element {
  const router = useRouter();

  const { orderId } = router.query;

  const [step, setStep] = useState<number>(0);

  const [coinPaymentsTxnDetails, setCoinPaymentsTxnDetails] = useState<CoinPaymentsTxnInfo>({
    txn_id: '',
    address: '',
    amount: '',
    currency: 'BTC',
    confirms_needed: 0,
    qrcode_url: '',
    timeout: 0,
  });

  const [coinPaymentsIpnDetails, setCoinPaymentsIpnDetails] = useState<CoinPaymentsIpnData>({
    txn_id: '',
    status: 0,
    currency1: '',
    currency2: '',
    amount1: '',
    amount2: '',
    fee: '',
    received_amount: '',
    received_confirms: 0,
  });

  const checkCoinPaymentsExistingOrder = async (crypto: 'BTC' | 'ETH' | 'LTC' | 'LTCT'): Promise<void> => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/payments/coinpayments/${orderId}`)
      .then((response: AxiosResponse) => {
        if (response.data.data && response.data.data.currency === crypto) {
          setCoinPaymentsTxnDetails(response.data.data);
          checkCoinPaymentsIpnStatus(response.data.data.txn_id);
          setStep(1);
        } else {
          createCoinPaymentsOrder(crypto);
        }
      });
  };

  const createCoinPaymentsOrder = async (crypto: 'BTC' | 'ETH' | 'LTC' | 'LTCT'): Promise<void> => {
    setStep(1);
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/payments/coinpayments`, {
        order: orderId,
        buyer_email: buyerEmail,
        currency1: shopCurrency,
        currency2: crypto,
      })
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          setStep(1);
          setCoinPaymentsTxnDetails(response.data.data);
          checkCoinPaymentsIpnStatus(response.data.data.txn_id);
        }
      });
  };

  const checkCoinPaymentsIpnStatus = (txn_id: string): void => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/payments/coinpayments/ipn/${txn_id}`)
      .then((response: AxiosResponse) => {
        if (!isOrderComplete) {
          const timeout = setTimeout(() => {
            if (response.data.data) {
              if (response.data.data.status === 1) {
                setStep(2);
                checkCoinPaymentsIpnStatus(txn_id);
              }

              if (response.data.data.status === 2 || response.data.data.status >= 100) {
                setIsVisible(false);
                getOrderInfo();

                showNotification({
                  title: 'Your payment has been successful!',
                  message: `Please check ${buyerEmail} to find your key! Thank you for your business!`,
                  color: 'green',
                  autoClose: false,
                });

                clearTimeout(timeout);
              }

              setCoinPaymentsIpnDetails(response.data.data);
            }
          }, 20000);
        }
      });
  };

  useEffect(() => {
    const checkForExistingIpn = async (): Promise<void> => {
      if (existingCryptoOrder) {
        if (existingCryptoOrder.status === 1) {
          setStep(2);
          setCoinPaymentsIpnDetails(existingCryptoOrder);
          checkCoinPaymentsIpnStatus(existingCryptoOrder.txn_id);
        } else if (existingCryptoOrder.status === 2 || existingCryptoOrder.status >= 100) {
          getOrderInfo();
          setCoinPaymentsIpnDetails(existingCryptoOrder);

          showNotification({
            title: 'Your payment has been successful!',
            message: `Please check ${buyerEmail} to find your key! Thank you for your business!`,
            color: 'green',
            autoClose: false,
          });
        }
      }
    };

    checkForExistingIpn();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      opened={isVisible}
      onClose={() => setIsVisible(false)}
      size={384}
      title={
        <>
          {step === 1 && (
            <ActionIcon onClick={() => setStep((prevStep: number) => prevStep - 1)} size="sm">
              <ArrowNarrowLeft />
            </ActionIcon>
          )}
        </>
      }
      centered
    >
      {step === 0 && (
        <>
          <Text align="center" weight={500}>
            Pay With Cryptocurrency
          </Text>

          <Text align="center" color="gray" size="sm" mt={8}>
            Select a currency below to get started!
          </Text>

          <Stack my={16}>
            {acceptedCryptos.map((crypto: AcceptedCryptoAddresses) => {
              if (crypto.address !== '')
                return (
                  <button
                    className="flex w-full cursor-pointer items-center justify-between rounded-md border-0 bg-white
                    p-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    onClick={() => checkCoinPaymentsExistingOrder(crypto.symbol)}
                    type="button"
                    key={crypto.name}
                  >
                    <span className="flex items-center">
                      <Image src={crypto.logo} width={21} height={21} layout="intrinsic" alt={crypto.name} />
                      <span className="ml-4 truncate">{crypto.name}</span>
                    </span>

                    <ArrowNarrowRight className="h-4 w-4" />
                  </button>
                );

              return false;
            })}
          </Stack>
        </>
      )}

      {step === 1 && coinPaymentsTxnDetails.address !== '' && (
        <>
          <Text align="center" weight={500}>
            Pay With {coinPaymentsTxnDetails.currency}
          </Text>

          <Text align="center" color="gray" size="sm" mt={8} mb={16}>
            To complete your order please send the exact amount of {coinPaymentsTxnDetails.currency} to the address
            below.
          </Text>

          <div className="flex justify-center">
            <Image
              src={coinPaymentsTxnDetails.qrcode_url}
              layout="intrinsic"
              height="200"
              width="200"
              alt={`Crypto QR code for transaction ${coinPaymentsTxnDetails.txn_id}`}
            />
          </div>

          <TextInput placeholder="Amount" label="Amount" value={coinPaymentsTxnDetails.amount} mt={16} disabled />
          <TextInput placeholder="Address" label="Address" value={coinPaymentsTxnDetails.address} mt={8} disabled />
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex justify-center">
            <Avatar color="green" radius="xl" size="lg">
              <Check size={32} />
            </Avatar>
          </div>

          <Text align="center" weight={500} mt={16}>
            {coinPaymentsIpnDetails.currency2} Received
          </Text>

          <Text align="center" color="gray" size="sm" mt={8}>
            We are currently waiting for your payment to be confirmed by the {coinPaymentsIpnDetails.currency2} network.
          </Text>

          <Text align="center" color="gray" size="sm" mt={8} mb={16}>
            It currently has{' '}
            <Text className="inline-block" color="dark" weight={500}>
              {coinPaymentsIpnDetails.received_confirms}
            </Text>{' '}
            of{' '}
            <Text className="inline-block" color="dark" weight={500}>
              {coinPaymentsTxnDetails.confirms_needed}
            </Text>{' '}
            confirmations.
          </Text>
        </>
      )}

      <div className="mt-6 flex w-full items-center justify-center">
        <span className={`mr-2 block h-1.5 w-1.5 rounded-full ${step === 0 ? 'bg-gray-800' : 'bg-gray-400'}`} />
        <span className={`mr-2 block h-1.5 w-1.5 rounded-full ${step === 1 ? 'bg-gray-800' : 'bg-gray-400'}`} />
        <span className={`block h-1.5 w-1.5 rounded-full ${step === 2 ? 'bg-gray-800' : 'bg-gray-400'}`} />
      </div>
    </Modal>
  );
}

export default CryptoModal;
