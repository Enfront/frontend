import Link from 'next/link';

import { Container, Stack, Text, Title } from '@mantine/core';

import PublicLayout from '&/components/layouts/PublicLayout';

function Cookies(): JSX.Element {
  return (
    <PublicLayout
      pageTitle="Cookie Policy | Enfront"
      metaDescription="Enfront takes e-commerce to the next level by offering a vast amount of innovative tools designed
      to simplify, optimize, and accelerate the process."
    >
      <Container px="xs" py={112}>
        <Stack>
          <Title order={1}>Cookie Policy</Title>

          <Text color="gray">
            We use cookies to help improve your experience of our website at{' '}
            <Link href="https://enfront.io">
              <Text className="inline-flex" color="brand">
                https://enfront.io
              </Text>
            </Link>
            . This cookie policy is part of Enfront&#39;s privacy policy. It covers the use of cookies between your
            device and our site.
          </Text>

          <Text color="gray">
            We also provide basic information on third-party services we may use, who may also use cookies as part of
            their service. This policy does not cover their cookies.
          </Text>

          <Text color="gray">
            If you don’t wish to accept cookies from us, you should instruct your browser to refuse cookies from{' '}
            <Link href="https://enfront.io">
              <Text className="inline-flex" color="brand">
                https://enfront.io
              </Text>
            </Link>
            . In such a case, we may be unable to provide you with some of your desired content and services.
          </Text>

          <Title order={2} mt={32}>
            What is a cookie?
          </Title>

          <Text color="gray">
            A cookie is a small piece of data that a website stores on your device when you visit. It typically contains
            information about the website itself, a unique identifier that allows the site to recognize your web browser
            when you return, additional data that serves the cookie’s purpose, and the lifespan of the cookie itself.
          </Text>

          <Text color="gray">
            Cookies are used to enable certain features (e.g. logging in), track site usage (e.g. analytics), store your
            user settings (e.g. time zone, notification preferences), and to personalize your content (e.g. advertising,
            language).
          </Text>

          <Text color="gray">
            Cookies set by the website you are visiting are usually referred to as first-party cookies. They typically
            only track your activity on that particular site.
          </Text>

          <Text color="gray">
            Cookies set by other sites and companies (i.e. third parties) are called third-party cookies They can be
            used to track you on other websites that use the same third-party service.
          </Text>

          <Title order={2} mt={32}>
            Types of cookies and how we use them
          </Title>

          <Title order={3} mt={24}>
            Essential cookies
          </Title>

          <Text color="gray">
            Essential cookies are crucial to your experience of a website, enabling core features like user logins,
            account management, shopping carts, and payment processing.
          </Text>

          <Text color="gray">We use essential cookies to enable certain functions on our website.</Text>

          <Title order={3} mt={24}>
            Performance cookies
          </Title>
          <Text color="gray">
            Performance cookies track how you use a website during your visit. Typically, this information is anonymous
            and aggregated, with information tracked across all site users. They help companies understand visitor usage
            patterns, identify and diagnose problems or errors their users may encounter, and make better strategic
            decisions in improving their audience’s overall website experience. These cookies may be set by the website
            you’re visiting (first-party) or by third-party services. They do not collect personal information about
            you.
          </Text>

          <Text color="gray">We do not use this type of cookie on our site.</Text>

          <Title order={3} mt={24}>
            Functionality cookies
          </Title>

          <Text color="gray">
            Functionality cookies are used to collect information about your device and any settings you may configure
            on the website you’re visiting (like language and time zone settings). With this information, websites can
            provide you with customized, enhanced, or optimized content and services. These cookies may be set by the
            website you’re visiting (first-party) or by third-party services.
          </Text>

          <Text color="gray">We use functionality cookies for selected features on our site.</Text>

          <Title order={3} mt={24}>
            Targeting/advertising cookies
          </Title>

          <Text color="gray">
            Targeting/advertising cookies help determine what promotional content is most relevant and appropriate to
            you and your interests. Websites may use them to deliver targeted advertising or limit the number of times
            you see an advertisement. This helps companies improve the effectiveness of their campaigns and the quality
            of content presented to you. These cookies may be set by the website you’re visiting (first-party) or by
            third-party services. Targeting/advertising cookies set by third-parties may be used to track you on other
            websites that use the same third-party service.
          </Text>

          <Text color="gray">We do not use this type of cookie on our site.</Text>
        </Stack>
      </Container>
    </PublicLayout>
  );
}

export default Cookies;
