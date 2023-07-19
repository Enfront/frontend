import { useState } from 'react';

import { Button, Grid, Text, Title } from '@mantine/core';
import { useShallowEffect } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import axios, { AxiosResponse } from 'axios';

import TwoFactorModal from '&/components/dashboard/account/TwoFactorModal';
import useAuth from '&/contexts/AuthContext';
import { TwoFactor } from '&/types/types';

interface SecurityTabProps {
  isDesktop: boolean;
}

function SecurityTab({ isDesktop }: SecurityTabProps): JSX.Element {
  const modals = useModals();
  const { userDetails } = useAuth();

  const [usesAppTwoFactor, setUsesAppTwoFactor] = useState<boolean>(false);

  const checkTwoFactorMethods = async (): Promise<void> => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/mfa/user-active-methods/`)
      .then((response: AxiosResponse) => {
        setUsesAppTwoFactor(response.data.results.some((method: TwoFactor) => method.name === 'app'));
      });
  };

  const sendCode = async (): Promise<void> => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/code/request/`, {
      method: 'email',
    });
  };

  const openTwoFactorModal = (disable = false): void => {
    sendCode();

    modals.openModal({
      title: 'Two-Factor Authentication',
      centered: true,
      children: (
        <TwoFactorModal
          checkTwoFactorMethods={checkTwoFactorMethods}
          disable={disable}
          email={userDetails.email}
          modals={modals}
        />
      ),
    });
  };

  useShallowEffect(() => {
    checkTwoFactorMethods();
  }, []);

  return (
    <Grid align="center" justify="end" mt={24}>
      <Grid.Col span={12} md={8}>
        <Title className="text-lg" order={2}>
          Implement Two-Factor Authentication
        </Title>

        <Text size="sm">Use the Google Authenticator App or likewise to get a one time code.</Text>
      </Grid.Col>

      <Grid.Col className="flex justify-end" span={12} md={4}>
        {usesAppTwoFactor ? (
          <Button onClick={() => openTwoFactorModal(true)} fullWidth={!isDesktop}>
            Disable
          </Button>
        ) : (
          <Button onClick={() => openTwoFactorModal()} fullWidth={!isDesktop}>
            Enable
          </Button>
        )}
      </Grid.Col>
    </Grid>
  );
}

export default SecurityTab;
