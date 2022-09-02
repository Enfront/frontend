import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, Grid, Group, NumberInput, Select, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useModals } from '@mantine/modals';
import { useForm } from '@mantine/form';

import { ProtectedRoute } from '../../../contexts/AuthContext';
import useShop from '../../../contexts/ShopContext';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import GeneralInformation from '../../../components/dashboard/products/GeneralInformation';
import DigitalKeys from '../../../components/dashboard/products/DigitalKeys';
import Images from '../../../components/dashboard/products/Images';
import { ImageType, Item, ItemFormData, ItemKey } from '../../../types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const modals = useModals();
  const theme = useMantineTheme();

  const initialItem: Item = {
    description: '',
    images: [],
    keys: [],
    name: '',
    price: 0,
    ref_id: '',
    slug: '',
    status: 0,
    stock: 0,
  };

  const { selectedShop } = useShop();
  const { productId } = router.query;

  const [images, setImages] = useState<ImageType[]>([]);
  const [viewedItem, setViewedItem] = useState<Item>(initialItem);
  const [shownKeys, setShownKeys] = useState<ItemKey[]>([]);
  const [description, setDescription] = useState<string>('');
  const [disableVisibilityToggle, setDisableVisibilityToggle] = useState<boolean>(false);

  const form = useForm<ItemFormData>({
    initialValues: {
      name: '',
      price: 0,
      keys: '',
      status: '0',
      min_order_quantity: undefined,
      max_order_quantity: undefined,
    },
  });

  const openDeleteModal = (): void => {
    modals.openConfirmModal({
      title: 'Delete Product',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this product? All of your data in relation to this product will be permanently
          removed from your dashboard. This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteProduct(),
    });
  };

  const deleteProduct = (): void => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${viewedItem.ref_id}`)
      .then(() => {
        router.push('/dashboard/products');
      })
      .catch((error: AxiosError) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  const checkItemStatus = (item: Item): void => {
    // Item is out of stock and not visible
    if (item.status === -2 || item.stock === 0) {
      setDisableVisibilityToggle(true);
    }

    form.setFieldValue('status', item.status.toString());

    // Allow user to change visibility after adding keys
    if (disableVisibilityToggle && item.stock > 0) {
      setDisableVisibilityToggle(false);
    }

    // Item is out of stock and visible, so we disable it
    if (item.stock === 0 && item.status === 1) {
      const newStatusItem: ItemFormData = {
        name: item.name,
        description: item.description,
        shop: selectedShop.ref_id,
        status: '-2',
        price: item.price,
      };

      onSubmit(newStatusItem);
    }
  };

  const getViewedItem = async (): Promise<void> => {
    if (productId && productId !== 'new') {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
        .then((response: AxiosResponse) => {
          setViewedItem(response.data.data);
          setDescription(response.data.data.description);
          setShownKeys(response.data.data.keys);

          form.setFieldValue('name', response.data.data.name);
          form.setFieldValue('price', +response.data.data.price / 100);
          form.setFieldValue('min_order_quantity', response.data.data.min_order_quantity);
          form.setFieldValue('max_order_quantity', response.data.data.max_order_quantity);

          checkItemStatus(response.data.data);
        })
        .catch(() => {
          router.push('/dashboard/products');
        });
    } else {
      // Item is new so we turn visibility toggle off
      setDisableVisibilityToggle(true);
    }
  };

  const onSubmit = async (data: ItemFormData): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append('name', data.name);
    formData.append('description', description);
    formData.append('type', '0');
    formData.append('price', (data.price * 100).toString());
    formData.append('status', data.status);

    if (data.min_order_quantity) {
      formData.append('min_order_quantity', data.min_order_quantity.toString());
    }

    if (data.max_order_quantity) {
      formData.append('max_order_quantity', data.max_order_quantity.toString());
    }

    if (selectedShop.ref_id !== '') {
      formData.append('shop', selectedShop.ref_id);
    }

    if (data.keys) {
      formData.append('keys', data.keys);
    }

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i].file as Blob, images[i].file?.name);
    }

    if (productId === 'new') {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/products`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response: AxiosResponse) => {
          getViewedItem();
          setImages([]);
          form.reset();

          router.push(`/dashboard/products/${response.data.data.ref_id}`);

          showNotification({
            title: 'Product Saved',
            message: 'Your product has been successfully saved.',
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
    } else {
      await axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/products/${viewedItem.ref_id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            form.reset();
            getViewedItem();
            setImages([]);

            showNotification({
              title: 'Product Saved',
              message: 'Your product has been successfully saved.',
              color: 'green',
            });
          }
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
    }
  };

  useEffect(() => {
    getViewedItem();

    return () => {
      setViewedItem(initialItem);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return (
    <DashboardLayout
      tabTitle="Dashboard - Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <form onSubmit={form.onSubmit((values: ItemFormData) => onSubmit(values))}>
        <Grid
          className={`${
            theme.colorScheme === 'dark' ? 'divide-[#373A40]' : 'divide-[#dee2e6]'
          } divide-x divide-y-0 divide-solid`}
        >
          <Grid.Col
            className={`${
              theme.colorScheme === 'dark' ? 'divide-[#373A40]' : 'divide-[#dee2e6]'
            } divide-x-0 divide-y divide-solid`}
            span={9}
            pr={32}
          >
            <Group position="apart" mb={32} noWrap>
              <Title className="truncate text-2xl" order={1}>
                {viewedItem.name ? viewedItem.name : 'New Product'}
              </Title>

              <Group noWrap>
                <Button onClick={openDeleteModal} variant="outline" color="red">
                  Delete Product
                </Button>

                <Button type="submit">Save Product</Button>
              </Group>
            </Group>

            <Stack py={32}>
              <Title className="text-xl" order={2}>
                General Information
              </Title>

              <GeneralInformation
                description={description}
                form={form}
                setDescription={setDescription}
                shopCurrency={selectedShop.currency}
              />
            </Stack>

            <Stack py={32}>
              <Title className="text-xl" order={2}>
                Digital Keys
              </Title>

              <DigitalKeys form={form} getViewedItem={getViewedItem} shownKeys={shownKeys} />
            </Stack>

            <Stack py={32}>
              <Title className="text-xl" order={2}>
                Product Images
              </Title>

              <Images getViewedItem={getViewedItem} images={images} setImages={setImages} viewedItem={viewedItem} />
            </Stack>
          </Grid.Col>

          <Grid.Col span={3} pl={32}>
            <Title className="text-xl" order={2}>
              Specifications
            </Title>

            <Select
              label="Status"
              placeholder="Statuses"
              disabled={productId === 'new' || viewedItem.stock === 0}
              error={viewedItem.stock === 0 && 'Disabled due to stock levels.'}
              mt={16}
              required
              data={[
                { value: '1', label: 'Visible' },
                { value: '0', label: 'Hidden' },
                { value: '-2', label: 'Out of Stock' },
              ]}
              {...form.getInputProps('status')}
            />

            <NumberInput
              label="Minimum Order Quantity"
              min={1}
              max={2147483647}
              mt={8}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              {...form.getInputProps('min_order_quantity')}
            />

            <NumberInput
              label="Maximum Order Quantity"
              min={1}
              max={2147483647}
              mt={8}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              {...form.getInputProps('max_order_quantity')}
            />
          </Grid.Col>
        </Grid>
      </form>
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
