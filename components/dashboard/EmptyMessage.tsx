import Link from 'next/link';

import { Button, Container, Stack, Text, Title } from '@mantine/core';

interface EmptyStateProps {
  buttonText?: string;
  description: string;
  title: string;
  url?: string;
  clickAction?: () => void;
}

EmptyMessage.defaultProps = {
  clickAction: undefined,
  buttonText: '',
  url: undefined,
};

function EmptyMessage({ buttonText, clickAction, description, title, url }: EmptyStateProps): JSX.Element {
  return (
    <Container className="flex h-full items-center justify-center" size="xs">
      <Stack align="center" justify="center" spacing="xs">
        <Title className="text-xl" order={1} mb={0}>
          {title}
        </Title>

        <Text align="center" color="gray" size="sm" mb={12} inline>
          {description}
        </Text>

        {buttonText && url && (
          <Link href={url} passHref>
            <Button component="a">{buttonText}</Button>
          </Link>
        )}

        {buttonText && clickAction && <Button onClick={clickAction}>{buttonText}</Button>}
      </Stack>
    </Container>
  );
}

export default EmptyMessage;
