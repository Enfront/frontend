import { useState } from 'react';

import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Menu,
  ScrollArea,
  Table,
  Textarea,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useClipboard } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconChevronDown, IconFileSpreadsheet } from '@tabler/icons-react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { CSVLink } from 'react-csv';

import { Item, ProductFormData } from '&/types/types';

interface DigitalKeysProps {
  form: UseFormReturnType<ProductFormData>;
  getViewedProduct: () => Promise<void>;
  shownKeys: Item[];
}

function DigitalKeys({ form, getViewedProduct, shownKeys }: DigitalKeysProps): JSX.Element {
  const theme = useMantineTheme();
  const clipboard = useClipboard();

  const [selection, setSelection] = useState<Item[]>([]);
  const [excelSelection, setExcelSelection] = useState<{ key: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleRow = (key: Item): void => {
    setSelection((current: Item[]) =>
      current.includes(key) ? current.filter((item: Item) => item !== key) : [...current, key],
    );
  };

  const toggleAll = (): void => {
    setSelection((current: Item[]) => (current.length === shownKeys.length ? [] : shownKeys.map((item: Item) => item)));
  };

  const copyKeys = (): void => {
    const keys: string[] = [];
    selection.forEach((item: Item) => {
      keys.push(item.key);
    });

    clipboard.copy(keys.toString());
  };

  const manipulateKeysForExcel = (done: () => void): void => {
    setExcelSelection([]);
    selection.forEach((selectedKey: Item) => {
      setExcelSelection((current: { key: string }[]) =>
        current.find((item: { key: string }) => item.key === selectedKey.key)
          ? current.filter((item: { key: string }) => item.key !== selectedKey.key)
          : [...current, { key: selectedKey.key }],
      );
    });

    done();
  };

  const deleteKeys = (): void => {
    setLoading(true);

    selection.forEach((item: Item, index: number) => {
      axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/products/digital/${item.ref_id}`)
        .then(() => {
          setSelection((current: Item[]) => current.filter((selectionItem: Item) => selectionItem !== item));

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
                        checked={selection.includes(key)}
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
              <Tooltip
                label="Keys copied!"
                offset={5}
                position="bottom"
                radius="xl"
                transitionProps={{ duration: 100, transition: 'slide-down' }}
                opened={clipboard.copied}
              >
                <Button className="rounded-r-none" onClick={() => copyKeys()} disabled={selection.length === 0}>
                  Copy Selected Keys
                </Button>
              </Tooltip>

              <Menu transitionProps={{ transition: 'pop' }} position="bottom-end">
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
