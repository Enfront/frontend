import type { AppProps } from 'next/app';

import 'leaflet/dist/leaflet.css';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ColorSchemeProvider, ColorScheme, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { useLocalStorage } from '@mantine/hooks';

import { AuthProvider } from '../contexts/AuthContext';
import { ShopProvider } from '../contexts/ShopContext';
import { ThemeProvider } from '../contexts/ThemeContext';

import ChatwootWidget from '../components/public/live-chat/ChatWootWidget';

import '../styles/globals.scss';

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
              fontFamily: 'Inter, sans-serif',
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
              headings: { fontFamily: 'Inter, sans-serif' },
              primaryColor: 'brand',
              spacing: { xs: 10, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 },
            }}
          >
            <NotificationsProvider position="top-right">
              <ModalsProvider>
                <AuthProvider>
                  <ShopProvider>
                    <ThemeProvider>
                      <Component {...pageProps} />
                    </ThemeProvider>
                  </ShopProvider>
                </AuthProvider>
              </ModalsProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </GoogleReCaptchaProvider>

      <ChatwootWidget />
    </>
  );
}

export default Enfront;
