import Image from 'next/future/image';

import { Container, Text, Title } from '@mantine/core';

import backgroundImage from '../../../public/backgrounds/background-faqs.jpg';

const faqs = [
  [
    {
      question: 'How is Enfront different than other providers?',
      answer:
        'We are not a typical provider, we are a company that is dedicated to providing the best service to our customers.',
    },
    {
      question: 'What are your fees?',
      answer: 'We run a simple model of 3%, 2%, 1% for our different tiers - PayPal is always 0% though.',
    },
    {
      question: 'I received a lot of traffic to my shop - is Enfront able to keep up?',
      answer:
        'In our Alpha phase we were able to service a shop with over 100,000 visitors per month. We believe we can top that.',
    },
  ],
  [
    {
      question: 'Can I develop my own theme?',
      answer: 'You most certainly can. With basic HTML knowledge it is easy to create a theme that fits your needs.',
    },
    {
      question: 'Can I use my own domain?',
      answer:
        'Right now all shops have a custom subdomain. We are in the process of implementing a custom domain option.',
    },
  ],
  [
    {
      question: 'Do you offer a free trial?',
      answer: 'We have a free tier that will always remain free. It is a great tier to see if Enfront fits your needs.',
    },
    {
      question: 'Does Enfront handle my chargebacks?',
      answer: 'We do not directly handle them but we provide you a suite of tools to fight any your receive.',
    },
  ],
];

function Faqs(): JSX.Element {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative overflow-hidden bg-slate-50 py-20 sm:py-32">
      <Image
        className="absolute -top-1/4 left-1/3 max-w-none"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />

      <Container className="relative" size="xl">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <Title id="faq-title" className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl" order={2}>
            Frequently asked questions
          </Title>

          <Text className="mt-4 text-lg tracking-tight text-slate-700">
            If you can’t find what you’re looking for, use our live chat feature and contact our support team. We always
            make an effort to get back to your under 5 minutes.
          </Text>
        </div>

        <ul className="mx-auto mt-16 mb-0 grid max-w-2xl list-none grid-cols-1 gap-8 pl-0 lg:max-w-none lg:grid-cols-3">
          {faqs.map((column, columnIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={columnIndex}>
              <ul className="flex list-none flex-col gap-y-8 pl-0">
                {column.map((faq: { answer: string; question: string }) => (
                  <li key={faq.question}>
                    <Title className="font-display text-lg leading-7 text-slate-900" order={3}>
                      {faq.question}
                    </Title>
                    <Text className="mt-4 text-sm text-slate-700">{faq.answer}</Text>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default Faqs;
