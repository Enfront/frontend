import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/future/image';

import { useForm } from '@mantine/form';
import { Title, Text, Button, PasswordInput } from '@mantine/core';

import { ResetPasswordData } from '../types/types';
import useAuth from '../contexts/AuthContext';
import AuthLayout from '../components/layouts/AuthLayout';

function Reset(): JSX.Element {
  const router = useRouter();
  const { authError, isAuthenticated, isProcessing, resetPassword } = useAuth();

  const form = useForm({
    initialValues: {
      password: '',
      passwordConfirmation: '',
    },

    validate: (values) => ({
      passwordConfirmation: values.password === values.passwordConfirmation ? null : 'Passwords must match',
    }),
  });

  const onSubmit = async (data: ResetPasswordData): Promise<void> => {
    if (!router.query.ref_id && !router.query.token) {
      return;
    }

    const resetPasswordData: ResetPasswordData = {
      ref_id: router.query.ref_id as string,
      token: router.query.token as string,
      ...data,
    };

    await resetPassword(resetPasswordData);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router.query]);

  return (
    <AuthLayout
      pageTitle="Reset Password | Enfront"
      metaDescription="Enfront takes e-commerce to the next level by offering a vast amount of innovative tools designed
      to simplify, optimize, and accelerate the process."
    >
      <div className="flex flex-col">
        <Link href="/" aria-label="Home" passHref>
          <Image src="/logo.png" width="135" height="40" alt="Enfront logo" />
        </Link>

        <div className="mt-8">
          <Title className="text-lg font-semibold text-gray-900" order={2}>
            Reset Your Password
          </Title>

          <Text className="mt-2 text-sm text-gray-700">Enter your new password below to reset it.</Text>
        </div>
      </div>

      <form
        className="mt-10 grid grid-cols-1 gap-y-6"
        onSubmit={form.onSubmit((values: ResetPasswordData) => onSubmit(values))}
      >
        {authError && (
          <Text className="flex justify-center text-center" color="red" size="sm" mb={6}>
            {authError}
          </Text>
        )}

        <PasswordInput label="New Password" placeholder="New Password" required {...form.getInputProps('password')} />

        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm New Password"
          required
          {...form.getInputProps('passwordConfirmation')}
        />

        <Button
          className="w-full"
          variant="filled"
          radius="xl"
          type="submit"
          loading={isProcessing}
          disabled={!router.query.ref_id && !router.query.token}
        >
          Change Password
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Reset;
