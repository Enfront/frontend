import { MutableRefObject } from 'react';

import { Button, MultiSelect, SelectItem, Stack, TextInput } from '@mantine/core';
import { ModalsContextProps } from '@mantine/modals/lib/context';
import { useForm } from '@mantine/form';
import axios, { AxiosError } from 'axios';
import slugify from 'slugify';

import { CollectionData, ShopData } from '../../../types/types';
import utils from '../../../utils/utils';

interface CreateCollectionProps {
  getCollections: () => void;
  modals: ModalsContextProps;
  products: MutableRefObject<SelectItem[]>;
  selectedShop: ShopData;
}

const CreateCollection = ({ getCollections, modals, products, selectedShop }: CreateCollectionProps): JSX.Element => {
  const form = useForm<CollectionData>({
    initialValues: {
      title: '',
      products: [],
    },
  });

  const createCollection = (data: CollectionData): void => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
        shop: selectedShop.ref_id,
        title: data.title,
        slug: slugify(data.title as string, { lower: true }),
        products: data.products,
      })
      .then(() => {
        getCollections();
        modals.closeAll();
      })
      .catch((error: AxiosError) => {
        form.setFieldError('slug', error.response?.data.message);
      });
  };

  return (
    <form onSubmit={form.onSubmit((values: CollectionData) => createCollection(values))}>
      <Stack>
        <TextInput placeholder="Title" label="Title" required {...form.getInputProps('title')} />
        <TextInput placeholder="URL" label="URL" value={`/${utils.slugify(form.values.title)}`} disabled required />

        <MultiSelect
          label="Products"
          placeholder="Products"
          data={products.current}
          searchable
          required
          {...form.getInputProps('products')}
        />

        <Button mt="md" type="submit" fullWidth>
          Create Collection
        </Button>
      </Stack>
    </form>
  );
};

export default CreateCollection;
