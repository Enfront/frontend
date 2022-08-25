import Image from 'next/future/image';

import { Button, Container, Text, Title } from '@mantine/core';

import backgroundImage from '../../../public/backgrounds/background-call-to-action.jpg';

function CallToAction(): JSX.Element {
  return (
    <section id="get-started-today" className="relative overflow-hidden bg-blue-600 py-32">
      <Image
        className="absolute -top-3/4 -left-1/4 max-w-none"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />

      <Container className="relative" size="xl">
        <div className="mx-auto max-w-lg text-center">
          <Title className="font-display text-3xl tracking-tight text-white sm:text-4xl" order={2}>
            Get started today
          </Title>

          <Text className="mt-4 text-lg tracking-tight" color="white">
            We would love to have your business Enfront of customers. With only a few clicks that can happen.
          </Text>

          <Button
            className="mt-8 bg-white text-slate-900 hover:bg-blue-50 focus:outline-none focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-white active:bg-blue-200 active:text-slate-600"
            radius="xl"
          >
            Register for Free
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default CallToAction;
