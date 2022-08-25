import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/future/image';
import Link from 'next/link';

import { useForm } from '@mantine/form';
import { TextInput, Title, Text, Button } from '@mantine/core';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import useAuth from '../contexts/AuthContext';
import AuthLayout from '../components/layouts/AuthLayout';

function Forgot(): JSX.Element {
  const router = useRouter();
  const { authError, forgotPassword, isAuthenticated, isProcessing } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const onSubmit = async (data: { email: string }): Promise<void> => {
    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha('forgot_password');
    await forgotPassword(data, token);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <AuthLayout
      pageTitle="Forgot Password - Enfront"
      metaDescription="Enfront takes ecommerce to the next level by offering a vast amount of innovative tools designed
      to simplify, optimize, and accelerate the process."
    >
      <div className="flex flex-col">
        <Link href="/" aria-label="Home" passHref>
          <Image src="/logo.png" width="135" height="40" alt="Enfront logo" />
        </Link>

        <div className="mt-8">
          <Title className="text-lg font-semibold text-gray-900" order={2}>
            Forgot your password?
          </Title>

          <Text className="mt-2 text-sm text-gray-700">
            Enter your email address and we will send you a link to reset your password.
          </Text>
        </div>
      </div>

      <form
        className="mt-10 grid grid-cols-1 gap-y-6"
        onSubmit={form.onSubmit((values: { email: string }) => onSubmit(values))}
      >
        {authError && (
          <Text className="flex justify-center text-center" color="red" size="sm" mb={6}>
            {authError}
          </Text>
        )}

        <TextInput label="Email address" placeholder="Email" type="email" required {...form.getInputProps('email')} />

        <Button className="w-full" variant="filled" radius="xl" type="submit" loading={isProcessing}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Forgot;
