import { MutableRefObject } from 'react';

import {
  ActionIcon,
  Avatar,
  Box,
  Code,
  Divider,
  Group,
  Paper,
  SelectItem,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { ModalsContextProps } from '@mantine/modals/lib/context';
import { useClipboard } from '@mantine/hooks';
import { Copy, Edit, Trash } from 'tabler-icons-react';
import axios from 'axios';

import EditCollection from './EditCollection';
import { Collection, ShopData } from '../../../types/types';

interface CollectionsListProps {
  getCollections: () => void;
  isDesktop: boolean;
  modals: ModalsContextProps;
  products: MutableRefObject<SelectItem[]>;
  selectedShop: ShopData;
  shownCollections: Collection[];
}

function CollectionList({
  getCollections,
  isDesktop,
  modals,
  products,
  selectedShop,
  shownCollections,
}: CollectionsListProps): JSX.Element {
  const clipboard = useClipboard({ timeout: 1500 });

  const openEditModal = (collection: Collection): void => {
    modals.openModal({
      title: `Edit ${collection.title}`,
      centered: true,
      children: (
        <EditCollection
          collection={collection}
          getCollections={getCollections}
          modals={modals}
          products={products}
          selectedShop={selectedShop}
        />
      ),
    });
  };

  const confirmDeletion = (collection: Collection): void => {
    modals.openConfirmModal({
      title: `Delete the ${collection.title} collection?`,
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this collection? This action cannot be undone.</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteCollection(collection),
    });
  };

  const deleteCollection = (collection: Collection): void => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/collections/${collection.ref_id}`).then(() => {
      getCollections();
    });
  };

  const getCollectionProducts = (collection: Collection): JSX.Element => {
    return (
      <Avatar.Group>
        {collection.products.map((item, index) => (
          <Box key={item.ref_id}>
            {index < 3 && (
              <Tooltip label={item.name} key={item.ref_id} withArrow>
                <Avatar src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_URL}${item.images[0].path}`} radius="sm" />
              </Tooltip>
            )}

            {index === 3 && (
              <Tooltip
                label={
                  <>
                    {collection.products
                      .filter((pro, idx) => idx >= 3)
                      .map((pro) => (
                        <div key={pro.ref_id}>{pro.name}</div>
                      ))}
                  </>
                }
                withArrow
              >
                <Avatar color="brand" radius="sm">
                  +{collection.products.length - 3}
                </Avatar>
              </Tooltip>
            )}
          </Box>
        ))}
      </Avatar.Group>
    );
  };

  return (
    <>
      {isDesktop ? (
        <Table verticalSpacing="md">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>URL</th>
              <th>Products</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {shownCollections.map((collection: Collection) => (
              <tr key={collection.ref_id}>
                <td>{collection.ref_id}</td>
                <td>{collection.title}</td>
                <td>
                  <Code>/{collection.slug}</Code>
                </td>
                <td>{getCollectionProducts(collection)}</td>
                <td>
                  <Group>
                    <Tooltip label={clipboard.copied ? 'Copied URL to clipboard' : 'Copy URL'}>
                      <ActionIcon
                        onClick={() => clipboard.copy(`${selectedShop.domain}/collection/${collection.slug}`)}
                        size="sm"
                        variant="transparent"
                      >
                        <Copy />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Edit Collection">
                      <ActionIcon onClick={() => openEditModal(collection)} size="sm" variant="transparent">
                        <Edit />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Delete Collection">
                      <ActionIcon
                        onClick={() => confirmDeletion(collection)}
                        color="red"
                        size="sm"
                        variant="transparent"
                      >
                        <Trash />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <>
          {shownCollections.map((collection: Collection) => (
            <Paper p={16} radius="md" shadow="sm" mb={16} key={collection.ref_id} withBorder>
              <Stack spacing={2}>
                <Text size="xs" weight={500} lineClamp={1}>
                  {collection.title}
                </Text>

                <Text color="dimmed" size="xs" lineClamp={1}>
                  {collection.ref_id}
                </Text>
              </Stack>

              <Divider my="sm" />

              <Group position="apart" mb={8} noWrap>
                <Text color="dimmed" size="xs">
                  Number of Products
                </Text>

                <Text size="xs" weight={500}>
                  {collection.products.length}
                </Text>
              </Group>

              <Group position="apart" mb={8} noWrap>
                <Text color="dimmed" size="xs">
                  Slug
                </Text>

                <Text size="xs" weight={500}>
                  {collection.slug}
                </Text>
              </Group>
            </Paper>
          ))}
        </>
      )}
    </>
  );
}

export default CollectionList;
