import { Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';

import { Group, Input, NumberInput, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';

import { ProductFormData } from '../../../types/types';

const QuillNoSSRWrapper = dynamic(() => import('@mantine/rte'), {
  ssr: false,
  loading: () => null,
});

interface GeneralInformationProps {
  description: string;
  form: UseFormReturnType<ProductFormData>;
  setDescription: Dispatch<SetStateAction<string>>;
  shopCurrency: string;
}

function GeneralInformation({ description, form, setDescription, shopCurrency }: GeneralInformationProps): JSX.Element {
  return (
    <>
      <Group grow>
        <TextInput placeholder="Product Name" label="Name" required {...form.getInputProps('name')} />

        <NumberInput
          label="Price"
          defaultValue={0.5}
          min={0.5}
          step={0.01}
          max={100000}
          precision={2}
          stepHoldDelay={500}
          stepHoldInterval={(t: number) => Math.max(1000 / t ** 2, 25)}
          parser={(value: string | undefined) => value?.replace(/[$£€]\s?|(,*)/g, '')}
          formatter={(value: string | undefined) =>
            !Number.isNaN(parseFloat(value as string))
              ? `${getSymbolWithIsoCode(shopCurrency) + value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : getSymbolWithIsoCode(shopCurrency)
          }
          required
          {...form.getInputProps('price')}
        />
      </Group>

      <Input.Wrapper id="description" label="Description">
        <QuillNoSSRWrapper
          id="description"
          className="h-72 overflow-y-auto"
          value={description}
          onChange={setDescription}
        />
      </Input.Wrapper>
    </>
  );
}

export default GeneralInformation;
