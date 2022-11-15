import { useEffect, useRef, useState } from 'react';

import { Button, Flex, SelectItem, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import axios, { AxiosResponse } from 'axios';

import DashboardLayout from '../../../components/layouts/DashboardLayout';
import CollectionList from '../../../components/dashboard/collections/CollectionList';
import EmptyMessage from '../../../components/dashboard/EmptyMessage';
import CreateCollection from '../../../components/dashboard/collections/CreateCollection';
import useShop from '../../../contexts/ShopContext';
import { Collection } from '../../../types/types';

function Index(): JSX.Element {
  const modals = useModals();
  const isDesktop = useMediaQuery('(min-width: 900px)');

  const { selectedShop } = useShop();

  const products = useRef<SelectItem[]>([]);
  const [shownCollections, setShownCollections] = useState<Collection[]>([]);

  const openCreateModal = (): void => {
    modals.openModal({
      title: 'Create a Collection',
      centered: true,
      children: (
        <CreateCollection
          getCollections={getCollections}
          modals={modals}
          products={products}
          selectedShop={selectedShop}
        />
      ),
    });
  };

  const getCollections = (): void => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections`).then((response: AxiosResponse) => {
      if (response.status === 200) {
        setShownCollections(response.data.data);
      }
    });
  };

  useEffect(() => {
    const getProducts = (): void => {
      if (selectedShop.ref_id) {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/products/shop/${selectedShop.ref_id}?page_size=100`)
          .then((response: AxiosResponse) => {
            for (let i = 0; i < response.data.data.length; i++) {
              products.current.push({ label: response.data.data[i].name, value: response.data.data[i].ref_id });
            }
          });
      }
    };
    getProducts();
    getCollections();
  }, [selectedShop]);

  return (
    <DashboardLayout
      tabTitle="Collections | Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      {shownCollections.length > 0 ? (
        <>
          <Flex
            align={isDesktop ? 'center' : 'stretch'}
            direction={isDesktop ? 'row' : 'column'}
            gap={16}
            justify="space-between"
            mb={isDesktop ? 48 : 24}
          >
            <Title className="text-2xl" order={1}>
              All Collections
            </Title>

            <Button onClick={() => openCreateModal()}>Create Collection</Button>
          </Flex>

          <CollectionList
            getCollections={getCollections}
            isDesktop={isDesktop}
            modals={modals}
            products={products}
            selectedShop={selectedShop}
            shownCollections={shownCollections}
          />
        </>
      ) : (
        <EmptyMessage
          title="You Have No Collections"
          description="Create a collection to get started!"
          buttonText="Create Collection"
          clickAction={() => openCreateModal()}
        />
      )}
    </DashboardLayout>
  );
}

export default Index;
