import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Grid, Group, NumberInput, Select, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import axios, { AxiosError, AxiosResponse } from 'axios';

import DigitalKeys from '&/components/dashboard/products/DigitalKeys';
import GeneralInformation from '&/components/dashboard/products/GeneralInformation';
import Images from '&/components/dashboard/products/Images';
import DashboardLayout from '&/components/layouts/DashboardLayout';
import { ProtectedRoute } from '&/contexts/AuthContext';
import useShop from '&/contexts/ShopContext';
import { ImageType, Item, Product, ProductFormData } from '&/types/types';

function Index(): JSX.Element {
  const router = useRouter();
  const modals = useModals();
  const theme = useMantineTheme();

  const initialProduct: Product = {
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
  const [viewedProduct, setViewedProduct] = useState<Product>(initialProduct);
  const [shownItems, setShownItems] = useState<Item[]>([]);
  const [description, setDescription] = useState<string>('');
  const [disableVisibilityToggle, setDisableVisibilityToggle] = useState<boolean>(false);

  const form = useForm<ProductFormData>({
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
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${viewedProduct.ref_id}`)
      .then(() => {
        router.push('/dashboard/products');
      })
      .catch((error: AxiosError) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  const checkProductStatus = (product: Product): void => {
    // Product is out of stock and not visible
    if (product.status === -2 || product.stock === 0) {
      setDisableVisibilityToggle(true);
    }

    form.setFieldValue('status', product.status.toString());

    // Allow user to change visibility after adding digital items
    if (disableVisibilityToggle && product.stock > 0) {
      setDisableVisibilityToggle(false);
    }

    // Product is out of stock and visible, so we disable it
    if (product.stock === 0 && product.status === 1) {
      const newStatusProduct: ProductFormData = {
        name: product.name,
        description: product.description,
        shop: selectedShop.ref_id,
        status: '-2',
        price: product.price,
      };

      onSubmit(newStatusProduct);
    }
  };

  const getViewedProduct = async (): Promise<void> => {
    if (productId && productId !== 'new') {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
        .then((response: AxiosResponse) => {
          setViewedProduct(response.data.data);
          setDescription(response.data.data.description);
          setShownItems(response.data.data.keys);

          form.setFieldValue('name', response.data.data.name);
          form.setFieldValue('price', +response.data.data.price / 100);
          form.setFieldValue('min_order_quantity', response.data.data.min_order_quantity);
          form.setFieldValue('max_order_quantity', response.data.data.max_order_quantity);

          checkProductStatus(response.data.data);
        })
        .catch(() => {
          router.push('/dashboard/products');

          showNotification({
            title: 'Product Not Found',
            message: 'There was an issue trying to find the product you were looking for.',
            color: 'red',
          });
        });
    } else {
      // Product is new so we turn visibility toggle off
      setDisableVisibilityToggle(true);
    }
  };

  const onSubmit = async (data: ProductFormData): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append('name', data.name);
    formData.append('description', description);
    formData.append('type', '0');
    formData.append('price', Math.round(data.price * 100).toString());
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
          getViewedProduct();
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
        .put(`${process.env.NEXT_PUBLIC_API_URL}/products/${viewedProduct.ref_id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response: AxiosResponse) => {
          if (response.status === 200) {
            form.reset();
            getViewedProduct();
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
    getViewedProduct();

    return () => {
      setViewedProduct(initialProduct);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return (
    <DashboardLayout
      tabTitle="Product Details | Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <form onSubmit={form.onSubmit((values: ProductFormData) => onSubmit(values))}>
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
                {viewedProduct.name ? viewedProduct.name : 'New Product'}
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
                Items
              </Title>

              <DigitalKeys form={form} getViewedProduct={getViewedProduct} shownKeys={shownItems} />
            </Stack>

            <Stack py={32}>
              <Title className="text-xl" order={2}>
                Images
              </Title>

              <Images
                getViewedProduct={getViewedProduct}
                images={images}
                setImages={setImages}
                viewedProduct={viewedProduct}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={3} pl={32}>
            <Title className="text-xl" order={2}>
              Specifications
            </Title>

            <Select
              label="Status"
              placeholder="Statuses"
              disabled={productId === 'new' || viewedProduct.stock === 0}
              error={viewedProduct.stock === 0 && 'Disabled due to stock levels.'}
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
