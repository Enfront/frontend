import { ReactNode } from 'react';
import Image, { StaticImageData } from 'next/image';

import { Tab } from '@headlessui/react';
import { Container, Text, Title } from '@mantine/core';
import { useId } from '@mantine/hooks';
import clsx from 'clsx';

import screenshotContacts from '&/public/screenshots/contacts.png';
import screenshotInventory from '&/public/screenshots/inventory.png';
import screenshotProfitLoss from '&/public/screenshots/profit-loss.png';

interface FeatureProps {
  className: string;
  feature: Feature;
  isActive: boolean;
}

interface Feature {
  icon: () => JSX.Element;
  image: StaticImageData;
  name: string | ReactNode;
  summary: string;
}

const features: Feature[] = [
  {
    name: 'Reporting',
    summary: 'Stay on top of things with always up-to-date reporting features.',
    image: screenshotProfitLoss,
    icon: function ReportingIcon() {
      const id = useId();
      return (
        <>
          <defs>
            <linearGradient id={id} x1="11.5" y1={18} x2={36} y2="15.5" gradientUnits="userSpaceOnUse">
              <stop offset=".194" stopColor="#fff" />
              <stop offset={1} stopColor="#6692F1" />
            </linearGradient>
          </defs>

          <path
            d="m30 15-4 5-4-11-4 18-4-11-4 7-4-5"
            stroke={`url(#${id})`}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    },
  },
  {
    name: 'Inventory',
    summary: 'Never lose track of what’s in stock with accurate inventory tracking.',
    image: screenshotInventory,
    icon: function InventoryIcon() {
      return (
        <>
          <path opacity=".5" d="M8 17a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z" fill="#fff" />
          <path opacity=".3" d="M8 24a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z" fill="#fff" />
          <path d="M8 10a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2Z" fill="#fff" />
        </>
      );
    },
  },
  {
    name: 'Customers',
    summary: 'Discover your audience and get to know your customers all in one place.',
    image: screenshotContacts,
    icon: function ContactsIcon() {
      return (
        <>
          <path
            opacity=".5"
            d="M25.778 25.778c.39.39 1.027.393 1.384-.028A11.952 11.952 0 0 0 30 18c0-6.627-5.373-12-12-12S6 11.373 6 18c0 2.954 1.067 5.659 2.838 7.75.357.421.993.419 1.384.028.39-.39.386-1.02.036-1.448A9.959 9.959 0 0 1 8 18c0-5.523 4.477-10 10-10s10 4.477 10 10a9.959 9.959 0 0 1-2.258 6.33c-.35.427-.354 1.058.036 1.448Z"
            fill="#fff"
          />
          <path
            d="M12 28.395V28a6 6 0 0 1 12 0v.395A11.945 11.945 0 0 1 18 30c-2.186 0-4.235-.584-6-1.605ZM21 16.5c0-1.933-.5-3.5-3-3.5s-3 1.567-3 3.5 1.343 3.5 3 3.5 3-1.567 3-3.5Z"
            fill="#fff"
          />
        </>
      );
    },
  },
];

function Feature({ feature, isActive, className, ...props }: FeatureProps) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className={clsx(className, !isActive && 'opacity-75 hover:opacity-100')} {...props}>
      <div className={clsx('w-9 rounded-lg', isActive ? 'bg-blue-600' : 'bg-slate-500')}>
        <svg className="block h-9 w-9" fill="none" aria-hidden="true">
          <feature.icon />
        </svg>
      </div>

      <Title className={clsx('mt-6 p-0 text-sm font-medium', isActive ? 'text-blue-600' : 'text-slate-600')} order={3}>
        {feature.name}
      </Title>

      <Text className="mt-2 text-xl text-slate-900" size="md">
        {feature.summary}
      </Text>
    </div>
  );
}

function FeaturesMobile() {
  return (
    <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {features.map((feature) => (
        <div key={feature.summary}>
          <Feature className="mx-auto max-w-2xl" feature={feature} isActive />

          <div className="relative mt-10 pb-10">
            <div className="absolute -inset-x-4 bottom-0 top-8 bg-slate-200 sm:-inset-x-6" />

            <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
              <Image className="w-full" src={feature.image} alt="" sizes="52.75rem" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturesDesktop() {
  return (
    <Tab.Group className="hidden lg:mt-20 lg:block" as="div">
      {({ selectedIndex }) => (
        <>
          <Tab.List className="grid grid-cols-3 gap-x-8">
            {features.map((feature, featureIndex) => (
              <Feature
                className="relative"
                isActive={featureIndex === selectedIndex}
                key={feature.summary}
                feature={{
                  ...feature,
                  name: (
                    <Tab
                      className={clsx(
                        'border-0 bg-transparent p-0 outline-none',
                        featureIndex === selectedIndex ? 'text-blue-600' : 'text-slate-600',
                      )}
                    >
                      <span className="absolute inset-0" />
                      {feature.name}
                    </Tab>
                  ),
                }}
              />
            ))}
          </Tab.List>

          <Tab.Panels className="relative mt-20 overflow-hidden bg-slate-200 px-14 py-16 xl:px-16">
            <div className="-mx-5 flex">
              {features.map((feature, featureIndex) => (
                <Tab.Panel
                  className={clsx(
                    'border-0 bg-transparent px-5 outline-none transition duration-500 ease-in-out',
                    featureIndex !== selectedIndex && 'opacity-60',
                  )}
                  key={feature.summary}
                  aria-hidden={featureIndex !== selectedIndex}
                  style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                  static
                >
                  <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
                    <Image className="h-auto w-full" src={feature.image} alt="" sizes="52.75rem" />
                  </div>
                </Tab.Panel>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-slate-900/10" />
          </Tab.Panels>
        </>
      )}
    </Tab.Group>
  );
}

function SecondaryFeatures(): JSX.Element {
  return (
    <section
      id="secondary-features"
      aria-label="Features for simplifying everyday business tasks"
      className="pb-14 pt-20 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <Container size="xl">
        <div className="mx-auto max-w-2xl md:text-center">
          <Title className="text-3xl tracking-tight text-slate-900 sm:text-4xl" order={2}>
            Simplify everyday business tasks.
          </Title>

          <Text className="mt-4 text-lg tracking-tight text-slate-700">
            We provide a suite of tools that help you get the most out of your business without all the unnecessary
            complication.
          </Text>
        </div>

        <FeaturesMobile />
        <FeaturesDesktop />
      </Container>
    </section>
  );
}

export default SecondaryFeatures;
