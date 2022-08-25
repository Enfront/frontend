import { Dispatch, SetStateAction } from 'react';

import { Modal, Button, TextInput, Select } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { countryFinder } from 'jkshop-country-list';
import axios from 'axios';

import { BlacklistFormData, BlacklistOnSubmitData } from '../../../types/types';

interface CreateBlacklistItemProps {
  getBlackList: () => void;
  open: boolean;
  selectedShopRefId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function CreateBlacklistItem({
  getBlackList,
  open,
  selectedShopRefId,
  setOpen,
}: CreateBlacklistItemProps): JSX.Element {
  const form = useForm({
    initialValues: {
      type: '',
      value: '',
    },

    validate: {
      value: (value) => {
        switch (form.values.type) {
          case 'ip_address':
            return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
              value,
            )
              ? null
              : 'Invalid IP Address';
          case 'user':
            return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(value)
              ? null
              : 'Invalid user id';
          case 'country':
            return countryFinder.all().filter((country) => value === country.name) ? null : 'Invalid Country';
          case 'paypal_email':
            return /^\S+@\S+$/.test(value) ? null : 'Invalid email';
          default:
            break;
        }

        return 'Invalid blacklist type';
      },
    },
  });

  const onSubmit = (data: BlacklistOnSubmitData): void => {
    const formData: BlacklistFormData = {
      [data.type]: data.value,
      shop: selectedShopRefId,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/blacklists`, formData)
      .then(() => {
        getBlackList();
        setOpen(false);
        form.reset();

        showNotification({
          title: 'Success!',
          message: 'A blacklist item has been created.',
          color: 'green',
        });
      })
      .catch(() => {
        showNotification({
          title: 'Uh Oh!',
          message: 'There was an issue creating the blacklist item.',
          color: 'red',
        });
      });
  };

  return (
    <Modal opened={open} onClose={() => setOpen(false)} title="Create BlacklistItem Item" centered>
      <form onSubmit={form.onSubmit((values: BlacklistOnSubmitData) => onSubmit(values))}>
        <Select
          label="Type"
          placeholder="BlacklistItem type"
          data={[
            { value: 'ip_address', label: 'IP Address' },
            { value: 'country', label: 'Country' },
            { value: 'paypal_email', label: 'PayPal Email' },
            { value: 'user', label: 'User' },
          ]}
          required
          {...form.getInputProps('type')}
        />

        {form.values.type === 'country' && (
          <Select
            label="Country"
            placeholder="Country"
            nothingFound="No country found"
            data={countryFinder.all().map((country) => ({
              value: country.name,
              label: country.name,
            }))}
            mt={12}
            searchable
            required
            {...form.getInputProps('value')}
          />
        )}

        {form.values.type !== 'country' && (
          <TextInput
            placeholder="BlacklistItem value"
            label="Value"
            mt={12}
            required
            {...form.getInputProps('value')}
          />
        )}

        <Button type="submit" mt={24} fullWidth>
          Create Item
        </Button>
      </form>
    </Modal>
  );
}

export default CreateBlacklistItem;
