import { useState } from 'react';

import { Button, Flex, Tabs, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import DashboardLayout from '../../../components/layouts/DashboardLayout';
import BasicInfoTab from '../../../components/dashboard/settings/BasicInfoTab';
import PaymentsTab from '../../../components/dashboard/settings/PaymentsTab';
import BlacklistTab from '../../../components/dashboard/settings/BlacklistTab';
import DangerTab from '../../../components/dashboard/settings/DangerTab';
import PayoutsTab from '../../../components/dashboard/settings/PayoutsTab';
import { ProtectedRoute } from '../../../contexts/AuthContext';

function Index(): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 900px)');

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string | null>('');

  return (
    <DashboardLayout
      tabTitle="Shop Settings | Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Flex
        align={isDesktop ? 'center' : 'flex-start'}
        direction={isDesktop ? 'row' : 'column'}
        justify="space-between"
        mb={16}
        mih={36}
      >
        <Title className="text-2xl" order={1}>
          Shop Settings
        </Title>

        {selectedTab === 'blacklists' && (
          <Button onClick={() => setOpenModal(true)} fullWidth={!isDesktop} mt={isDesktop ? 0 : 16}>
            Add BlacklistItem Item
          </Button>
        )}
      </Flex>

      <Tabs defaultValue="general" onTabChange={setSelectedTab}>
        <Tabs.List className="no-scrollbar flex-nowrap overflow-x-auto overflow-y-hidden" mb={24} pb={4}>
          <Tabs.Tab value="general">General Information</Tabs.Tab>
          <Tabs.Tab value="payments">Payment Methods</Tabs.Tab>
          <Tabs.Tab value="payouts">Crypto Payouts</Tabs.Tab>
          <Tabs.Tab value="blacklists">Blacklists</Tabs.Tab>

          <Tabs.Tab value="danger" color="red">
            Danger Zone
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general">
          <BasicInfoTab isDesktop={isDesktop} />
        </Tabs.Panel>

        <Tabs.Panel value="payments">
          <PaymentsTab />
        </Tabs.Panel>

        <Tabs.Panel value="payouts">
          <PayoutsTab />
        </Tabs.Panel>

        <Tabs.Panel value="blacklists">
          <BlacklistTab isDesktop={isDesktop} openModal={openModal} setOpenModal={setOpenModal} />
        </Tabs.Panel>

        <Tabs.Panel value="danger">
          <DangerTab isDesktop={isDesktop} />
        </Tabs.Panel>
      </Tabs>
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
