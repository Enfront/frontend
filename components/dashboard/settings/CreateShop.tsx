import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Button, Drawer, Group, Select, SelectItem, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios, { AxiosError, AxiosResponse } from 'axios';

import useShop from '../../../contexts/ShopContext';
import utils from '../../../utils/utils';
import { Country, CreateShopFormData, Currency as EnfrontCurrency } from '../../../types/types';

interface CreateShopProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

function CreateShop({ isVisible, setIsVisible }: CreateShopProps): JSX.Element {
  const currencyList: EnfrontCurrency[] = [
    {
      value: 'EUR',
      label: 'Euro',
    },
    {
      value: 'GBP',
      label: 'Pound Sterling',
    },
    {
      value: 'USD',
      label: 'US Dollar',
    },
  ];

  const { getUserShops, setSelectedShopByIdOrData } = useShop();

  const [countryList, setCountryList] = useState<SelectItem[]>([]);
  const [createShopError, setCreateShopError] = useState<string>('');

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      domain: '',
      description: '',
      currency: '',
      country: 0,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const closeCreateShop = (): void => {
    setIsVisible(false);
    setCreateShopError('');
    form.reset();
  };

  const onSubmit = (data: CreateShopFormData): void => {
    let shopDomain: string;
    if (data.domain === '' || data.domain === undefined) {
      shopDomain = `${process.env.NEXT_PUBLIC_SITE_URL}/shop/${utils.slugify(data.name)}/`;
    } else {
      shopDomain = data.domain;
    }

    let shopEmail: string | undefined;
    if (data.email === '' || data.email === undefined) {
      shopEmail = undefined;
    } else {
      shopEmail = data.email;
    }

    const createShopFormData: CreateShopFormData = {
      description: data.description,
      currency: data.currency,
      country: data.country,
      domain: shopDomain,
      email: shopEmail,
      name: data.name,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/shops`, createShopFormData)
      .then((response: AxiosResponse) => {
        getUserShops();
        setSelectedShopByIdOrData(response.data.data);
        closeCreateShop();
      })
      .catch((error: AxiosError) => {
        setCreateShopError(error.response?.data.message);
      });
  };

  useEffect(() => {
    const getCountries = (): void => {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/countries`).then((response: AxiosResponse) => {
        response.data.data.forEach((country: Country) => {
          setCountryList((prev: SelectItem[]) => [...prev, { value: country.id.toString(), label: country.name }]);
        });
      });
    };

    getCountries();
  }, []);

  return (
    <Drawer
      opened={isVisible}
      onClose={() => setIsVisible(false)}
      title="Create New Shop"
      padding="xl"
      position="right"
      size={400}
    >
      <form onSubmit={form.onSubmit((values: CreateShopFormData) => onSubmit(values))}>
        <Stack>
          <Stack spacing="lg">
            <Text size="sm">Get started by filling in the information below.</Text>

            {createShopError !== '' && (
              <Text size="sm" color="red">
                {createShopError}
              </Text>
            )}

            <TextInput placeholder="Business Name" label="Business Name" required {...form.getInputProps('name')} />
            <TextInput placeholder="Business Email" label="Business Email" required {...form.getInputProps('email')} />

            <TextInput
              placeholder="Enfront Subdomain"
              label="Enfront Subdomain"
              value={`${process.env.NEXT_PUBLIC_URL_SCHEME}${utils.slugify(form.values.name)}.${
                process.env.NEXT_PUBLIC_THEME_URL
              }`}
              disabled
            />

            <Select
              label="Operating Country"
              placeholder="United States"
              nothingFound="No Country Found"
              data={countryList as SelectItem[]}
              searchable
              required
              {...form.getInputProps('country')}
            />

            <Select
              label="Currency"
              placeholder="US Dollar"
              nothingFound="No Currency Found"
              data={currencyList as SelectItem[]}
              searchable
              required
              {...form.getInputProps('currency')}
            />

            <Textarea
              placeholder="What do you do? What do you sell?"
              label="Describe Your Business"
              minRows={4}
              autosize
              required
              {...form.getInputProps('description')}
            />

            <Text color="dimmed" size="sm" mt={12}>
              By default, your shop will be created with a closed status meaning even users who visit your URL will be
              met with a closed status page. To change the status of your shop visit your shop settings.
            </Text>
          </Stack>

          <Group mt={24} grow>
            <Button onClick={() => setIsVisible(false)} variant="default">
              Cancel
            </Button>

            <Button type="submit">Create</Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}

export default CreateShop;
