import { ComponentProps, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

import { ActionIcon, Grid, Group, InputWrapper, MantineTheme, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { Icon as TablerIcon, Photo, Trash, Upload, X } from 'tabler-icons-react';
import axios from 'axios';

import { ImageType, Product, ProductImage } from '../../../types/types';

interface ImagesProps {
  getViewedProduct: () => void;
  images: ImageType[];
  setImages: Dispatch<SetStateAction<ImageType[]>>;
  viewedProduct: Product;
}

function Images({ getViewedProduct, images, setImages, viewedProduct }: ImagesProps): JSX.Element {
  const theme = useMantineTheme();

  const getBase64 = (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.addEventListener('load', () => resolve(String(reader.result)));
      reader.readAsDataURL(file);
    });
  };

  const getListFiles = (files: File[]): Promise<void> => {
    const promiseFiles: Array<Promise<string>> = [];

    for (let i = 0; i < files.length; i += 1) {
      promiseFiles.push(getBase64(files[i]));
    }

    return Promise.all(promiseFiles).then((fileListBase64: Array<string>) => {
      fileListBase64.map((base64, index) =>
        setImages((prev: ImageType[]) => [
          ...prev,
          {
            dataURL: base64,
            file: files[index],
          },
        ]),
      );
    });
  };

  const getIconColor = (fileStatus: DropzoneStatus, iconTheme: MantineTheme): string => {
    if (fileStatus.accepted) {
      return iconTheme.colors.blue[theme.colorScheme === 'dark' ? 4 : 6];
    }

    if (fileStatus.rejected) {
      return theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6];
    }

    if (theme.colorScheme === 'dark') {
      return theme.colors.dark[0];
    }

    return theme.colors.gray[7];
  };

  const ImageUploadIcon = ({ status, ...props }: ComponentProps<TablerIcon> & { status: DropzoneStatus }) => {
    if (status.accepted) {
      return <Upload {...props} />;
    }

    if (status.rejected) {
      return <X {...props} />;
    }

    return <Photo {...props} />;
  };

  const removeImageFromUpload = (index: number): void => {
    const reducedImages = [...images];
    reducedImages.splice(index, 1);
    setImages(reducedImages);
  };

  const deleteImage = (imageId: string): void => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/files/${imageId}`)
      .then(() => {
        getViewedProduct();
      })
      .catch(() => {
        showNotification({
          title: 'Image Could Not Be Deleted!',
          message: 'There was an issue deleting your image.',
          color: 'red',
        });
      });
  };

  return (
    <>
      <InputWrapper label="Upload Images">
        <Dropzone
          className="disabled:opacity-50"
          onDrop={(files) => getListFiles(files)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          disabled={images.length >= 8}
        >
          {(status: DropzoneStatus) => (
            <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
              <ImageUploadIcon status={status} size={80} style={{ color: getIconColor(status, theme) }} />

              <div>
                <Text size="xl" inline>
                  Drag images here or click to select files
                </Text>

                <Text size="sm" color="dimmed" inline mt={7}>
                  Upload up to 8 images, each file should not exceed 5mb
                </Text>
              </div>
            </Group>
          )}
        </Dropzone>
      </InputWrapper>

      {images.length > 0 && (
        <Group>
          {images.map((image: ImageType, index: number) => (
            <div className="relative inline-block aspect-square h-48 overflow-hidden rounded" key={image.dataURL}>
              <span
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white
                  bg-opacity-90 text-center opacity-0 duration-300 hover:opacity-100"
              >
                <ActionIcon variant="transparent" color="red" size="sm">
                  <Trash onClick={() => removeImageFromUpload(index)} aria-label="Remove image" />
                </ActionIcon>
              </span>

              <Image src={image.dataURL} layout="fill" objectFit="cover" alt={`Product image ${index + 1}`} />
            </div>
          ))}
        </Group>
      )}

      {viewedProduct.images.length > 0 && (
        <InputWrapper className="mb-8" label="Uploaded Images">
          <Group>
            {viewedProduct.images.map((image: ProductImage, index: number) => (
              <div className="relative inline-block aspect-square h-48 overflow-hidden rounded" key={image.path}>
                <span
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white
                  bg-opacity-90 text-center opacity-0 duration-300 hover:opacity-100"
                >
                  <ActionIcon variant="transparent" color="red" size="sm">
                    <Trash onClick={() => deleteImage(image.ref_id)} aria-label="Remove image" />
                  </ActionIcon>
                </span>

                <Image
                  src={`${process.env.NEXT_PUBLIC_AWS_IMAGE_URL}${image.path}`}
                  layout="fill"
                  objectFit="cover"
                  alt={`Product image ${index + 1}`}
                />
              </div>
            ))}
          </Group>
        </InputWrapper>
      )}
    </>
  );
}

export default Images;
