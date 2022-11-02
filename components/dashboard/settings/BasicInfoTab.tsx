import { useEffect } from 'react';

import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { Button, Group, Select, Text, TextInput } from '@mantine/core';
import axios, { AxiosError } from 'axios';

import useShop from '../../../contexts/ShopContext';
import utils from '../../../utils/utils';
import { ShopSettingsFormData, ShopStatus } from '../../../types/types';

function BasicInfoTab(): JSX.Element {
  const modals = useModals();

  const statusOptions: ShopStatus[] = [
    {
      value: '0',
      label: 'Closed',
    },
    {
      value: '1',
      label: 'Open',
    },
  ];

  const { getUserShops, selectedShop } = useShop();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      domain: '',
      status: '0',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const checkNameChange = (data: ShopSettingsFormData): void => {
    if (data.name !== selectedShop.name) {
      openConfirmModal(data);
    } else {
      onSubmit(data);
    }
  };

  const openConfirmModal = (data: ShopSettingsFormData): void => {
    modals.openConfirmModal({
      title: 'Change Shop Domain',
      children: (
        <Text size="sm">
          Changing the name of your shop will also change the domain name of your shop. Be sure your customers are aware
          of the new domain name or they will reach a 404 page.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'yellow' },
      onConfirm: () => onSubmit(data),
    });
  };

  const onSubmit = (data: ShopSettingsFormData): void => {
    let shopDomain: string;
    if (data.domain === '' || data.domain === undefined) {
      shopDomain = `${utils.slugify(data.name)}.${process.env.NEXT_PUBLIC_THEME_URL}`;
    } else {
      shopDomain = data.domain;
    }

    const formData: ShopSettingsFormData = {
      name: data.name,
      email: data.email,
      status: data.status,
      domain: shopDomain,
    };

    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/shops/${selectedShop.ref_id}`, formData)
      .then(() => {
        getUserShops();

        showNotification({
          title: 'Settings Saved!',
          message: 'Your general settings have been saved.',
          color: 'green',
        });
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 401 || error.response?.status === 409) {
          showNotification({
            title: 'Uh Oh!',
            message: error.response.data.message,
            color: 'red',
          });
        }
      });
  };

  useEffect(() => {
    form.setFieldValue('name', selectedShop.name);
    form.setFieldValue('email', selectedShop.email);

    if (selectedShop.status === 0) {
      form.setFieldValue('status', '0');
    }

    if (selectedShop.status === 1) {
      form.setFieldValue('status', '1');
    }

    if (selectedShop.status === 2) {
      form.setFieldValue('status', '2');
    }

    return () => {
      form.reset();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShop]);

  return (
    <>
      <form onSubmit={form.onSubmit((values: ShopSettingsFormData) => checkNameChange(values))}>
        <Group className="items-start" mt={24} grow>
          <TextInput label="Shop Name" placeholder="Shop Name" required {...form.getInputProps('name')} />
          <TextInput label="Business Email" placeholder="Business Email" required {...form.getInputProps('email')} />
        </Group>

        <Group mt={24} grow>
          <a
            className="no-underline"
            href={`${process.env.NEXT_PUBLIC_URL_SCHEME}${selectedShop.domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TextInput
              label="Domain"
              placeholder="Domain"
              value={`${process.env.NEXT_PUBLIC_URL_SCHEME}${selectedShop.domain}`}
              disabled
              required
            />
          </a>

          <Select label="Status" placeholder="Status" data={statusOptions} {...form.getInputProps('status')} />
        </Group>

        <div className="flex justify-end">
          <Button mt={24} type="submit">
            Save General Info
          </Button>
        </div>
      </form>
    </>
  );
}

export default BasicInfoTab;
