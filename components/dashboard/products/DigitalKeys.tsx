import { ActionIcon, ScrollArea, Table, Textarea, useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { Trash } from 'tabler-icons-react';
import axios from 'axios';

import { ItemKey } from '../../../types/types';

interface DigitalKeysProps {
  form: UseFormReturnType<{ name: string; price: number; keys: string; status: string }>;
  getViewedItem: () => Promise<void>;
  shownKeys: ItemKey[];
}

function DigitalKeys({ form, getViewedItem, shownKeys }: DigitalKeysProps): JSX.Element {
  const theme = useMantineTheme();

  const deleteKey = (keyId: string): void => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/products/digital/${keyId}`)
      .then(() => {
        getViewedItem();
      })
      .catch(() => {
        showNotification({
          title: 'Key Could Not Be Deleted!',
          message: 'There was an issue deleting your key.',
          color: 'red',
        });
      });
  };

  const getKeyStatus = (keyStatus: number): JSX.Element => {
    if (keyStatus === 0) {
      return (
        <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          Listed
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
        Purchased
      </span>
    );
  };

  return (
    <>
      <Textarea
        label="Upload Keys"
        placeholder="Manually type keys separated by commas, semi-colons, colons, vertical bars, or tabs."
        minRows={8}
        maxRows={8}
        autosize
        {...form.getInputProps('keys')}
      />

      {shownKeys.length > 0 && (
        <ScrollArea className="h-96" offsetScrollbars>
          <Table verticalSpacing="md" highlightOnHover>
            <thead className={`sticky top-0 z-50 ${theme.colorScheme === 'dark' ? `bg-[#1a1b1e]` : 'bg-white'}`}>
              <tr>
                <th>Key</th>
                <th>Recipient Email</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shownKeys.map((key: ItemKey) => (
                <tr key={key.key}>
                  <td>{key.key}</td>
                  <td>{key.recipient_email === null ? 'Unsold' : key.recipient_email}</td>
                  <td>{getKeyStatus(key.status)}</td>
                  <td>
                    {key.recipient_email !== '' ? (
                      <ActionIcon onClick={() => deleteKey(key.ref_id)} color="red" size="sm">
                        <Trash />
                      </ActionIcon>
                    ) : (
                      <ActionIcon size="sm" disabled>
                        <Trash />
                      </ActionIcon>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </>
  );
}

export default DigitalKeys;
