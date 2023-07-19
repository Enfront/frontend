import { Tabs, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import BillingTab from '&/components/dashboard/account/BillingTab';
import PersonalInformationTab from '&/components/dashboard/account/PersonalInformationTab';
import SecurityTab from '&/components/dashboard/account/SecurityTab';
import DashboardLayout from '&/components/layouts/DashboardLayout';
import { ProtectedRoute } from '&/contexts/AuthContext';

function Index(): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 900px)');

  return (
    <DashboardLayout
      tabTitle="Dashboard | Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Title className="text-2xl" order={1} mb="md">
        Account Settings
      </Title>

      <Tabs defaultValue="personal">
        <Tabs.List className="no-scrollbar flex-nowrap overflow-x-auto overflow-y-hidden" mb="xl" pb={4}>
          <Tabs.Tab value="personal">Personal Information</Tabs.Tab>
          <Tabs.Tab value="security">Security</Tabs.Tab>
          <Tabs.Tab value="billing">Billing</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="personal">
          <PersonalInformationTab isDesktop={isDesktop} />
        </Tabs.Panel>

        <Tabs.Panel value="security">
          <SecurityTab isDesktop={isDesktop} />
        </Tabs.Panel>

        <Tabs.Panel value="billing">
          <BillingTab />
        </Tabs.Panel>
      </Tabs>
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
