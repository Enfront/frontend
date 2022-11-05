import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Badge, Button, Flex, Group, Grid, Paper, Text, Title } from '@mantine/core';
import axios, { AxiosError, AxiosResponse } from 'axios';

import useShop from '../../../contexts/ShopContext';
import ChangeTheme from './ChangeTheme';
import { ThemeTemplate } from '../../../types/types';

interface ThemeSettingsProps {
  isDesktop: boolean;
}

function ThemeSettings({ isDesktop }: ThemeSettingsProps): JSX.Element {
  const router = useRouter();

  const { getUserShops, selectedShop } = useShop();

  const [themeId, setThemeId] = useState<string>('');
  const [templates, setTemplates] = useState<ThemeTemplate[]>([]);
  const [changeThemeVisible, setChangeThemeVisible] = useState<boolean>(false);

  const checkIfCanPublish = (themeRefId: string): void => {
    if (selectedShop.current_theme.ref_id === themeRefId) {
      setThemeAssociation(themeRefId);
    } else {
      setThemeId(themeRefId);
      setChangeThemeVisible(true);
    }
  };

  const setThemeAssociation = (themeRefId: string): void => {
    const formData = {
      shop: selectedShop.ref_id,
      theme: themeRefId,
      status: 1,
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/themes/config`, formData)
      .then(() => {
        router.push(`/dashboard/themes/${themeRefId}`);
        getUserShops();
      })
      .catch((error: AxiosError) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  useEffect(() => {
    const getThemeTemplates = (): void => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/themes`)
        .then((response: AxiosResponse) => {
          setTemplates(response.data.data);
        })
        .catch((error: AxiosError) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    };

    getThemeTemplates();
  }, [selectedShop]);

  return (
    <>
      <Grid>
        {templates.map((template: ThemeTemplate) => {
          return (
            <Grid.Col span={12} md={4} key={template.ref_id}>
              <Paper shadow="xs" p="lg" withBorder>
                <Group position="apart">
                  <Title className="text-xl" order={2}>
                    {template.name}
                  </Title>

                  {selectedShop.current_theme.ref_id === template.ref_id && (
                    <Badge color="green" radius="xs">
                      Active Theme
                    </Badge>
                  )}
                </Group>

                <Text size="sm" mt={12}>
                  {template.description}
                </Text>

                <Flex direction={isDesktop ? 'row' : 'column'} gap={8} mt={12}>
                  {selectedShop.current_theme.ref_id !== template.ref_id && (
                    <Button onClick={() => checkIfCanPublish(template.ref_id)} variant="outline" fullWidth>
                      Publish Theme
                    </Button>
                  )}

                  <Link href={`/dashboard/themes/${template.ref_id}`} passHref>
                    <Button component="a" fullWidth>
                      Edit Theme
                    </Button>
                  </Link>
                </Flex>
              </Paper>
            </Grid.Col>
          );
        })}
      </Grid>

      <ChangeTheme
        changeTheme={setThemeAssociation}
        opened={changeThemeVisible}
        setOpened={setChangeThemeVisible}
        themeId={themeId}
      />
    </>
  );
}

export default ThemeSettings;
