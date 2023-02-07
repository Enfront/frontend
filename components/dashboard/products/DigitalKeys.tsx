import { useState } from 'react';

import { ActionIcon, Button, Checkbox, Group, Menu, ScrollArea, Table, Textarea, useMantineTheme } from '@mantine/core';
import { IconChevronDown, IconFileSpreadsheet } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';
import { UseFormReturnType } from '@mantine/form';
import { CSVLink } from 'react-csv';
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
  const [excelSelection, setExcelSelection] = useState<{ key: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleRow = (key: Item) => {
    setSelection((current: string[]) =>
      current.includes(key.ref_id) ? current.filter((item: string) => item !== key.ref_id) : [...current, key.ref_id],
    );
  };

  const toggleAll = () => {
    setSelection((current: string[]) =>
      current.length === shownKeys.length ? [] : shownKeys.map((item: Item) => item.ref_id),
    );
  };

  const manipulateKeysForExcel = (done: () => void): void => {
    setExcelSelection([]);
    selection.forEach((selectedKey: string) => {
      setExcelSelection((current: { key: string }[]) =>
        current.find((item: { key: string }) => item.key === selectedKey)
          ? current.filter((item: { key: string }) => item.key !== selectedKey)
          : [...current, { key: selectedKey }],
      );
    });

    done();
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
                        onChange={() => toggleRow(key)}
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
            <Group noWrap spacing={0}>
              <Button
                className="rounded-r-none"
                onClick={() => navigator.clipboard.writeText(selection.toString())}
                disabled={selection.length === 0}
              >
                Copy Selected Keys
              </Button>

              <Menu transition="pop" position="bottom-end">
                <Menu.Target>
                  <ActionIcon
                    className={`rounded-l-none border-l ${
                      theme.colorScheme === 'dark' ? `border-l-[#1A1B1E]` : `border-l-[#fff]`
                    }`}
                    disabled={selection.length === 0}
                    variant="filled"
                    color={theme.primaryColor}
                    size={36}
                  >
                    <IconChevronDown size={16} stroke={1.5} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconFileSpreadsheet size={16} stroke={1.5} color="green" />}
                    disabled={selection.length === 0}
                  >
                    <CSVLink
                      className={`no-underline ${selection.length === 0 ? 'text-[#adb5bd]' : 'text-black'}`}
                      onClick={(_, done) => manipulateKeysForExcel(done)}
                      data={excelSelection}
                      filename={`${new Date().toJSON().slice(0, 10).replace(/-/g, '/')} - Key Download`}
                      target="_blank"
                      asyncOnClick
                    >
                      Download Selected Keys to Excel
                    </CSVLink>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

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
