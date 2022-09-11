import { ChangeEvent, createContext, ReactNode, useContext, useState } from 'react';

import { Product } from '../types/types';

interface ThemeExport {
  editorViewport: string;
  fakeToFrame(event: any, id: string, type: string, attribute: string): void;
  iframeLoaded: boolean;
  sendToFrame(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | Product | string,
    id: string,
    type: string,
    attribute: string,
  ): void;
  setEditorViewport(editorViewport: string): void;
  setIframeLoaded(iframeLoaded: boolean): void;
  setThemePage(themePage: string): void;
  themePage: string;
}

interface ThemeProvider {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeExport>({
  editorViewport: 'desktop',
  fakeToFrame: () => undefined,
  iframeLoaded: false,
  setIframeLoaded: () => undefined,
  sendToFrame: () => undefined,
  setEditorViewport: () => undefined,
  setThemePage: () => undefined,
  themePage: 'index',
});

export function ThemeProvider({ children }: ThemeProvider): JSX.Element {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [editorViewport, setEditorViewport] = useState<string>('desktop');
  const [themePage, setThemePage] = useState<string>('index');

  const sendToFrame = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | Product | string,
    id: string,
    type: string,
    attribute: string,
  ): void => {
    const iframe = document.getElementById('preview') as HTMLIFrameElement;

    if (iframe && iframe.contentWindow) {
      if (type === 'checkbox') {
        const message = { id, type, attribute, value: (event as ChangeEvent<HTMLInputElement>).target.checked };
        iframe.contentWindow.postMessage(message, '*');
      } else if (type === 'select' || type === 'product' || type === 'color') {
        const message = { id, type, attribute, value: event };
        iframe.contentWindow.postMessage(message, '*');
      } else {
        const message = { id, type, attribute, value: (event as ChangeEvent<HTMLInputElement>).target.value };
        iframe.contentWindow.postMessage(message, '*');
      }
    }
  };

  const fakeToFrame = (event: any, id: string, type: string, attribute: string): void => {
    const iframe = document.getElementById('preview') as HTMLIFrameElement;

    if (iframe && iframe.contentWindow) {
      const message = { id, type, attribute, value: event };
      iframe.contentWindow.postMessage(message, '*');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        editorViewport,
        fakeToFrame,
        iframeLoaded,
        sendToFrame,
        setEditorViewport,
        setIframeLoaded,
        setThemePage,
        themePage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default function useTheme(): ThemeExport {
  return useContext(ThemeContext);
}
