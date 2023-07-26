import { useRef, useState } from 'react';
import Image from 'next/image';

import { Button, Flex, Group, Input, PinInput, Text, TextInput, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { ModalsContextProps } from '@mantine/modals/lib/context';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface TwoFactorModalProps {
  checkTwoFactorMethods: () => void;
  disable: boolean;
  email: string;
  modals: ModalsContextProps;
}

function TwoFactorModal({ checkTwoFactorMethods, disable, email, modals }: TwoFactorModalProps): JSX.Element {
  const qrCode = useRef<string>();
  const clipboard = useClipboard();

  const [step, setStep] = useState<number>(1);
  const [code, setCode] = useState<string>('');
  const [confirmError, setConfirmError] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>(['']);

  const confirmUser = (): void => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/two-factor/validate`, { code })
      .then(() => {
        activateTwoFactor();
        setCode('');
        setConfirmError('');
      })
      .catch((error: AxiosError) => {
        setConfirmError(error?.response?.data[0]);
      });
  };

  const activateTwoFactor = async (): Promise<void> => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/app/activate/`).then((response: AxiosResponse) => {
      qrCode.current = response.data.details;
      setStep(2);
    });
  };

  const confirmTwoFactorCode = (): void => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/app/activate/confirm/`, { code })
      .then((response: AxiosResponse) => {
        checkTwoFactorMethods();
        setStep(3);
        setBackupCodes(response.data.backup_codes);
      })
      .catch((error: AxiosError) => {
        setConfirmError(error?.response?.data.code[0]);
      });
  };

  const disableTwoFactor = async (): Promise<void> => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/app/deactivate/`, { code })
      .then(() => {
        setConfirmError('');
        checkTwoFactorMethods();
        modals.closeAll();
      })
      .catch((error: AxiosError) => {
        setConfirmError(error?.response?.data.code[0]);
      });
  };

  return (
    <>
      {!disable && step === 1 && (
        <>
          <Text size="sm" weight={600} mb={4}>
            We need to know it&apos;s you before you can proceed.
          </Text>

          <Text size="sm" color="gray">
            We have sent an email to{' '}
            <Text weight={600} component="span">
              {email}
            </Text>{' '}
            with a 6-digit code. Please enter it below to continue.
          </Text>

          <TextInput
            label="Verification Code"
            placeholder="Verification Code"
            error={confirmError}
            value={code}
            onChange={(event) => setCode(event.currentTarget.value)}
            minLength={6}
            maxLength={6}
            mt={16}
          />

          <Button onClick={() => confirmUser()} disabled={code.length !== 6} mt={16} fullWidth>
            Next
          </Button>
        </>
      )}

      {!disable && step === 2 && (
        <>
          <Text size="sm" weight={600} mb={4}>
            Set up two-factor authentication.
          </Text>

          <Text size="sm" color="gray">
            To be able to login to your account, you will need to scan this QR code with your Google Authenticator app
            or likewise and enter the verification code below.
          </Text>

          <Flex align="center" justify="center" mt="md" sx={{ border: '1px solid lightgray', borderRadius: 3 }} p={32}>
            <Image
              src={`https://chart.googleapis.com/chart?cht=qr&chs=150x150&chld=L|0&chl=${qrCode.current}`}
              layout="intrinsic"
              height="150"
              width="150"
              alt="Two-factor authentication setup QR."
            />
          </Flex>

          <Input.Wrapper label="Verification code" error={confirmError} mt="md" pb="md">
            <PinInput
              className="justify-between"
              onChange={(event: string) => setCode(event)}
              value={code}
              length={6}
              type="number"
              error={!!confirmError}
              size="lg"
              oneTimeCode
            />
          </Input.Wrapper>

          <Button onClick={() => confirmTwoFactorCode()} disabled={code.length !== 6} fullWidth>
            Next
          </Button>
        </>
      )}

      {!disable && step === 3 && (
        <>
          <Text size="sm" weight={600} mb={4}>
            Two-factor app authentication has been enabled.
          </Text>

          <Text size="sm" color="gray">
            This code is extremely sensitive{' '}
            <Text size="sm" color="red" component="span">
              and will only be shown once.
            </Text>{' '}
            Treat it like a password, and do not share it with anyone. Backup codes should only be used by you to
            recover your account. Write it down and keep it somewhere safe.
          </Text>

          <Group position="center" mt={16}>
            {backupCodes.map((backupCode: string) => (
              <Tooltip
                label="Backup code copied!"
                offset={5}
                position="bottom"
                radius="xl"
                transitionProps={{ duration: 100, transition: 'slide-down' }}
                opened={clipboard.copied}
                key={backupCode}
              >
                <Button
                  onClick={() => clipboard.copy(backupCode)}
                  color="gray"
                  variant="light"
                  rightIcon={
                    clipboard.copied ? <IconCheck size={20} stroke={1.5} /> : <IconCopy size={20} stroke={1.5} />
                  }
                  styles={{
                    root: { paddingRight: 14, height: 48 },
                    rightIcon: { marginLeft: 22 },
                  }}
                  fullWidth
                >
                  {backupCode}
                </Button>
              </Tooltip>
            ))}
          </Group>
        </>
      )}

      {!disable && (
        <div className="mt-6 flex w-full items-center justify-center">
          <span className={`mr-2 block h-1.5 w-1.5 rounded-full ${step === 1 ? 'bg-gray-800' : 'bg-gray-400'}`} />
          <span className={`mr-2 block h-1.5 w-1.5 rounded-full ${step === 2 ? 'bg-gray-800' : 'bg-gray-400'}`} />
          <span className={`mr-2 block h-1.5 w-1.5 rounded-full ${step === 3 ? 'bg-gray-800' : 'bg-gray-400'}`} />
        </div>
      )}

      {disable && (
        <>
          <Text size="sm" weight={600} mb={4}>
            Disable two-factor authentication.
          </Text>

          <Text size="sm" color="gray">
            To disable two-factor authentication, please enter the verification code from your authenticator app.
          </Text>

          <Input.Wrapper label="Verification code" error={confirmError} mt="md" pb="md">
            <PinInput
              className="justify-between"
              onChange={(event: string) => setCode(event)}
              value={code}
              length={6}
              type="number"
              error={!!confirmError}
              size="lg"
              oneTimeCode
            />
          </Input.Wrapper>

          <Button onClick={() => disableTwoFactor()} disabled={code.length !== 6} fullWidth>
            Disable
          </Button>
        </>
      )}
    </>
  );
}

export default TwoFactorModal;
