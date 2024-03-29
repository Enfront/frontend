import Image from 'next/image';
import Link from 'next/link';

import { Button, Container, Group, Text } from '@mantine/core';

import useAuth from '&/contexts/AuthContext';

function PublicHeader(): JSX.Element {
  const { isAuthenticated, isProcessing, logout } = useAuth();

  return (
    <header className="py-10">
      <Container size="xl">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label="Home">
              <Image className="w-auto" src="/logo.png" width="135" height="40" alt="Enfront logo" />
            </Link>

            <div className="hidden md:flex md:gap-x-6">
              <Link href="#features">
                <Text color="gray" size="sm">
                  Features
                </Text>
              </Link>

              <Link href="#pricing">
                <Text color="gray" size="sm">
                  Pricing
                </Text>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-x-5 md:gap-x-8">
            {isAuthenticated && !isProcessing ? (
              <Group>
                <Button onClick={logout} variant="subtle">
                  Logout
                </Button>

                <Link href="/dashboard" passHref>
                  <Button component="a">Dashboard</Button>
                </Link>
              </Group>
            ) : (
              <>
                <div className="hidden md:block">
                  <Link href="/sign-in">
                    <Text color="gray" size="sm">
                      Sign In
                    </Text>
                  </Link>
                </div>

                <Link href="/register">
                  <Button radius="xl" component="a">
                    Get started today
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default PublicHeader;
