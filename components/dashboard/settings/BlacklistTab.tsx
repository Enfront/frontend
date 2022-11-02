import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { ActionIcon, Grid, ScrollArea, Table, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Trash } from 'tabler-icons-react';
import axios, { AxiosResponse } from 'axios';

import useShop from '../../../contexts/ShopContext';
import CreateBlacklistItem from './CreateBacklistItem';
import { BlacklistItem } from '../../../types/types';

interface BlacklistProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

function BlackListTab({ openModal, setOpenModal }: BlacklistProps): JSX.Element {
  const { selectedShop } = useShop();

  const [ipBlacklist, setIpBlacklist] = useState<BlacklistItem[]>([]);
  const [userBlacklist, setUserBlacklist] = useState<BlacklistItem[]>([]);
  const [countryBlacklist, setCountryBlacklist] = useState<BlacklistItem[]>([]);
  const [payPalEmailBlacklist, setPayPalEmailBlacklist] = useState<BlacklistItem[]>([]);

  const getBlackList = (): void => {
    if (selectedShop.ref_id !== '') {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/blacklists/${selectedShop.ref_id}`)
        .then((response: AxiosResponse) => {
          if (response.data.data) {
            setIpBlacklist(response.data.data.filter((data: BlacklistItem) => data.ip_address));
            setUserBlacklist(response.data.data.filter((data: BlacklistItem) => data.email));
            setCountryBlacklist(response.data.data.filter((data: BlacklistItem) => data.country));
            setPayPalEmailBlacklist(response.data.data.filter((data: BlacklistItem) => data.paypal_email));
          }
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

  useEffect(() => {
    getBlackList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShop]);

  return (
    <>
      <Grid gutter="xl" mt={24}>
        <Grid.Col span={6}>
          <Title className="text-xl" order={2}>
            IP Addresses
          </Title>

          <ScrollArea className="h-80" offsetScrollbars>
            <Table verticalSpacing="md" highlightOnHover>
              <thead>
                <tr>
                  <th>Value</th>
                  <th />
                </tr>
              </thead>

              {ipBlacklist.length > 0 ? (
                <tbody>
                  {ipBlacklist.map((list: BlacklistItem) => (
                    <tr className="cursor-pointer" key={list.ref_id}>
                      <td>{list.ip_address}</td>
                      <td>
                        <ActionIcon onClick={() => deleteBlacklistItem(list.ref_id)} color="red" size="sm">
                          <Trash />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={6}>
                      <Text align="center" color="dimmed" size="md">
                        No ip addresses blacklisted
                      </Text>
                    </td>
                  </tr>
                </tbody>
              )}
            </Table>
          </ScrollArea>
        </Grid.Col>

        <Grid.Col span={6}>
          <Title className="text-xl" order={2}>
            Countries
          </Title>

          <ScrollArea className="h-80" offsetScrollbars>
            <Table verticalSpacing="md" highlightOnHover>
              <thead>
                <tr>
                  <th>Value</th>
                  <th />
                </tr>
              </thead>

              {countryBlacklist.length > 0 ? (
                <tbody>
                  {countryBlacklist.map((list: BlacklistItem) => (
                    <tr className="cursor-pointer" key={list.ref_id}>
                      <td>{list.country}</td>
                      <td>
                        <ActionIcon onClick={() => deleteBlacklistItem(list.ref_id)} color="red" size="sm">
                          <Trash />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={6}>
                      <Text align="center" color="dimmed" size="md">
                        No countries blacklisted
                      </Text>
                    </td>
                  </tr>
                </tbody>
              )}
            </Table>
          </ScrollArea>
        </Grid.Col>

        <Grid.Col span={6} mt={98}>
          <Title className="text-xl" order={2}>
            PayPal Emails
          </Title>

          <ScrollArea className="h-80" offsetScrollbars>
            <Table verticalSpacing="md" highlightOnHover>
              <thead>
                <tr>
                  <th>Value</th>
                  <th />
                </tr>
              </thead>

              {payPalEmailBlacklist.length > 0 ? (
                <tbody>
                  {payPalEmailBlacklist.map((list: BlacklistItem) => (
                    <tr className="cursor-pointer" key={list.ref_id}>
                      <td>{list.paypal_email}</td>
                      <td>
                        <ActionIcon onClick={() => deleteBlacklistItem(list.ref_id)} color="red" size="sm">
                          <Trash />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={6}>
                      <Text align="center" color="dimmed" size="md">
                        No PayPal emails blacklisted
                      </Text>
                    </td>
                  </tr>
                </tbody>
              )}
            </Table>
          </ScrollArea>
        </Grid.Col>

        <Grid.Col span={6} mt={98}>
          <Title className="text-xl" order={2}>
            Users
          </Title>

          <ScrollArea className="h-80" offsetScrollbars>
            <Table verticalSpacing="md" highlightOnHover>
              <thead>
                <tr>
                  <th>Value</th>
                  <th />
                </tr>
              </thead>

              {userBlacklist.length > 0 ? (
                <tbody>
                  {userBlacklist.map((list: BlacklistItem) => (
                    <tr className="cursor-pointer" key={list.ref_id}>
                      <td>{list.email}</td>
                      <td>
                        <ActionIcon onClick={() => deleteBlacklistItem(list.ref_id)} color="red" size="sm">
                          <Trash />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={6}>
                      <Text align="center" color="dimmed" size="md">
                        No users blacklisted
                      </Text>
                    </td>
                  </tr>
                </tbody>
              )}
            </Table>
          </ScrollArea>
        </Grid.Col>
      </Grid>

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
