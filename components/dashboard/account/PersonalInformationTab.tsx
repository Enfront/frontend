import { useEffect } from 'react';

import { Button, Grid, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import axios from 'axios';

import useAuth from '../../../contexts/AuthContext';
import { PersonalInfoFormData } from '../../../types/types';

interface PersonalInformationTabProps {
  isDesktop: boolean;
}

function PersonalInformationTab({ isDesktop }: PersonalInformationTabProps): JSX.Element {
  const { userDetails } = useAuth();

  const form = useForm({
    initialValues: {
      firstName: userDetails.first_name,
      lastName: userDetails.last_name,
      email: userDetails.email,
      username: userDetails.username,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  useEffect(() => {
    form.setFieldValue('firstName', userDetails.first_name);
    form.setFieldValue('lastName', userDetails.last_name);
    form.setFieldValue('email', userDetails.email);
    form.setFieldValue('username', userDetails.username);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const onSubmit = (values: PersonalInfoFormData) => {
    axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/users`, values)
      .then(() => {
        showNotification({
          title: 'Settings Saved!',
          message: 'Your personal information has been saved.',
          color: 'green',
        });
      })
      .catch(() => {
        showNotification({
          title: 'Uh Oh!',
          message: 'This username or email has already been taken.',
          color: 'red',
        });
      });
  };

  return (
    <form onSubmit={form.onSubmit((values: PersonalInfoFormData) => onSubmit(values))}>
      <Grid justify="flex-end">
        <Grid.Col span={12} md={6}>
          <TextInput label="First Name" placeholder="John" required disabled {...form.getInputProps('firstName')} />
        </Grid.Col>

        <Grid.Col span={12} md={6}>
          <TextInput label="Last Name" placeholder="Doe" required disabled {...form.getInputProps('lastName')} />
        </Grid.Col>

        <Grid.Col span={12} md={6}>
          <TextInput label="Username" placeholder="Username" required {...form.getInputProps('username')} />
        </Grid.Col>

        <Grid.Col span={12} md={6}>
          <TextInput label="Email" placeholder="Email" required {...form.getInputProps('email')} />
        </Grid.Col>

        <Grid.Col className="flex justify-end" span={12}>
          <Button type="submit" fullWidth={!isDesktop}>
            Save Personal Info
          </Button>
        </Grid.Col>
      </Grid>
    </form>
  );
}

export default PersonalInformationTab;
