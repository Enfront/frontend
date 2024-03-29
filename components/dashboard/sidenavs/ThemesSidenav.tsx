import { ChangeEvent, Dispatch, ForwardedRef, forwardRef, SetStateAction, useEffect, useState } from 'react';

import {
  Avatar,
  Checkbox,
  ColorInput,
  Flex,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import axios, { AxiosResponse } from 'axios';

import useShop from '&/contexts/ShopContext';
import useTheme from '&/contexts/ThemeContext';
import { Product, ProductSelect, Setting, SettingsSchema, ThemeProductNew } from '&/types/types';

interface ThemesSideNavProps {
  existingConfig: Record<string | number, ThemeProductNew | string | boolean | number>;
  setExistingConfig: Dispatch<SetStateAction<Record<string | number, ThemeProductNew | string | boolean | number>>>;
  settingsScheme: SettingsSchema[];
}

function ThemesSidenav({ existingConfig, setExistingConfig, settingsScheme }: ThemesSideNavProps): JSX.Element {
  const { fakeToFrame, iframeLoaded, themePage, sendToFrame } = useTheme();
  const { selectedShop } = useShop();

  const [products, setProducts] = useState<ProductSelect[]>([]);
  const [realProducts, setRealProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product[]>([]);

  // eslint-disable-next-line react/display-name
  const SelectComponent = forwardRef<HTMLDivElement, ProductSelect>(
    // eslint-disable-next-line react/prop-types
    ({ image, label, refId, ...others }: ProductSelect, ref: ForwardedRef<HTMLDivElement>) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <div ref={ref} {...others}>
        <Group noWrap>
          <Avatar src={image} />

          <div>
            <Text size="sm">{label}</Text>
            <Text color="gray" size="xs" lineClamp={1}>
              {refId}
            </Text>
          </div>
        </Group>
      </div>
    ),
  );

  const getDefaultSettingValue = (setting: Setting): ThemeProductNew | string | boolean | number => {
    // Part of config
    if (existingConfig && Object.prototype.hasOwnProperty.call(existingConfig, setting.id)) {
      if (setting.type === 'product') {
        const themeProduct = existingConfig[setting.id] as ThemeProductNew;

        if (themeProduct) {
          return themeProduct.id;
        }
      }

      return existingConfig[setting.id];
    }

    // Specified in settings
    if (setting.default) {
      return setting.default;
    }

    return '';
  };

  const getSettingMarkup = (setting: Setting): JSX.Element => {
    switch (setting.type) {
      case 'text':
        return (
          <TextInput
            id={setting.id}
            onChange={($event) => updateConfig($event, setting)}
            value={getDefaultSettingValue(setting) as string}
            placeholder={setting.placeholder}
            label={setting.label}
            key={setting.id}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={setting.id}
            onChange={($event) => updateConfig($event, setting)}
            value={getDefaultSettingValue(setting) as string}
            placeholder={setting.placeholder}
            label={setting.label}
            minRows={4}
            maxRows={4}
            key={setting.id}
          />
        );

      case 'image':
        return (
          <Text>Not implemented</Text>
          // <InputWrapper label={setting.label}>
          //   <Dropzone
          //     onDrop={($event) => console.log(event)}
          //     onReject={() => {
          //       showNotification({
          //         title: 'Uh oh!',
          //         message:
          //           'There was an issue uploading this image. The max size is 3mb, and we only accept .png, .gif, .jpeg & .webp.',
          //         color: 'red',
          //       });
          //     }}
          //     maxSize={3 * 1024 ** 2}
          //     accept={IMAGE_MIME_TYPE}
          //     key={setting.id}
          //   >
          //     {(status: DropzoneStatus) => (
          //       <>
          //         <Text align="center" size="sm" color="dimmed">
          //           Drag images here to upload.
          //         </Text>
          //
          //         {status.rejected && (
          //           <Text align="center" color="red" size="sm">
          //             Cannot accept file.
          //           </Text>
          //         )}
          //       </>
          //     )}
          //   </Dropzone>
          //
          //   {uploadedImages.length > 0 && (
          //     <div className="relative mt-4">
          //       <span
          //         className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white
          //         bg-opacity-90 text-center opacity-0 duration-300 hover:opacity-100"
          //       >
          //         <ActionIcon variant="transparent" color="red" size="sm">
          //           <Trash onClick={() => setUploadedImages([])} aria-label="Remove image" />
          //         </ActionIcon>
          //       </span>
          //
          //       {imagePreviews}
          //     </div>
          //   )}
          // </InputWrapper>
        );

      case 'radio':
        return (
          <Text>Not implemented</Text>
          // <RadioGroup
          //   onChange={console.log}
          //   label={setting.label}
          //   defaultValue={setting.default?.toString()}
          //   key={setting.id}
          // >
          //   {setting.choices?.map((choice: SettingChoice) => (
          //     <Radio value={choice.value.toString()} label={choice.label} key={choice.label} />
          //   ))}
          // </RadioGroup>
        );

      case 'select':
        return (
          <Text>Not implemented</Text>
          // <Select
          //   id={setting.id}
          //   label={setting.label}
          //   placeholder="Pick one"
          //   defaultValue={setting.default?.toString()}
          //   data={setting.choices}
          //   key={setting.id}
          // />
        );

      case 'checkbox':
        return (
          <Checkbox
            id={setting.id}
            onChange={($event) => updateConfig($event, setting)}
            checked={(existingConfig[setting.id] as boolean) ?? setting.default}
            label={setting.label}
            key={setting.id}
          />
        );

      case 'color':
        return (
          <ColorInput
            id={setting.id}
            onChange={($event) => updateConfig($event, setting)}
            label={setting.label}
            placeholder={setting?.placeholder}
            defaultValue={setting.default?.toString()}
            key={setting.id}
          />
        );

      case 'range':
        return (
          <Text>Not implemented</Text>
          // <InputWrapper label={setting.label}>
          //   <Slider key={setting.id} />
          // </InputWrapper>
        );

      case 'product':
        return (
          <Select
            label={setting.label}
            data={products}
            itemComponent={SelectComponent}
            onChange={(event: string) => changeProduct(event, setting)}
            maxDropdownHeight={400}
            nothingFound="No products found"
            defaultValue={getDefaultSettingValue(setting) as string}
            key={setting.id}
            searchable
          />
        );

      default:
        return (
          <span className="mb-7 block text-sm text-red-400" key="unknown_control">
            Unknown Control - {setting.type}
          </span>
        );
    }
  };

  const updateConfig = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    setting: Setting,
  ): void => {
    sendToFrame(event, setting.id, setting.type, setting.attribute);

    if (setting.type === 'color') {
      setExistingConfig({ ...existingConfig, [setting.id]: event as string });
    } else if (setting.type === 'checkbox' && typeof event !== 'string') {
      setExistingConfig({ ...existingConfig, [setting.id]: (event.target as HTMLInputElement).checked });
    } else if (typeof event !== 'string') {
      setExistingConfig({ ...existingConfig, [setting.id]: event.target?.value });
    }
  };

  const changeProduct = (refId: string, setting: Setting): void => {
    const fullProduct = realProducts.find((i: Product) => i.ref_id === refId);

    if (fullProduct) {
      setSelectedProduct({
        ...selectedProduct,
        [setting.id]: fullProduct,
      });

      sendToFrame(fullProduct, setting.id, setting.type, setting.attribute);

      setExistingConfig({
        ...existingConfig,
        [setting.id]: {
          id: fullProduct.ref_id,
          item: true,
        },
      });
    }
  };

  useEffect(() => {
    const getProducts = async (): Promise<void> => {
      if (selectedShop.ref_id) {
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/products/shop/${selectedShop.ref_id}`)
          .then((response: AxiosResponse) => {
            if (response.data.data) {
              const productsArr: ProductSelect[] = [];

              response.data.data.forEach((product: Product) => {
                productsArr.push({
                  label: product.name,
                  value: product.ref_id,
                  image: `${process.env.NEXT_PUBLIC_AWS_IMAGE_URL}${product.images[0].path}`,
                  refId: product.ref_id,
                });
              });

              setProducts(productsArr);
              setRealProducts(response.data.data);
            } else {
              setProducts([]);
            }
          })
          .catch(() => {
            setProducts([]);
          });
      }
    };

    getProducts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShop]);

  useEffect(() => {
    const initializeSettings = async (): Promise<void> => {
      if (settingsScheme) {
        settingsScheme.map((settingsSection: SettingsSchema) => {
          return settingsSection.settings.map((setting: Setting) => {
            const defaultValue = getDefaultSettingValue(setting);

            if (!existingConfig) {
              setExistingConfig({ [setting.id]: defaultValue });
            } else if (!existingConfig[setting.id]) {
              setExistingConfig(
                (existingSetState: Record<string | number, ThemeProductNew | string | boolean | number>) => ({
                  ...existingSetState,
                  [setting.id]: defaultValue,
                }),
              );
            }

            return fakeToFrame(defaultValue, setting.id, setting.type, setting.attribute);
          });
        });
      }
    };

    initializeSettings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsScheme, iframeLoaded]);

  return (
    <>
      {settingsScheme.some((a: SettingsSchema) => a.page === themePage || a.page === 'all') ? (
        <Stack mb={48}>
          {settingsScheme
            .filter((b: SettingsSchema) => b.page === themePage || b.page === 'all')
            .map((settingsSection: SettingsSchema) => {
              return (
                <Stack key={settingsSection.name}>
                  <Title order={2} align="center">
                    {settingsSection.name}
                  </Title>

                  <Stack>
                    {existingConfig && settingsSection.settings.map((setting: Setting) => getSettingMarkup(setting))}
                  </Stack>
                </Stack>
              );
            })}
        </Stack>
      ) : (
        <Flex align="center" justify="center" mih="calc(100vh - 52px)">
          <Text size="sm">There are no settings for this page</Text>
        </Flex>
      )}
    </>
  );
}

export default ThemesSidenav;
