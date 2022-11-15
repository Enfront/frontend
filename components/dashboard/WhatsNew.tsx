import Image from 'next/future/image';

import { Stack, Text, Title } from '@mantine/core';

function WhatsNew(): JSX.Element {
  return (
    <Stack align="center" spacing={4}>
      <Image src="/whats_new/collections.png" height={148} width={400} priority />

      <Title order={1} size="h4" mt="md">
        Introducing Collections!
      </Title>

      <Text align="center" size="sm">
        You can now put your products into collections. These collections will have their own unique URL that your
        customers can be redirected to.
      </Text>
    </Stack>
  );
}

export default WhatsNew;
