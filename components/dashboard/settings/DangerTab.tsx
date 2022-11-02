import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Group, Text, TextInput, Title } from '@mantine/core';
import { useModals } from '@mantine/modals';
import axios, { AxiosError } from 'axios';

import useShop from '../../../contexts/ShopContext';

function DangerTab(): JSX.Element {
  const router = useRouter();
  const modals = useModals();

  const { getUserShops, selectedShop } = useShop();

  const deleteShop = (): void => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/shops/${selectedShop.ref_id}`)
      .then(() => {
        modals.closeAll();
        localStorage.removeItem('enfront.ssid');
        getUserShops();
        router.push('/dashboard');
      })
      .catch((error: AxiosError) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  const openDeleteModal = (): void => {
    modals.openModal({
      title: `Delete ${selectedShop.name}`,
      centered: true,
      children: <DeleteModal />,
    });
  };

  const DeleteModal = (): JSX.Element => {
    const [nameInput, setNameInput] = useState<string>('');

    return (
      <>
        <Text size="sm">
          This action cannot be undone. This will permanently delete{' '}
          <span className="font-bold">{selectedShop.name}</span> and remove all associations. Please type{' '}
          <span className="font-bold">{selectedShop.name}</span> to confirm.
        </Text>

        <TextInput
          onChange={(event: ChangeEvent<HTMLInputElement>) => setNameInput(event.currentTarget.value)}
          mt={16}
        />

        <Group mt={16} position="right">
          <Button onClick={() => modals.closeAll()} variant="default">
            Cancel
          </Button>

          <Button onClick={() => deleteShop()} disabled={nameInput !== selectedShop.name} color="red">
            Delete
          </Button>
        </Group>
      </>
    );
  };

  return (
    <Group mt={24}>
      <div className="flex-1">
        <Title className="text-lg" order={2}>
          Delete {selectedShop.name}
        </Title>

        <Text size="sm">Once you delete a shop, there is no going back.</Text>
      </div>

      <Button onClick={openDeleteModal} color="red">
        Delete Shop
      </Button>
    </Group>
  );
}

export default DangerTab;
