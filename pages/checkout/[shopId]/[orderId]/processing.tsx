import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { Loader, Stack, Text } from '@mantine/core';
import axios, { AxiosResponse } from 'axios';

function Processing(): JSX.Element {
  const router = useRouter();
  const { shopId, orderId } = router.query;

  useEffect(() => {
    const getOrderStatus = async (): Promise<void> => {
      if (orderId !== undefined) {
        const pollTimer = setInterval(async () => {
          await axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/checkout/${orderId}`)
            .then((response: AxiosResponse) => {
              if (response.data.data.current_status !== -2 && response.data.data.current_status !== 0) {
                router.push({ pathname: `/checkout/${shopId}/${orderId}`, query: { redirect_status: 'success' } });
                clearInterval(pollTimer);
              }
            });
        }, 5000);
      }
    };

    getOrderStatus();
  });

  return (
    <Stack className="h-screen" align="center" justify="center" spacing={0}>
      <Loader size="xl" />
      <Text size="lg" mt={12} mb={4}>
        Your order is processing
      </Text>
      <Text color="gray">This can take up to one minute</Text>
    </Stack>
  );
}

export default Processing;
