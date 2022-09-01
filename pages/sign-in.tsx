import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/future/image';
import Link from 'next/link';

import { Anchor, TextInput, PasswordInput, Title, Text, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import { LoginData } from '../types/types';
import useAuth from '../contexts/AuthContext';
import AuthLayout from '../components/layouts/AuthLayout';

function SignIn(): JSX.Element {
  const router = useRouter();
  const { authError, isAuthenticated, isProcessing, login } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();

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
      pageTitle="Sign In - Enfront"
      metaDescription="Enfront takes ecommerce to the next level by offering a vast amount of innovative tools designed
      to simplify, optimize, and accelerate the process."
    >
      <div className="flex flex-col">
        <Link href="/" aria-label="Home" passHref>
          <Image src="/logo.png" width="135" height="40" alt="Enfront logo" />
        </Link>

        <div className="mt-8">
          <Title className="text-lg font-semibold text-gray-900" order={2}>
            Sign in to your account
          </Title>

          <Text className="mt-2 text-sm text-gray-700">
            Don’t have an account?{' '}
            <Link href="/register" passHref>
              <Anchor component="a" size="sm">
                Sign up
              </Anchor>
            </Link>
          </Text>
        </div>
      </div>

      <form
        className="mt-10 grid grid-cols-1 gap-y-6"
        onSubmit={form.onSubmit((values: LoginData) => onSubmit(values))}
      >
        {authError && (
          <Text className="flex justify-center text-center" color="red" size="sm" mb={6}>
            {authError}
          </Text>
        )}

        <TextInput label="Email address" placeholder="Email" type="email" required {...form.getInputProps('email')} />
        <PasswordInput label="Password" placeholder="Password" required {...form.getInputProps('password')} />

        <Stack>
          <Button className="w-full" variant="filled" radius="xl" type="submit" loading={isProcessing}>
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
    </AuthLayout>
  );
}

export default SignIn;
