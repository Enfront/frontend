import { Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';

import { Group, InputWrapper, NumberInput, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';

const QuillNoSSRWrapper = dynamic(() => import('@mantine/rte'), {
  ssr: false,
  loading: () => null,
});

interface GeneralInformationProps {
  description: string;
  form: UseFormReturnType<{ name: string; price: number; keys: string; status: string }>;
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
          defaultValue={0.49}
          min={0.49}
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

      <InputWrapper id="description" label="Description">
        <QuillNoSSRWrapper
          id="description"
          className="h-72 overflow-y-auto"
          value={description}
          onChange={setDescription}
        />
      </InputWrapper>
    </>
  );
}

export default GeneralInformation;
