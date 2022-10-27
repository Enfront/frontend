import { useState } from 'react';

import { Button, Group, Tabs, Title } from '@mantine/core';

import { ProtectedRoute } from '../../../contexts/AuthContext';

import DashboardLayout from '../../../components/layouts/DashboardLayout';
import BasicInfoTab from '../../../components/dashboard/shop/BasicInfoTab';
import PaymentsTab from '../../../components/dashboard/shop/PaymentsTab';
import BlacklistTab from '../../../components/dashboard/shop/BlacklistTab';
import DangerTab from '../../../components/dashboard/shop/DangerTab';

function Index(): JSX.Element {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string | null>('');

  return (
    <DashboardLayout
      tabTitle="Dashboard - Enfront"
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
