import Image from 'next/future/image';

import { Stack, Text, Title } from '@mantine/core';

function WhatsNew(): JSX.Element {
  return (
    <Stack align="center" spacing={4}>
      <Image src="/whats_new/new_theme.png" height={232} width={400} priority />

      <Title order={1} size="h4" mt="md">
        Our Default Theme Has Changed!
      </Title>

      <Text align="center" size="sm">
        We have changed our templating language to Liquid, and with that comes our brand new default theme, Portrait.
        This theme looks great on desktop and mobile devices and is fully customizable. Visit our{' '}
        <a href="https://github.com/Enfront/portrait" target="_blank" rel="noreferrer">
          Github
        </a>{' '}
        to see the source code.
      </Text>
    </Stack>
  );
}

export default WhatsNew;
