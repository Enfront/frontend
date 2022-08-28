import { ReactNode } from 'react';

import { Receipt, LayoutDashboard, Tag, Home, Users } from 'tabler-icons-react';

export interface DashboardRoutes {
  key: string;
  path: string;
  title: string;
  icon: ReactNode;
  color: string;
  breadcrumb: boolean;
  submenu: DashboardRoutes[];
}

export const dashboardNavTree: DashboardRoutes[] = [
  {
    key: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    icon: <Home size={21} />,
    color: 'blue',
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'items',
    path: '/dashboard/products',
    title: 'Products',
    icon: <Tag size={21} />,
    color: 'teal',
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'orders',
    path: '/dashboard/orders',
    title: 'Orders',
    icon: <Receipt size={21} />,
    color: 'pink',
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'customers',
    path: '/dashboard/customers',
    title: 'Customers',
    icon: <Users size={21} />,
    color: 'grape',
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'shop',
    path: '/dashboard/settings',
    title: 'Shop Settings',
    icon: <LayoutDashboard size={21} />,
    color: 'violet',
    breadcrumb: false,
    submenu: [],
  },
];

const navigationConfig = [...dashboardNavTree];

export default navigationConfig;
