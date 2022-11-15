import { MutableRefObject, useEffect } from 'react';

import { Button, MultiSelect, SelectItem, Stack, TextInput } from '@mantine/core';
import { ModalsContextProps } from '@mantine/modals/lib/context';
import { useForm } from '@mantine/form';
import axios, { AxiosError } from 'axios';
import slugify from 'slugify';

import { Collection, CollectionData, ShopData } from '../../../types/types';
import utils from '../../../utils/utils';

interface EditCollectionProps {
  collection: Collection;
  getCollections: () => void;
  modals: ModalsContextProps;
  products: MutableRefObject<SelectItem[]>;
  selectedShop: ShopData;
}

function EditCollection({
  collection,
  getCollections,
  modals,
  products,
  selectedShop,
}: EditCollectionProps): JSX.Element {
  const form = useForm<CollectionData>({
    initialValues: {
      title: '',
      products: [],
    },
  });

  const editCollection = (data: CollectionData): void => {
    axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${collection.ref_id}`, {
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
        if (error.response?.status === 409) {
          form.setFieldError('slug', error.response?.data.message);
        }
      });
  };

  useEffect(() => {
    form.setFieldValue('title', collection.title);
    form.setFieldValue('slug', collection.slug);

    const productsArray: string[] = [];
    for (let i = 0; i < collection.products.length; i++) {
      productsArray.push(collection.products[i].ref_id);
    }

    form.setFieldValue('products', productsArray);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  return (
    <form onSubmit={form.onSubmit((values: CollectionData) => editCollection(values))}>
      <Stack>
        <TextInput placeholder="Title" label="Title" required {...form.getInputProps('title')} />

        <TextInput
          placeholder="URL"
          label="URL"
          value={form.values.title && `/${utils.slugify(form.values.title)}`}
          disabled
          required
        />

        <MultiSelect
          label="Products"
          placeholder="Products"
          data={products.current}
          searchable
          required
          {...form.getInputProps('products')}
        />

        <Button mt="md" type="submit" fullWidth>
          Edit Collection
        </Button>
      </Stack>
    </form>
  );
}

export default EditCollection;
