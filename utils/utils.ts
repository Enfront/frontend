import axios from 'axios';

import { DashboardRoutes } from '../configs/NavigationConfig';

class Utils {
  static getRouteInfo(navTree: DashboardRoutes[], path: string): DashboardRoutes {
    return <DashboardRoutes>navTree.find((nav: DashboardRoutes) => {
      if (nav.submenu) {
        const checkSub = nav.submenu.find((sub: DashboardRoutes) => sub.path === path);
        if (checkSub) {
          return checkSub;
        }
      }

      // Matches first two slashes in path (EX: /dashboard/products/09892380 -> /dashboard/products)
      // Might have to change if we get 3 slashes deep
      const pathMatch = path.split('/').slice(0, 3).join('/');
      return nav.path === pathMatch;
    });
  }

  static tableSorter(a: string | number, b: string | number): number {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    if (typeof a === 'string' && typeof b === 'string') {
      const aLowerCase = a.toLowerCase();
      const bLowerCase = b.toLowerCase();
      const sortedList = bLowerCase > aLowerCase ? 1 : 0;

      return aLowerCase > bLowerCase ? -1 : sortedList;
    }

    return -1;
  }

  static classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
  }

  static getPayPalAccessToken = async (username: string, password: string): Promise<string> => {
    const axiosResponse = await axios({
      url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
      method: 'post',
      withCredentials: false,
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        'content-type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username,
        password,
      },
      params: {
        grant_type: 'client_credentials',
      },
    });

    return axiosResponse.data.access_token;
  };

  static slugify = (text: string): string => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };
}

export default Utils;
