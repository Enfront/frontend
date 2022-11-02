import { useState } from 'react';

import { Button, Group, Tabs, Title } from '@mantine/core';

import { ProtectedRoute } from '../../../contexts/AuthContext';

import DashboardLayout from '../../../components/layouts/DashboardLayout';
import BasicInfoTab from '../../../components/dashboard/settings/BasicInfoTab';
import PaymentsTab from '../../../components/dashboard/settings/PaymentsTab';
import BlacklistTab from '../../../components/dashboard/settings/BlacklistTab';
import DangerTab from '../../../components/dashboard/settings/DangerTab';
import PayoutsTab from '../../../components/dashboard/settings/PayoutsTab';

function Index(): JSX.Element {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string | null>('');

  return (
    <DashboardLayout
      tabTitle="Shop Settings | Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Group position="apart" mb={24}>
        <Title className="text-2xl" order={1}>
          Shop Settings
        </Title>

        {selectedTab === 'blacklists' && <Button onClick={() => setOpenModal(true)}>Add BlacklistItem Item</Button>}
      </Group>

      <Tabs defaultValue="general" onTabChange={setSelectedTab}>
        <Tabs.List>
          <Tabs.Tab value="general">General Information</Tabs.Tab>
          <Tabs.Tab value="payments">Payment Methods</Tabs.Tab>
          <Tabs.Tab value="payouts">Crypto Payouts</Tabs.Tab>
          <Tabs.Tab value="blacklists">Blacklists</Tabs.Tab>

          <Tabs.Tab value="danger" color="red">
            Danger Zone
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general">
          <BasicInfoTab />
        </Tabs.Panel>

        <Tabs.Panel value="payments">
          <PaymentsTab />
        </Tabs.Panel>

        <Tabs.Panel value="payouts">
          <PayoutsTab />
        </Tabs.Panel>

        <Tabs.Panel value="blacklists">
          <BlacklistTab openModal={openModal} setOpenModal={setOpenModal} />
        </Tabs.Panel>

        <Tabs.Panel value="danger">
          <DangerTab />
        </Tabs.Panel>
      </Tabs>
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
