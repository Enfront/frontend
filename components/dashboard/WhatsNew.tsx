import Image from 'next/image';

import { Stack, Text, Title } from '@mantine/core';

import twoFactor from '&/public/whats_new/two_factor.png';

function WhatsNew(): JSX.Element {
  return (
    <Stack align="center" spacing={4}>
      <Image className="h-auto w-96" src={twoFactor} placeholder="blur" alt="Two factor setup" priority />

      <Title order={1} size="h4" mt="md">
        Two-Factor Authentication Has Been Added
      </Title>

      <Text align="center" size="sm">
        To keep our users safe, we have added two-factor authentication to our platform. This means that you will need
        to enter a code from an 2FA app in addition to your password to log in. This is a security measure that we
        highly recommend you enable.
      </Text>
    </Stack>
  );
}

export default WhatsNew;
