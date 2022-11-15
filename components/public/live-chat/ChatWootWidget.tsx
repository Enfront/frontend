import { useEffect } from 'react';

declare global {
  interface Window {
    chatwootSettings: {
      hideMessageBubble?: boolean;
      position?: 'right' | 'left';
      locale?: string;
      type?: 'standard' | 'expanded_bubble';
      darkMode?: 'auto' | 'light';
    };
    chatwootSDK: {
      run: ({ websiteToken, baseUrl }: RunParams) => void;
    };
  }
}

interface RunParams {
  websiteToken: string;
  baseUrl: string;
}

function ChatwootWidget(): null {
  useEffect(() => {
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right', // This can be left or right
      locale: 'en', // Language to be set
      type: 'standard', // [standard, expanded_bubble]
      darkMode: 'auto',
    };

    // eslint-disable-next-line func-names
    (function (d: Document, t: string) {
      const BASE_URL = 'https://app.chatwoot.com';
      const g = d.createElement(t) as HTMLScriptElement;
      const s: Element = d.getElementsByTagName(t)[0];

      g.src = `${BASE_URL}/packs/js/sdk.js`;
      g.defer = true;
      g.async = true;

      if (s && s.parentNode) {
        s.parentNode.insertBefore(g, s);
      }

      g.onload = () => {
        window.chatwootSDK.run({
          websiteToken: '69R1LDXVE44rFVQCup9cix2X',
          baseUrl: BASE_URL,
        });
      };
    })(document, 'script');
  }, []);

  return null;
}

export default ChatwootWidget;
