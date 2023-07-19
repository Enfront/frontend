import { Dispatch, SetStateAction } from 'react';
import { NextRouter } from 'next/router';

import { Avatar, Badge, Divider, Group, Pagination, Paper, Stack, Table, Text } from '@mantine/core';
import { format, parseISO } from 'date-fns';

import { Customer, CustomerPagination } from '&/types/types';

interface ListProps {
  customers: CustomerPagination;
  isDesktop: boolean;
  page: number;
  router: NextRouter;
  setPage: Dispatch<SetStateAction<number>>;
  shownCustomers: Customer[];
}

function CustomerList({ customers, isDesktop, page, router, setPage, shownCustomers }: ListProps): JSX.Element {
  const changeCustomerPage = (pageNumber: number): void => {
    // eslint-disable-next-line no-param-reassign
    router.query.page = pageNumber.toString();
    router.push(router);
    setPage(pageNumber);
  };

  const gotoCustomerDetails = (customerId: string): void => {
    router.push(`/dashboard/customers/${customerId}`);
  };

  return (
    <>
      {isDesktop ? (
        <Table verticalSpacing="md" highlightOnHover>
          <thead>
            <tr>
              <th>Date Added</th>
              <th>Email</th>
              <th>Completed Orders</th>
              <th>Status</th>
            </tr>
          </thead>

          {shownCustomers.length > 0 ? (
            <tbody>
              {shownCustomers.map((customer: Customer) => (
                <tr
                  className="cursor-pointer"
                  onClick={() => gotoCustomerDetails(customer.user.ref_id)}
                  key={customer.user.ref_id}
                >
                  <td>
                    {customer.user.created_at ? format(parseISO(customer.user.created_at), 'MMMM do, yyyy H:mma') : ''}
                  </td>
                  <td>{customer.user.email}</td>
                  <td>{customer.completed_order_count}</td>
                  <td>
                    {customer.user.is_active ? (
                      <Badge color="green" radius="xs">
                        Registered
                      </Badge>
                    ) : (
                      <Badge color="yellow" radius="xs">
                        Anonymous
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={5}>
                  <Text align="center" color="dimmed" size="md">
                    No customers found
                  </Text>
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      ) : (
        <>
          {shownCustomers.map((customer: Customer) => (
            <Paper
              p={16}
              radius="md"
              shadow="sm"
              mb={16}
              onClick={() => gotoCustomerDetails(customer.user.ref_id)}
              key={customer.user.ref_id}
              withBorder
            >
              <Group align="flex-start" spacing={8} mb={16} noWrap>
                <Avatar color="brand" />

                <Stack className="max-w-min overflow-hidden" spacing={2}>
                  <Text size="xs" weight={500} lineClamp={1}>
                    {customer.user.email ?? 'Anonymous'}
                  </Text>

                  <Text color="dimmed" size="xs" lineClamp={1}>
                    {customer.user.ref_id}
                  </Text>
                </Stack>
              </Group>

              <Divider my={16} />

              {customer.user.is_active ? (
                <Badge color="green" radius="xs" fullWidth>
                  Registered
                </Badge>
              ) : (
                <Badge color="yellow" radius="xs" fullWidth>
                  Anonymous
                </Badge>
              )}
            </Paper>
          ))}
        </>
      )}

      {customers.count >= 10 && (
        <Pagination
          page={page}
          onChange={changeCustomerPage}
          total={Math.ceil(customers.count / 10)}
          position={isDesktop ? 'right' : 'center'}
          size={isDesktop ? 'md' : 'sm'}
          withEdges={isDesktop}
          mt={48}
        />
      )}
    </>
  );
}

export default CustomerList;
