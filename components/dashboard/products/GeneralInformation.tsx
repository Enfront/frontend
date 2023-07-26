import { Group, Input, NumberInput, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { getSymbolWithIsoCode } from 'jkshop-country-list/dist/countryFinder';

import { ProductFormData } from '&/types/types';

interface GeneralInformationProps {
  form: UseFormReturnType<ProductFormData>;
  shopCurrency: string;
}

function GeneralInformation({ form, shopCurrency }: GeneralInformationProps): JSX.Element {
  const descriptionEditor = useEditor({
    extensions: [StarterKit],
    content: form.values.description,
    onUpdate({ editor }) {
      form.setFieldValue('description', editor.getHTML());
    },
  });

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
          parser={(value: string | '') => value?.replace(/[$£€]\s?|(,*)/g, '')}
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
        <RichTextEditor editor={descriptionEditor}>
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />
        </RichTextEditor>

        {/* <QuillNoSSRWrapper */}
        {/*  id="description" */}
        {/*  className="h-72 overflow-y-auto" */}
        {/*  value={description} */}
        {/*  onChange={setDescription} */}
        {/* /> */}
      </Input.Wrapper>
    </>
  );
}

export default GeneralInformation;
