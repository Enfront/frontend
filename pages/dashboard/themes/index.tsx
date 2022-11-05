import { Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import ThemeSettings from '../../../components/dashboard/themes/ThemeSettings';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { ProtectedRoute } from '../../../contexts/AuthContext';

function Index(): JSX.Element {
  const isDesktop = useMediaQuery('(min-width: 900px)');

  return (
    <DashboardLayout
      tabTitle="All Themes | Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Title className="text-2xl" order={1} mb={isDesktop ? 48 : 24}>
        Theme Settings
      </Title>

      <ThemeSettings isDesktop={isDesktop} />
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
