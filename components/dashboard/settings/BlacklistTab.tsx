import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { ActionIcon, Badge, Divider, Group, Pagination, Paper, Stack, Table, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Trash } from 'tabler-icons-react';
import axios, { AxiosResponse } from 'axios';
import { format, parseISO } from 'date-fns';

import CreateBlacklistItem from './CreateBacklistItem';
import useShop from '../../../contexts/ShopContext';
import { BlacklistItem, BlacklistPagination } from '../../../types/types';

interface BlacklistProps {
  isDesktop: boolean;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

function BlackListTab({ isDesktop, openModal, setOpenModal }: BlacklistProps): JSX.Element {
  const router = useRouter();

  const { selectedShop } = useShop();

  const [page, setPage] = useState<number>(router.query.page ? parseInt(router.query.page as string, 10) : 1);
  const [blacklist, setBlacklist] = useState<BlacklistPagination>({
    count: 0,
    next: '',
    previous: '',
    results: [],
  });

  const getBlackList = (): void => {
    if (selectedShop.ref_id !== '') {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/blacklists/${selectedShop.ref_id}?page=${page}`)
        .then((response: AxiosResponse) => {
          setBlacklist(response.data.data);
        })
        .catch(() => {
          showNotification({
            title: 'Uh Oh!',
            message: 'The blacklists could not be loaded.',
            color: 'red',
          });
        });
    }
  };

  const deleteBlacklistItem = (blacklist_ref: string): void => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/blacklists/delete/${blacklist_ref}`)
      .then((response: AxiosResponse) => {
        if (response.status === 204) {
          showNotification({
            title: 'Success!',
            message: 'The blacklist item has been deleted.',
            color: 'green',
          });

          getBlackList();
        }
      })
      .catch(() => {
        showNotification({
          title: 'Uh Oh!',
          message: 'The blacklist item could not be deleted.',
          color: 'red',
        });
      });
  };

  const changeBlacklistPage = (pageNumber: number): void => {
    router.query.page = pageNumber.toString();
    router.push(router);
    setPage(pageNumber);
  };

  const getBlacklistType = (blacklistItem: BlacklistItem, classes?: string): JSX.Element => {
    if (blacklistItem.email) {
      return (
        <Badge className={classes} color="blue" radius="xs">
          Email
        </Badge>
      );
    }

    if (blacklistItem.paypal_email) {
      return (
        <Badge className={classes} color="indigo" radius="xs">
          Paypal Email
        </Badge>
      );
    }

    if (blacklistItem.ip_address) {
      return (
        <Badge className={classes} color="yellow" radius="xs">
          IP Address
        </Badge>
      );
    }

    if (blacklistItem.country) {
      return (
        <Badge className={classes} color="orange" radius="xs">
          Country
        </Badge>
      );
    }

    return (
      <Badge className={classes} color="red" radius="xs">
        Unknown
      </Badge>
    );
  };

  useEffect(() => {
    getBlackList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShop, page]);

  return (
    <>
      {isDesktop ? (
        <Table verticalSpacing="md" highlightOnHover>
          <thead>
            <tr>
              <th>Value</th>
              <th>Note</th>
              <th>Type</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {blacklist.results.map((blacklistItem: BlacklistItem) => (
              <tr key={blacklistItem.ref_id}>
                <td>
                  {blacklistItem.email ||
                    blacklistItem.paypal_email ||
                    blacklistItem.ip_address ||
                    blacklistItem.country}
                </td>

                <td>
                  <Text>{blacklistItem.note ?? ''}</Text>
                </td>

                <td>{getBlacklistType(blacklistItem)}</td>

                <td>
                  <ActionIcon onClick={() => deleteBlacklistItem(blacklistItem.ref_id)} color="red" size="sm">
                    <Trash />
                  </ActionIcon>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <>
          {blacklist.results.map((blacklistItem: BlacklistItem) => (
            <Paper radius="md" shadow="sm" mt={16} p={16} key={blacklistItem.ref_id} withBorder>
              <Stack spacing={2}>
                <Text size="xs" weight={500} lineClamp={1}>
                  {blacklistItem.paypal_email ||
                    blacklistItem.email ||
                    blacklistItem.ip_address ||
                    blacklistItem.country}
                </Text>

                <Text color="dimmed" size="xs" lineClamp={1}>
                  {format(parseISO(blacklistItem.created_at), 'MMM do, p')}
                </Text>
              </Stack>

              <Divider my="sm" />

              {blacklistItem.note && (
                <Group position="apart" mb={8} noWrap>
                  <Text color="dimmed" size="xs">
                    Note
                  </Text>

                  <Text size="xs" weight={500} transform="capitalize">
                    {blacklistItem.note}
                  </Text>
                </Group>
              )}

              {getBlacklistType(blacklistItem, 'w-full')}
            </Paper>
          ))}
        </>
      )}

      {blacklist.count > 0 && (
        <Pagination
          page={page}
          onChange={changeBlacklistPage}
          total={Math.ceil(blacklist.count / 10)}
          position={isDesktop ? 'right' : 'center'}
          size={isDesktop ? 'md' : 'sm'}
          withEdges={isDesktop}
          mt={48}
        />
      )}

      <CreateBlacklistItem
        getBlackList={getBlackList}
        open={openModal}
        selectedShopRefId={selectedShop.ref_id}
        setOpen={setOpenModal}
      />
    </>
  );
}

export default BlackListTab;
