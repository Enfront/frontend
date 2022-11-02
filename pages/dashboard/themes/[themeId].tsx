import { useRouter } from 'next/router';

import { Stack } from '@mantine/core';

import useShop from '../../../contexts/ShopContext';
import useTheme from '../../../contexts/ThemeContext';
import { ProtectedRoute } from '../../../contexts/AuthContext';
import utils from '../../../utils/utils';

import ThemeEditorLayout from '../../../components/layouts/ThemeEditorLayout';

function ThemeId(): JSX.Element {
  const router = useRouter();

  const { themeId } = router.query;
  const { selectedShop } = useShop();
  const { editorViewport, setIframeLoaded, themePage } = useTheme();

  return (
    <ThemeEditorLayout
      tabTitle="Theme Editor | Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      {selectedShop.ref_id !== '' && themeId && (
        <Stack className="h-full" align="center" justify="center">
          <iframe
            id="preview"
            className={utils.classNames(
              // eslint-disable-next-line no-nested-ternary
              editorViewport === 'desktop'
                ? 'h-full w-full'
                : editorViewport === 'mobile'
                ? 'm-auto h-[812px] w-[375px]'
                : 'm-auto h-[1080px] w-[810px]',
              'border border-solid border-slate-200 transition-all duration-700',
            )}
            src={`${process.env.NEXT_PUBLIC_URL_SCHEME}${utils.slugify(selectedShop.name)}.${
              process.env.NEXT_PUBLIC_THEME_URL
            }/${themePage}?editor=true&themeId=${themeId}`}
            onLoad={() => setIframeLoaded(true)}
            title="Theme template preview"
            sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-modals"
          />
        </Stack>
      )}
    </ThemeEditorLayout>
  );
}

export default ProtectedRoute(ThemeId);
