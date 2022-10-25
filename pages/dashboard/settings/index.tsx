import { useState } from 'react';
// import { useRouter } from 'next/router';

import { Button, Group, Tabs, Title } from '@mantine/core';
// import axios from 'axios';

import { ProtectedRoute } from '../../../contexts/AuthContext';
// import useShop from '../../../contexts/ShopContext';

import DashboardLayout from '../../../components/layouts/DashboardLayout';
import BasicInfoTab from '../../../components/dashboard/shop/BasicInfoTab';
import PaymentsTab from '../../../components/dashboard/shop/PaymentsTab';
import BlacklistTab from '../../../components/dashboard/shop/BlacklistTab';
import DangerTab from '../../../components/dashboard/shop/DangerTab';
// import { PayPalData } from '../../../types/types';

// interface SettingsProps {
//   payPalAccessToken: string;
// }

// function Index({ payPalAccessToken }: SettingsProps): JSX.Element {
function Index(): JSX.Element {
  // const router = useRouter();

  // const { selectedShop } = useShop();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string | null>('');

  // Only if we need to save PayPal info
  // const {
  //   merchantId,
  //   merchantIdInPayPal,
  //   permissionsGranted,
  //   consentStatus,
  //   productIntentId,
  //   isEmailConfirmed,
  //   accountStatus,
  // } = router.query;

  // useEffect(() => {
  //   const savePayPalInfo = async (): Promise<void> => {
  //     if (merchantId !== undefined && selectedShop.ref_id !== '') {
  //       const paypalData: PayPalData = {
  //         merchant_id: merchantIdInPayPal,
  //         permissions_granted: permissionsGranted === 'true' ? 'True' : 'False',
  //         consent_status: consentStatus === 'true' ? 'True' : 'False',
  //         product_intent_id: productIntentId,
  //         is_email_confirmed: isEmailConfirmed === 'true' ? 'True' : 'False',
  //         account_status: accountStatus,
  //       };
  //
  //       axios.post(`${process.env.NEXT_PUBLIC_API_URL}/shops/paypal/${selectedShop.ref_id}`, paypalData).then(() => {
  //         router.push('/dashboard/settings');
  //       });
  //     }
  //   };
  //
  //   savePayPalInfo();
  // }, [
  //   accountStatus,
  //   consentStatus,
  //   isEmailConfirmed,
  //   merchantId,
  //   merchantIdInPayPal,
  //   permissionsGranted,
  //   productIntentId,
  //   router,
  //   selectedShop.ref_id,
  // ]);

  return (
    <DashboardLayout
      tabTitle="Dashboard - Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Group position="apart" mb={48}>
        <Title className="text-3xl" order={1}>
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

// export async function getServerSideProps(): Promise<{ props: { payPalAccessToken: string } }> {
//   const payPalUsername = process.env.PAYPAL_USERNAME;
//   const payPalPassword = process.env.PAYPAL_PASSWORD;
//
//   const res = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
//     method: 'post',
//     headers: {
//       Accept: 'application/json',
//       'Accept-Language': 'en_US',
//       Authorization: `Basic ${Buffer.from(`${payPalUsername}:${payPalPassword}`, 'utf8').toString('base64')}`,
//       'content-type': 'application/x-www-form-urlencoded',
//     },
//     body: 'grant_type=client_credentials',
//   });
//
//   const data = await res.json();
//
//   return {
//     props: {
//       payPalAccessToken: data.access_token,
//     },
//   };
// }

export default ProtectedRoute(Index);
