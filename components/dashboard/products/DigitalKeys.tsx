import { useState } from 'react';

import { Button, Checkbox, Group, ScrollArea, Table, Textarea, useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { UseFormReturnType } from '@mantine/form';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

import { Item, ProductFormData } from '../../../types/types';

interface DigitalKeysProps {
  form: UseFormReturnType<ProductFormData>;
  getViewedProduct: () => Promise<void>;
  shownKeys: Item[];
}

function DigitalKeys({ form, getViewedProduct, shownKeys }: DigitalKeysProps): JSX.Element {
  const theme = useMantineTheme();

  const [selection, setSelection] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleRow = (id: string) => {
    setSelection((current: string[]) =>
      current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id],
    );
  };

  const toggleAll = () => {
    setSelection((current: string[]) =>
      current.length === shownKeys.length ? [] : shownKeys.map((item: Item) => item.ref_id),
    );
  };

  const deleteKeys = (): void => {
    setLoading(true);

    selection.forEach((refId: string, index: number) => {
      axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/products/digital/${refId}`)
        .then(() => {
          setSelection((current: string[]) => current.filter((item: string) => item !== refId));

          if (index === selection.length - 1) {
            getViewedProduct();
            setLoading(false);
          }
        })
        .catch(() => {
          getViewedProduct();
          setLoading(false);

          showNotification({
            title: 'Key Could Not Be Deleted!',
            message: 'There was an issue deleting your key.',
            color: 'red',
          });
        });
    });
  };

  return (
    <>
      <Textarea
        label="Upload Items"
        placeholder="Manually type items separated by commas, spaces, or new lines."
        minRows={8}
        maxRows={8}
        autosize
        {...form.getInputProps('keys')}
      />

      {shownKeys.length > 0 && (
        <>
          <ScrollArea className="h-96" offsetScrollbars>
            <Table verticalSpacing="md" highlightOnHover>
              <thead className={`sticky top-0 z-50 ${theme.colorScheme === 'dark' ? `bg-[#1a1b1e]` : 'bg-white'}`}>
                <tr>
                  <th>
                    <Checkbox
                      onChange={toggleAll}
                      checked={selection.length === shownKeys.length}
                      indeterminate={selection.length > 0 && selection.length !== shownKeys.length}
                      transitionDuration={0}
                    />
                  </th>
                  <th>Created At</th>
                  <th>Item</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {shownKeys.map((key: Item) => (
                  <tr key={key.key}>
                    <td>
                      <Checkbox
                        checked={selection.includes(key.ref_id)}
                        onChange={() => toggleRow(key.ref_id)}
                        disabled={key.recipient_email != null}
                        transitionDuration={0}
                      />
                    </td>
                    <td>{format(parseISO(key.created_at.toString()), 'MMMM do, yyyy HH:mm')}</td>
                    <td>{key.key}</td>
                    <td>
                      <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Listed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>

          <Group position="right">
            <Button onClick={() => deleteKeys()} loading={loading} disabled={selection.length === 0}>
              Delete Selected Item(s)
            </Button>
          </Group>
        </>
      )}
    </>
  );
}

export default DigitalKeys;
