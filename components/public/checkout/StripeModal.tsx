import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Modal, Text } from '@mantine/core';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

interface StripeModalProps {
  getOrderInfo: () => void;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

function StripeModal({ getOrderInfo, isVisible, setIsVisible }: StripeModalProps): JSX.Element {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const { orderId, shopId } = router.query;

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/${shopId}/${orderId}`,
      },
    });

    if (error) {
      setProcessing(false);
      setErrorMessage(error.message);
    }

    getOrderInfo();
  };

  return (
    <Modal opened={isVisible} onClose={() => setIsVisible(false)} size={384} centered>
      <Text align="center" weight={500}>
        Pay With Stripe
      </Text>

      <Text align="center" color="gray" size="sm" mt={8} mb={errorMessage ? 8 : 24}>
        When paying with Stripe, neither the seller nor Enfront has access to your card details.
      </Text>

      {errorMessage && (
        <Text align="center" color="red" size="sm" mb={24}>
          {errorMessage}
        </Text>
      )}

      <form onSubmit={handleSubmit}>
        <PaymentElement />

        <Button type="submit" loading={processing} disabled={!stripe || !elements} mt={24} fullWidth>
          Submit Payment
        </Button>
      </form>
    </Modal>
  );
}

export default StripeModal;
