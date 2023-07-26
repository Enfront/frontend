import { useEffect, useState } from 'react';
import Image from 'next/future/image';

import { Tab } from '@headlessui/react';
import { Container, Text, Title } from '@mantine/core';
import clsx from 'clsx';

import screenshotCustomer from '&/public/screenshots/customer.png';
import screenshotOrder from '&/public/screenshots/order.png';
import screenshotProduct from '&/public/screenshots/product.png';
import screenshotTheme from '&/public/screenshots/theme.png';

const features = [
  {
    title: 'Product Management',
    description:
      'We allow you to customize every aspect of your product. Add multiple images and choose when to show or hide them.',
    image: screenshotProduct,
    alt: 'Product screenshot',
  },
  {
    title: 'Order Information',
    description: 'You can see every detail of the order to better serve your customers or fight pesky chargebacks.',
    image: screenshotOrder,
    alt: 'Order screenshot',
  },
  {
    title: 'Customer Information',
    description:
      'See the demographics of who is ordering your product and allow your marketing strategy to reflect that.',
    image: screenshotCustomer,
    alt: 'Customer screenshot',
  },
  {
    title: 'Personalized Themes',
    description: 'You get your own website with your own theme. Customize it how you like it and make it your own.',
    image: screenshotTheme,
    alt: 'Theme editor screenshot',
  },
];

function PrimaryFeatures(): JSX.Element {
  const [tabOrientation, setTabOrientation] = useState<string>('horizontal');

  useEffect(() => {
    const lgMediaQuery = window.matchMedia('(min-width: 1024px)');

    function onMediaQueryChange({ matches }: { matches: 'vertical' | 'horizontal' | boolean }): void {
      setTabOrientation(matches ? 'vertical' : 'horizontal');
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener('change', onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-blue-600 pb-28 pt-20 sm:py-32"
      aria-label="Features for running your books"
    >
      <Image
        className="absolute inset-0 max-w-none"
        src="/backgrounds/background-features.jpg"
        alt="Gradient background"
        width={2245}
        height={1636}
        unoptimized
      />

      <Container className="relative" size="xl">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <Title className="text-3xl tracking-tight text-white sm:text-4xl md:text-5xl" order={2}>
            Everything you need to run your business.
          </Title>

          <Text className="mx-auto mt-6 max-w-4xl text-lg tracking-tight text-blue-100">
            Customization & seller protection have always been our two biggest pain points. Cookie-cutter solutions and
            the lack of chargeback tools were hindering our growth and keeping us from the next level.
          </Text>
        </div>

        <Tab.Group
          as="div"
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6',
                        selectedIndex === featureIndex
                          ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'
                          : 'hover:bg-white/10 lg:hover:bg-white/5',
                      )}
                    >
                      <Title className="m-0" order={3}>
                        <Tab
                          className={clsx(
                            'border-0 bg-transparent p-0 text-lg outline-none',
                            selectedIndex === featureIndex
                              ? 'text-blue-600 lg:text-white'
                              : 'text-blue-100 hover:text-white lg:text-white',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </Title>

                      <Text
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === featureIndex ? 'text-white' : 'text-blue-100 group-hover:text-white',
                        )}
                      >
                        {feature.description}
                      </Text>
                    </div>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="lg:col-span-7">
                {features.map((feature) => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />

                      <Text className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </Text>
                    </div>

                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <Image
                        className="h-auto w-full"
                        src={feature.image}
                        alt={feature.alt}
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                        priority
                      />
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </Container>
    </section>
  );
}

export default PrimaryFeatures;
