import { ChangeEvent, useState } from 'react';

import {
  Avatar,
  Badge,
  Button,
  Group,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import axios, { AxiosError } from 'axios';
import { ChevronDown, Note, Pencil } from 'tabler-icons-react';

import { CustomerDetails, EditUserData, StatsCard } from '&/types/types';

interface CustomerDetailProps {
  customer: CustomerDetails;
  customerId: string | string[] | undefined;
  getCustomerInfo: () => void;
  getCustomerNotes: () => void;
  stats: StatsCard[];
}

export interface EditModalProps {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

function Details({ customer, customerId, getCustomerInfo, getCustomerNotes, stats }: CustomerDetailProps): JSX.Element {
  const modals = useModals();

  const NoteModal = (): JSX.Element => {
    const [note, setNote] = useState<string>('');

    const createNote = (): void => {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/customers/note`, {
          customer: customerId,
          note,
        })
        .then(() => {
          getCustomerNotes();
          modals.closeAll();
        });
    };

    return (
      <Stack>
        <Textarea
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setNote(event.currentTarget.value)}
          placeholder="Customer Note"
          label="Customer Note"
          value={note}
          minRows={6}
          required
        />

        <Button onClick={() => createNote()} disabled={note === ''} mt="md" type="submit" fullWidth>
          Create Note
        </Button>
      </Stack>
    );
  };

  const EditModal = ({ email, username, firstName, lastName }: EditModalProps): JSX.Element => {
    const form = useForm({
      initialValues: {
        email,
        username,
        first_name: firstName,
        last_name: lastName,
      },

      validate: {
        email: (value) => (/^\S+@\S+$/.test(value) || '' ? null : 'Invalid email'),
      },
    });

    const editUser = async (data: EditUserData): Promise<void> => {
      if (customerId) {
        await axios
          .patch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
            email: data.email,
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
            customer: customerId,
          })
          .then(() => {
            modals.closeAll();
            getCustomerInfo();
          })
          .catch((error: AxiosError) => {
            if (error.response?.status === 409) {
              showNotification({
                title: 'Uh oh!',
                message: 'A user with this email already exists.',
                color: 'red',
              });
            }
          });
      }
    };

    return (
      <form onSubmit={form.onSubmit((values: EditUserData) => editUser(values))}>
        <Stack>
          <Group grow noWrap>
            <TextInput label="First Name" placeholder="First Name" {...form.getInputProps('first_name')} />
            <TextInput label="Last Name" placeholder="Last Name" {...form.getInputProps('last_name')} />
          </Group>

          <TextInput label="Email" placeholder="Email" type="email" {...form.getInputProps('email')} />
          <TextInput label="Username" placeholder="Username" {...form.getInputProps('username')} />

          <Button type="submit" mt="md" fullWidth>
            Edit Customer
          </Button>
        </Stack>
      </form>
    );
  };

  const openNoteModal = () => {
    modals.openModal({
      title: 'Create Customer Note',
      centered: true,
      children: <NoteModal />,
    });
  };

  const openEditModal = () => {
    modals.openModal({
      title: 'Edit Customer',
      centered: true,
      children: (
        <EditModal
          email={customer.user.email}
          firstName={customer.user.first_name}
          lastName={customer.user.last_name}
          username={customer.user.username}
        />
      ),
    });
  };

  return (
    <>
      <Title className="text-2xl" order={1}>
        {customerId}
      </Title>

      <Group position="apart" mb={24}>
        <Group>
          <Avatar color="blue" size="lg" />

          <Stack justify="center" spacing={0}>
            <Group>
              <Text weight={500}>
                {customer.user.first_name && <>{customer.user.first_name}</>}
                {customer.user.last_name && <> {customer.user.last_name}</>}

                {!customer.user.first_name && !customer.user.last_name && !customer.user.is_active && (
                  <>Anonymous Customer</>
                )}

                {!customer.user.first_name && !customer.user.last_name && customer.user.is_active && (
                  <>Registered Customer</>
                )}
              </Text>

              {customer.user.is_active ? (
                <Badge color="green" radius="xs">
                  Registered
                </Badge>
              ) : (
                <Badge color="yellow" radius="xs">
                  Anonymous
                </Badge>
              )}
            </Group>

            <Text color="gray" size="sm">
              {customer.user.email} {customer.user.username && <>&#183; {customer.user.username}</>}
            </Text>
          </Stack>
        </Group>

        <Menu position="bottom-end" shadow="md" width={200}>
          <Menu.Target>
            <Button className="pr-3" variant="outline" rightIcon={<ChevronDown size={14} />}>
              Actions
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={openNoteModal} icon={<Note size={14} />}>
              Add Note
            </Menu.Item>

            <Menu.Item onClick={openEditModal} icon={<Pencil size={14} />}>
              Edit Customer
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        {stats &&
          stats.map((item: StatsCard) => (
            <Paper withBorder p="md" radius="md" key={item.id}>
              <Group position="apart">
                <Text className="font-bold" size="sm" color="dimmed">
                  {item.name}
                </Text>

                {item.icon}
              </Group>

              <Group align="flex-end" spacing="xs" mt={25}>
                <Text className="text-2xl font-bold">{item.stat}</Text>
              </Group>
            </Paper>
          ))}
      </SimpleGrid>
    </>
  );
}

export default Details;
