import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Badge, Group, Pagination, Paper, SimpleGrid, Table, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios, { AxiosResponse } from 'axios';
import { format, parseISO } from 'date-fns';

import useShop from '&/contexts/ShopContext';
import { PayoutHistory } from '&/types/types';

function PayoutsTab(): JSX.Element {
  const router = useRouter();

  const { selectedShop } = useShop();

  const [page, setPage] = useState<number>(router.query.page ? parseInt(router.query.page as string, 10) : 1);
  const [bitcoinBalance, setBitcoinBalance] = useState<number>(0);
  const [payoutHistoryCount, setPayoutHistoryCount] = useState<number>(0);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistory[]>([]);

  const getPayoutCurrentStatus = (currentStatus: number): JSX.Element => {
    switch (currentStatus) {
      case -1:
        return (
          <Badge color="red" radius="xs">
            Denied
          </Badge>
        );
      case 0:
        return (
          <Badge color="yellow" radius="xs">
            Requested
          </Badge>
        );
      case 1:
        return (
          <Badge color="indigo" radius="xs">
            Pending
          </Badge>
        );
      case 2:
        return (
          <Badge color="green" radius="xs">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge color="red" radius="xs">
            Unknown
          </Badge>
        );
    }
  };

  const changeHistoryPage = (pageNumber: number): void => {
    router.query.page = pageNumber.toString();
    router.push(router);
    setPage(pageNumber);
  };

  const getPayoutData = (): void => {
    if (selectedShop.ref_id !== '') {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/payouts/${selectedShop.ref_id}?page=${page}`)
        .then((response: AxiosResponse) => {
          setBitcoinBalance(response.data?.data?.balance ?? 0);
          setPayoutHistory(response.data.data?.history?.results);
          setPayoutHistoryCount(response.data.data?.history?.count);
        })
        .catch(() => {
          showNotification({
            title: 'Uh Oh!',
            message: 'There was an issue retrieving your payout data. Please wait a moment and try again.',
            color: 'red',
          });
        });
    }
  };

  useEffect(() => {
    getPayoutData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShop, page]);

  return (
    <>
      <SimpleGrid
        mt={24}
        mb={64}
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        <Paper withBorder p="md" radius="md">
          <Group position="apart">
            <Text className="font-bold" size="sm" color="dimmed">
              Bitcoin (BTC)
            </Text>

            <Image src="/brands/bitcoin.png" height={24} width={24} />
          </Group>

          <Group align="flex-end" spacing="xs" mt={25}>
            <Text className="text-2xl font-bold">{bitcoinBalance}</Text>
          </Group>
        </Paper>
      </SimpleGrid>

      {payoutHistory && payoutHistory.length > 0 && (
        <>
          <Title className="text-xl" order={2} mb={16}>
            Past Payouts
          </Title>

          <Table verticalSpacing="md" striped highlightOnHover>
            <thead>
              <tr>
                <th>Request Date</th>
                <th>Currency</th>
                <th>Destination</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payoutHistory.map((payout: PayoutHistory) => (
                <tr key={payout.ref_id}>
                  <td>{format(parseISO(payout.created_at), 'MMM do, yyyy H:mma')}</td>
                  <td>{payout.currency}</td>
                  <td>{payout.destination}</td>
                  <td>
                    {payout.amount.toLocaleString('fullwide', { useGrouping: true, maximumSignificantDigits: 8 })}
                  </td>
                  <td>{getPayoutCurrentStatus(payout.status)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination
            className="mt-12"
            page={page}
            onChange={changeHistoryPage}
            total={Math.ceil(payoutHistoryCount / 10)}
            position="right"
            withEdges
          />
        </>
      )}
    </>
  );
}

export default PayoutsTab;
