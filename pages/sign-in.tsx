import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Anchor, Button, Flex, Input, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import OtpInput from 'react-otp-input';

import AuthLayout from '&/components/layouts/AuthLayout';
import useAuth from '&/contexts/AuthContext';
import { LoginData } from '&/types/types';

function SignIn(): JSX.Element {
  const router = useRouter();

  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    authError,
    checkTwoFactor,
    disableTwoFactor,
    isAuthenticated,
    isProcessing,
    login,
    needsVerification,
    resetTwoFactor,
    setResetTwoFactor,
  } = useAuth();

  const [twoFactorCode, setTwoFactorCode] = useState<string>('');
  const [backupCode, setBackupCode] = useState<string>('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const onSubmit = async (data: LoginData): Promise<void> => {
    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha('login');
    await login(data, token);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <AuthLayout
      pageTitle="Sign In | Enfront"
      metaDescription="Enfront takes e-commerce to the next level by offering a vast amount of innovative tools designed
      to simplify, optimize, and accelerate the process."
    >
      {!needsVerification && !resetTwoFactor && (
        <>
          <Flex align="center" direction="column" justify="center" mb="xl">
            <Title order={1} size="h2" mt="sm">
              Sign in to your account
            </Title>

            <Text color="gray" size="sm" mt="sm">
              Don’t have an account?{' '}
              <Link href="/register" passHref>
                <Anchor component="a" size="sm">
                  Sign up
                </Anchor>
              </Link>
            </Text>
          </Flex>

          <form onSubmit={form.onSubmit((values: LoginData) => onSubmit(values))}>
            {authError && (
              <Text className="flex justify-center text-center" color="red" size="sm" mb={6}>
                {authError}
              </Text>
            )}

            <TextInput
              label="Email address"
              placeholder="Email"
              type="email"
              mb="md"
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Password"
              mb="md"
              required
              {...form.getInputProps('password')}
            />

            <Stack>
              <Button variant="filled" type="submit" loading={isProcessing} fullWidth>
                Sign in{' '}
                <span className="ml-2" aria-hidden="true">
                  &rarr;
                </span>
              </Button>

              <Link href="/forgot" passHref>
                <Anchor className="m-auto" component="a" size="sm">
                  Forgot password
                </Anchor>
              </Link>
            </Stack>
          </form>
        </>
      )}

      {needsVerification && !resetTwoFactor && (
        <>
          <Title align="center" size="h3" order={1}>
            Two-Factor Authentication
          </Title>

          <Text align="center" size="sm" color="gray" mt="sm" mb="xl">
            Thanks for keeping your account secure. Please enter the verification code from the authentication app
            chosen during setup.
          </Text>

          <Input.Wrapper error={authError}>
            <OtpInput
              onChange={(value: string) => setTwoFactorCode(value)}
              value={twoFactorCode}
              numInputs={6}
              inputStyle="two-factor"
              containerStyle="two-factor-container"
              errorStyle="error"
              hasErrored={!!authError}
              isInputNum
            />
          </Input.Wrapper>

          <Button
            onClick={() => checkTwoFactor(twoFactorCode)}
            variant="filled"
            type="submit"
            loading={isProcessing}
            mt="xs"
            fullWidth
          >
            Confirm
          </Button>

          <Anchor onClick={() => setResetTwoFactor(true)} component="button" size="sm" mx="auto" mt="sm" w="100%">
            Reset Two-Factor Authentication
          </Anchor>
        </>
      )}

      {resetTwoFactor && (
        <>
          <Title align="center" size="h3" order={1}>
            Disable Two-Factor Authentication
          </Title>

          <Text align="center" size="sm" color="gray" mt="sm" mb="xl">
            Please enter the backup code provided during setup.
          </Text>

          <TextInput
            label="Backup Code"
            placeholder="Backup Code"
            value={backupCode}
            onChange={(event) => setBackupCode(event.currentTarget.value)}
            error={authError}
          />

          <Button
            onClick={() => disableTwoFactor(backupCode)}
            variant="filled"
            type="submit"
            loading={isProcessing}
            mt="xs"
            fullWidth
          >
            Confirm
          </Button>
        </>
      )}
    </AuthLayout>
  );
}

export default SignIn;
