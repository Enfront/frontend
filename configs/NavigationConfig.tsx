import { ReactNode } from 'react';

import { Receipt, LayoutDashboard, Tag, Home, Users, LayoutNavbar } from 'tabler-icons-react';

export interface DashboardRoutes {
  key: string;
  path?: string;
  title: string;
  icon?: ReactNode;
  color?: string;
  breadcrumb: boolean;
  submenu?: DashboardRoutes[];
}

export const dashboardNavTree: DashboardRoutes[] = [
  {
    key: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    icon: <Home size={21} />,
    color: 'teal',
    breadcrumb: false,
  },
  {
    key: 'products',
    title: 'Products',
    icon: <Tag size={21} />,
    color: 'blue',
    breadcrumb: false,
    submenu: [
      {
        key: 'all_products',
        path: '/dashboard/products',
        title: 'All Products',
        breadcrumb: false,
      },
      {
        key: 'collections',
        path: '/dashboard/collections',
        title: 'Collections',
        breadcrumb: false,
      },
    ],
  },
  {
    key: 'orders',
    path: '/dashboard/orders',
    title: 'Orders',
    icon: <Receipt size={21} />,
    color: 'indigo',
    breadcrumb: false,
  },
  {
    key: 'customers',
    path: '/dashboard/customers',
    title: 'Customers',
    icon: <Users size={21} />,
    color: 'violet',
    breadcrumb: false,
  },
  {
    key: 'themes',
    path: '/dashboard/themes',
    title: 'Themes',
    icon: <LayoutNavbar size={21} />,
    color: 'grape',
    breadcrumb: false,
  },
  {
    key: 'shop',
    path: '/dashboard/settings',
    title: 'Shop Settings',
    icon: <LayoutDashboard size={21} />,
    color: 'pink',
    breadcrumb: false,
  },
];

const navigationConfig = [...dashboardNavTree];

export default navigationConfig;
