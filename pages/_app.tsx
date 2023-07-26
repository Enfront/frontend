import type { AppProps } from 'next/app';

import 'leaflet/dist/leaflet.css';

import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import ChatwootWidget from '&/components/public/live-chat/ChatWootWidget';
import { AuthProvider } from '&/contexts/AuthContext';
import { ShopProvider } from '&/contexts/ShopContext';
import { ThemeProvider } from '&/contexts/ThemeContext';

import '&/styles/globals.scss';

function Enfront({ Component, pageProps }: AppProps): JSX.Element {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: '_enfront_color_scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      <GoogleReCaptchaProvider reCaptchaKey="6LfyKAEeAAAAALsY50FzMgCWwmu27rg3B4yl-Vet">
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme,
              colors: {
                brand: [
                  '#d3e0fb',
                  '#bed1f9',
                  '#a8c1f7',
                  '#92b2f5',
                  '#7ca2f3',
                  '#6693f1',
                  '#2563eb',
                  '#1e50bc',
                  '#1a46a5',
                  '#133276',
                ],
              },
              fontFamily: 'Inter, sans-serif',
              headings: { fontFamily: 'Inter, sans-serif' },
              primaryColor: 'brand',
              spacing: { xs: '0.625rem', sm: '0.75rem', md: '1rem', lg: '1.25rem', xl: '1.5rem', xxl: '2rem' },
            }}
          >
            <ModalsProvider>
              <AuthProvider>
                <ShopProvider>
                  <ThemeProvider>
                    <Notifications position="top-right" />
                    <Component {...pageProps} />
                  </ThemeProvider>
                </ShopProvider>
              </AuthProvider>
            </ModalsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </GoogleReCaptchaProvider>

      <ChatwootWidget />
    </>
  );
}

export default Enfront;
