import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { ActionIcon, Avatar, Box, Modal, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { ArrowNarrowLeft, ArrowNarrowRight, Check } from 'tabler-icons-react';
import axios, { AxiosResponse } from 'axios';

import { AcceptedCryptoAddresses, CryptoTxnInfo } from '../../../types/types';

interface CryptoModalProps {
  acceptedCryptos: AcceptedCryptoAddresses[];
  buyerEmail: string;
  existingCryptoOrder: CryptoTxnInfo;
  isVisible: boolean;
  shopCurrency: string;
  setIsVisible: (isVisible: boolean) => void;
}

function CryptoModal({
  acceptedCryptos,
  buyerEmail,
  existingCryptoOrder,
  isVisible,
  shopCurrency,
  setIsVisible,
}: CryptoModalProps): JSX.Element {
  const router = useRouter();
  const clipboardAmount = useClipboard({ timeout: 500 });
  const clipboardDestination = useClipboard({ timeout: 500 });

  const { shopId, orderId } = router.query;

  const [step, setStep] = useState<number>(0);
  const [cryptoTxnDetails, setCryptoTxnDetails] = useState<CryptoTxnInfo>({
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
  });

  const pollCryptoIpn = (): void => {
    const pollTimer = setInterval(async () => {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/payments/crypto/${orderId}`)
        .then((response: AxiosResponse) => {
          const status = response.data.data?.status;

          if (status === 'InvoiceProcessing' || status === 'InvoiceReceivedPayment') {
            setCryptoTxnDetails(response.data.data);
            setStep(2);
          } else if (status === 'InvoiceSettled') {
            clearInterval(pollTimer);
            router.push(`/checkout/${shopId}/${orderId}/processing`);
          }
        });
    }, 30000);
  };

  const createCryptoOrder = async (): Promise<void> => {
    const cryptoStarted = checkForExistingCryptoInvoice(cryptoTxnDetails);

    if (!cryptoStarted) {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/payments/crypto`, {
          order_ref: orderId,
          fiat_currency: shopCurrency,
          email: buyerEmail,
        })
        .then((response: AxiosResponse) => {
          setCryptoTxnDetails(response.data.data);
          pollCryptoIpn();
          setStep(1);
        });
    }
  };

  const checkForExistingCryptoInvoice = (existingInvoice: CryptoTxnInfo): boolean => {
    switch (existingInvoice?.status) {
      case 'New':
        pollCryptoIpn();
        setStep(1);
        return true;

      case 'Processing':
        pollCryptoIpn();
        setStep(2);
        return true;

      default:
        return false;
    }
  };

  useEffect(() => {
    const setData = (): void => {
      if (existingCryptoOrder) {
        setCryptoTxnDetails(existingCryptoOrder);
        checkForExistingCryptoInvoice(existingCryptoOrder);
      }
    };

    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      opened={isVisible}
      onClose={() => setIsVisible(false)}
      size={394}
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
            {acceptedCryptos.map((crypto: AcceptedCryptoAddresses) => (
              <button
                className="flex w-full cursor-pointer items-center justify-between rounded-md border-0 bg-white
                p-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => createCryptoOrder()}
                type="button"
                key={crypto.name}
              >
                <span className="flex items-center">
                  <Image src={crypto.logo} width={21} height={21} layout="intrinsic" alt={crypto.name} />
                  <span className="ml-4 truncate">{crypto.name}</span>
                </span>

                <ArrowNarrowRight className="h-4 w-4" />
              </button>
            ))}
          </Stack>
        </>
      )}

      {step === 1 && cryptoTxnDetails.destination !== '' && (
        <>
          <Text align="center" weight={500}>
            Pay With {cryptoTxnDetails.cryptoCode}
          </Text>

          <Text align="center" color="gray" size="sm" mt={8} mb={16}>
            To complete your order please send the exact amount of {cryptoTxnDetails.cryptoCode} to the address below.
          </Text>

          <div className="flex justify-center">
            <Image
              src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chld=L|0&chl=${cryptoTxnDetails.paymentLink}`}
              layout="intrinsic"
              height="200"
              width="200"
              alt={`Crypto QR code for ${cryptoTxnDetails.cryptoCode} transaction.`}
            />
          </div>

          <Tooltip className="block" label={clipboardAmount.copied ? 'Copied' : 'Click to copy'} offset={-20}>
            <Box onClick={() => clipboardAmount.copy(cryptoTxnDetails.amount)}>
              <TextInput placeholder="Amount" label="Amount" value={cryptoTxnDetails.amount} mt={16} disabled />
            </Box>
          </Tooltip>

          <Tooltip label={clipboardDestination.copied ? 'Copied' : 'Click to copy'} offset={-20}>
            <Box onClick={() => clipboardDestination.copy(cryptoTxnDetails.destination)}>
              <TextInput placeholder="Address" label="Address" value={cryptoTxnDetails.destination} mt={8} disabled />
            </Box>
          </Tooltip>
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
            {cryptoTxnDetails.cryptoCode} Received
          </Text>

          <Text align="center" color="gray" size="sm" mt={8}>
            We are currently waiting for your payment to be confirmed by the {cryptoTxnDetails.cryptoCode} network. You
            will be redirected once the payment is complete.
          </Text>

          <Text align="center" color="gray" size="sm" mt={8} mb={16}>
            We have received{' '}
            <Text className="inline-block" color="dark" weight={500}>
              {cryptoTxnDetails.totalPaid}
            </Text>{' '}
            {cryptoTxnDetails.cryptoCode} of{' '}
            <Text className="inline-block" color="dark" weight={500}>
              {cryptoTxnDetails.amount}
            </Text>{' '}
            {cryptoTxnDetails.cryptoCode}
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
