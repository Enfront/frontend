import PublicLayout from '&/components/layouts/PublicLayout';
import CallToAction from '&/components/public/index/CallToAction';
import Faqs from '&/components/public/index/Faqs';
import Hero from '&/components/public/index/Hero';
import Pricing from '&/components/public/index/Pricing';
import PrimaryFeatures from '&/components/public/index/PrimaryFeatures';
import SecondaryFeatures from '&/components/public/index/SecondaryFeatures';

function Index(): JSX.Element {
  return (
    <PublicLayout
      pageTitle="Enfront"
      metaDescription="Enfront takes e-commerce to the next level by offering a vast amount of innovative tools designed
      to simplify, optimize, and accelerate the process."
    >
      <Hero />
      <PrimaryFeatures />
      <SecondaryFeatures />
      <CallToAction />
      <Pricing />
      <Faqs />
    </PublicLayout>
  );
}

export default Index;
