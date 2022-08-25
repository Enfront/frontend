import { Dispatch, SetStateAction } from 'react';

import { Button, Group, Modal, Text } from '@mantine/core';

interface ChangeThemeProps {
  changeTheme: (themeId: string) => void;
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  themeId: string;
}

function ChangeTheme({ changeTheme, opened, setOpened, themeId }: ChangeThemeProps): JSX.Element {
  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Change Theme" centered>
      <Text size="sm" mb={16}>
        By using the Save and Publish button, you will be changing the theme of your shop. Be sure the theme that is
        being published is the one you want to use for your shop.
      </Text>

      <Group position="right">
        <Button onClick={() => setOpened(false)} variant="outline" color="gray">
          Cancel
        </Button>

        <Button onClick={() => changeTheme(themeId)} color="yellow">
          Confirm
        </Button>
      </Group>
    </Modal>
  );
}

export default ChangeTheme;
