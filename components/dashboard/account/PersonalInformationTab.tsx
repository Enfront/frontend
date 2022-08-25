import { useEffect } from 'react';

import { Button, Group, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import axios from 'axios';

import useAuth from '../../../contexts/AuthContext';
import { PersonalInfoFormData } from '../../../types/types';

function PersonalInformationTab(): JSX.Element {
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
      <Group className="items-start" mt={24} grow>
        <TextInput label="First Name" placeholder="John" required disabled {...form.getInputProps('firstName')} />
        <TextInput label="Last Name" placeholder="Doe" required disabled {...form.getInputProps('lastName')} />
      </Group>

      <Group className="items-start" mt={24} grow>
        <TextInput label="Username" placeholder="Username" required {...form.getInputProps('username')} />
        <TextInput label="Email" placeholder="Email" required {...form.getInputProps('email')} />
      </Group>

      <div className="flex justify-end">
        <Button mt={24} type="submit">
          Save Personal Info
        </Button>
      </div>
    </form>
  );
}

export default PersonalInformationTab;
