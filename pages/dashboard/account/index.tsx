import { Tabs, Title } from '@mantine/core';

import DashboardLayout from '../../../components/layouts/DashboardLayout';
import PersonalInformationTab from '../../../components/dashboard/account/PersonalInformationTab';
import BillingTab from '../../../components/dashboard/account/BillingTab';
import { ProtectedRoute } from '../../../contexts/AuthContext';

function Index(): JSX.Element {
  return (
    <DashboardLayout
      tabTitle="Dashboard - Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Title className="mb-12" order={1}>
        Account Settings
      </Title>

      <Tabs defaultValue="personal">
        <Tabs.List>
          <Tabs.Tab value="personal">Personal Information</Tabs.Tab>
          <Tabs.Tab value="billing">Billing</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="personal">
          <PersonalInformationTab />
        </Tabs.Panel>

        <Tabs.Panel value="billing">
          <BillingTab />
        </Tabs.Panel>
      </Tabs>
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
