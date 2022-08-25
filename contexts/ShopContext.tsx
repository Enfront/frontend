import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import axios, { AxiosResponse } from 'axios';

import useAuth from './AuthContext';
import { ShopData } from '../types/types';

interface ShopExports {
  getUserShops(): Promise<void>;
  setSelectedShopByIdOrData(shopToBeSelected: string | ShopData): void;
  selectedShop: ShopData;
  shopData: ShopData[];
  shopProcessing: boolean;
}

interface ShopProvider {
  children: ReactNode;
}

const initialSelectedShop: ShopData = {
  currency: 'USD',
  country: {
    id: 0,
    num_code: 0,
    iso_2: '',
    iso_3: '',
    name: '',
    continent: '',
    stripe_available: false,
    paypal_available: false,
  },
  current_theme: {
    description: '',
    developer: '',
    name: '',
    ref_id: '',
    updated_at: '',
  },
  domain: '',
  email: '',
  name: '',
  ref_id: '',
  status: 0,
  owner: {
    username: '',
    subscription_tier: 0,
  },
};

export const ShopContext = createContext<ShopExports>({
  selectedShop: initialSelectedShop,
  shopData: [],
  shopProcessing: true,
  getUserShops: async () => undefined,
  setSelectedShopByIdOrData: () => undefined,
});

export function ShopProvider({ children }: ShopProvider): JSX.Element {
  const { isProcessing, isAuthenticated } = useAuth();

  const [shopData, setShopData] = useState<ShopData[]>([initialSelectedShop]);
  const [selectedShop, setSelectedShop] = useState<ShopData>(initialSelectedShop);
  const [shopProcessing, setShopProcessing] = useState<boolean>(true);

  const setSelectedShopByIdOrData = (shopToBeSelected: string | ShopData): void => {
    if (typeof shopToBeSelected === 'string' && shopToBeSelected !== '') {
      shopData.forEach((shop: ShopData) => {
        if (shop.ref_id === shopToBeSelected) {
          // router.push('/dashboard').then(() => {
          setSelectedShop(shop);
          localStorage.setItem('_enfront_ssid', shopToBeSelected);
          // });
        }
      });
    } else if (typeof shopToBeSelected === 'object') {
      // router.push('/dashboard').then(() => {
      setSelectedShop(shopToBeSelected);
      localStorage.setItem('_enfront_ssid', shopToBeSelected.ref_id);
      // });
    }
  };

  const getUserShops = useCallback(async (): Promise<void> => {
    if (!isProcessing && isAuthenticated) {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/shops`)
        .then((response: AxiosResponse) => {
          setShopData(response.data.data);

          if (response.status === 204) {
            setSelectedShop(initialSelectedShop);
          }

          setShopProcessing(false);
        })
        .catch(() => {
          setShopProcessing(false);
        });
    }
  }, [isAuthenticated, isProcessing]);

  useEffect(() => {
    getUserShops();
  }, [getUserShops]);

  useEffect(() => {
    const getSelectedShop = (): void => {
      let shopFound = false;
      const selectedShopByStorage = localStorage.getItem('_enfront_ssid');

      if (!shopProcessing && shopData && shopData.length > 0) {
        if (selectedShopByStorage === null) {
          setSelectedShop(shopData[0]);
          localStorage.setItem('_enfront_ssid', shopData[0].ref_id);
        } else {
          shopData.forEach((shop: ShopData) => {
            if (selectedShopByStorage === shop.ref_id) {
              setSelectedShopByIdOrData(selectedShopByStorage);
              shopFound = true;
            }
          });

          if (!shopFound) {
            setSelectedShop(shopData[0]);
            localStorage.removeItem('_enfront_ssid');
          }
        }
      }
    };

    getSelectedShop();
  }, [shopProcessing, shopData]);

  return (
    <ShopContext.Provider
      value={{
        selectedShop,
        shopData,
        shopProcessing,
        getUserShops,
        setSelectedShopByIdOrData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export default function useShop(): ShopExports {
  return useContext(ShopContext);
}
