export interface AccountRoutes {
  key: string;
  path: string;
  title: string;
}

export const accountNavTree: AccountRoutes[] = [
  {
    key: 'account',
    path: '/dashboard/account',
    title: 'Account',
  },
];

const accountNavigationConfig = [...accountNavTree];

export default accountNavigationConfig;
