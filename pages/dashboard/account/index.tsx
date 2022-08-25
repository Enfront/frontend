import { useState } from 'react';

import { Tabs, Title } from '@mantine/core';

import DashboardLayout from '../../../components/layouts/DashboardLayout';
import PersonalInformationTab from '../../../components/dashboard/account/PersonalInformationTab';
import BillingTab from '../../../components/dashboard/account/BillingTab';

function Index(): JSX.Element {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <DashboardLayout
      tabTitle="Dashboard - Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Title className="mb-12" order={1}>
        Account Settings
      </Title>

      <Tabs active={selectedTab} onTabChange={setSelectedTab}>
        <Tabs.Tab label="Personal Information">
          <PersonalInformationTab />
        </Tabs.Tab>

        <Tabs.Tab label="Billing">
          <BillingTab />
        </Tabs.Tab>
      </Tabs>
    </DashboardLayout>
  );
}

export default Index;
