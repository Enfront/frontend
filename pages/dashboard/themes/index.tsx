import { Title } from '@mantine/core';

import { ProtectedRoute } from '../../../contexts/AuthContext';

import ThemeSettings from '../../../components/dashboard/themes/ThemeSettings';
import DashboardLayout from '../../../components/layouts/DashboardLayout';

function Index(): JSX.Element {
  return (
    <DashboardLayout
      tabTitle="Dashboard - Enfront"
      metaDescription="Welcome back, we&#39;re excited to help you with all your business needs."
    >
      <Title order={1}>Theme Settings</Title>
      <ThemeSettings />
    </DashboardLayout>
  );
}

export default ProtectedRoute(Index);
