import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';

import { Button, Group, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios, { AxiosResponse } from 'axios';

interface EmailFormProps {
  setEmailStepComplete: Dispatch<SetStateAction<boolean>>;
  getOrderInfo: () => Promise<void>;
}

function EmailForm({ setEmailStepComplete, getOrderInfo }: EmailFormProps): JSX.Element {
  const router = useRouter();
  const { orderId, shopId } = router.query;

  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const onSubmit = (data: { email: string }): void => {
    axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
        order_ref: orderId,
        shop_ref: shopId,
        email: data.email,
      })
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          setEmailStepComplete(true);
          getOrderInfo();
        }
      });
  };

  return (
    <form onSubmit={form.onSubmit((values: { email: string }) => onSubmit(values))}>
      <Title order={2}>Confirmation Email</Title>

      <TextInput placeholder="Email Address" label="Email Address" my="md" required {...form.getInputProps('email')} />

      <Group position="apart">
        <Text color="gray" size="sm">
          You won&apos;t be charged until the next step.
        </Text>

        <Button type="submit">Continue</Button>
      </Group>
    </form>
  );
}

export default EmailForm;
