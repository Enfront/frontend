import { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface AcceptedCryptoAddresses {
  name: string;
  symbol: 'BTC';
  address: string;
  logo: string;
}

export interface BlacklistFormData {
  [type: string]: string;
  note: string;
  shop: string;
}

export interface BlacklistItem {
  ip_address?: string;
  email?: string;
  country?: string;
  paypal_email?: string;
  note?: string;
  created_at: string;
  ref_id: string;
}

export interface BlacklistOnSubmitData {
  type: string;
  value: string;
  note: string;
}

export interface BlacklistPagination {
  count: number;
  next?: string;
  previous?: string;
  results: BlacklistItem[];
}

export interface Collection {
  title: string;
  slug: string;
  products: Product[];
  ref_id: string;
}

export interface CollectionData {
  title: string;
  products: Product[] | string[];
}

export interface CommentFormData {
  comment: string;
}

export interface Country {
  id: number;
  num_code: number;
  iso_2: string;
  iso_3: string;
  name: string;
  continent: string;
  stripe_available: boolean;
  paypal_available: boolean;
}

export interface CryptoAdditionalData {
  providedComment?: string;
  consumedLightningAddress?: string;
}

export interface CryptoPayments {
  id: string;
  receivedDate: number;
  value: string;
  fee: string;
  status: 'Invalid' | 'Processing' | 'Settled';
  destination: string;
}

export interface CryptoTxnInfo {
  paymentMethod: string;
  cryptoCode: 'BTC';
  destination: string;
  paymentLink: string;
  rate: string;
  paymentMethodPaid: string;
  totalPaid: string;
  due: string;
  amount: string;
  networkFee: string;
  payments: CryptoPayments[];
  activated: boolean;
  additionalData: CryptoAdditionalData;
  status: 'New' | 'Processing' | 'Expired' | 'Invalid' | 'Settled';
}

export interface CreateShopFormData {
  name: string;
  email?: string;
  domain?: string;
  description?: string;
  currency?: string;
  country?: number;
}

export interface Currency {
  value: string;
  label: string;
}

export interface Customer {
  completed_order_count: number;
  user: User;
}

export interface CustomerDetails {
  all_order_count: number;
  completed_order_count: number;
  orders: OrderPagination;
  total_spent: 0;
  user: User;
}

export interface CustomerOrder {
  created_at: string;
  crypto?: null;
  currency: string;
  current_status: number;
  email: string;
  items: OrderItem[];
  ref_id: string;
  shop: OrderInfoShop;
  total: number;
}

export interface CustomerPagination {
  count: number;
  next?: string;
  previous?: string;
  results: User[];
}

export interface DashboardProduct extends Product {
  orders: number;
}

export interface DashboardStats {
  all_orders: number;
  past_orders: number[];
  total_profit: number;
  past_profit: number;
}

export interface EditUserData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface ImageType {
  dataURL: string;
  file: File;
}

export interface Item {
  created_at: number;
  key: string;
  recipient_email?: string;
  ref_id: string;
  status: number;
}

export interface LoginData {
  email: string;
  password: string;
  recaptcha?: string;
  shop?: boolean;
}

export interface Note {
  created_at: string;
  note: string;
  ref_id: string;
  user: User;
}

export interface Order {
  customer: Customer;
  created_at: string;
  currency: string;
  current_status: number;
  email: string;
  gateway: string;
  geo_data: OrderGeoData;
  paypal_email: string;
  items: OrderItem[];
  ref_id: string;
  shop: OrderInfoShop;
  statuses: OrderStatus[] | OrderComment[];
  total: number;
  updated_at: string;
}

export interface OrderComment {
  comment: string;
  created_at: string;
  ref_id: string;
  user: User;
}

export interface OrderGeoData {
  browser: string;
  city?: string;
  country?: string;
  ip_address: string;
  latitude: number;
  longitude: number;
  os: string;
  postal_code?: string;
  region?: string;
  using_vpn: boolean;
}

export interface OrderPagination {
  count: number;
  next?: string;
  previous?: string;
  results: Order[];
}

export interface OrderInfo {
  buyer: string;
  created_at: string;
  crypto: CryptoTxnInfo;
  currency: string;
  current_status: number;
  email: string;
  items: OrderItem[];
  ref_id: string;
  shop: OrderInfoShop;
  total: number;
}

export interface OrderInfoShop {
  name: string;
  domain: string;
  ref_id: string;
}

export interface OrderItem {
  available: boolean;
  current_status: number;
  description: string;
  images: OrderItemImage[];
  name: string;
  price: number;
  quantity: number;
  ref_id: string;
  slug: string;
}

export interface OrderItemImage {
  path: string;
  ref_id: string;
}

export interface OrderStatus {
  created_at: string;
  item?: OrderStatusItem;
  status: number;
}

export interface OrderStatusItem {
  available: boolean;
  description: string;
  images: OrderItemImage[];
  key: OrderStatusItemKey[];
  name: string;
  price: number;
  ref_id: string;
  slug: string;
}

export interface OrderStatusItemKey {
  created_at: string;
  key: string;
  recipient_email: string;
  ref_id: string;
  status: number;
}

export interface PayoutFormData {
  shop: string;
  amount: number;
  destination: string;
  currency: 'BTC' | string;
}

export interface PayoutHistory {
  amount: number;
  created_at: string;
  currency: string;
  destination: string;
  ref_id: string;
  status: number;
  updated_at: string;
}

export interface PayPalOnApprove {
  orderID: string;
  payerID: string;
  paymentID: string;
  billingToken: string;
  facilitatorAccessToken: string;
}

export interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface Product {
  description?: string;
  images: ProductImage[];
  keys: Item[];
  name: string;
  price: number;
  ref_id: string;
  slug: string;
  status: number;
  stock: number;
}

export interface ProductFormData {
  name: string;
  price: number;
  status: string;
  description?: string;
  keys?: string;
  images?: File;
  csv?: File;
  shop?: string;
  min_order_quantity?: number;
  max_order_quantity?: number;
}

export interface ProductImage {
  path: string;
  ref_id: string;
}

export interface ProductSelect extends ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  refId: string;
  value: string;
}

export interface RegisterData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
}

export interface ResetPasswordData {
  password: string;
  passwordConfirmation: string;
  ref_id?: string;
  token?: string;
}

export interface Setting {
  type: 'text' | 'textarea' | 'image' | 'radio' | 'select' | 'checkbox' | 'color' | 'range' | 'product';
  attribute: string;
  default?: string | boolean | number;
  id: string;
  label: string;
  placeholder?: string;
  info?: string;
  min?: number;
  max?: number;
  step?: number;
  choices?: SettingChoice[];
}

export interface SettingChoice {
  label: string;
  value: string | number | boolean;
}

export interface SettingsSchema {
  name: string;
  page: string;
  settings: Setting[];
}

export interface ShopCurrentTheme {
  description: string;
  developer: string;
  name: string;
  ref_id: string;
  updated_at: string;
}

export interface ShopData {
  currency: string;
  current_theme: ShopCurrentTheme;
  domain: string;
  email: string;
  name: string;
  ref_id: string;
  status: number;
  owner: ShopOwner;
  country: Country;
}

export interface ShopOwner {
  username: string;
  subscription_tier: number;
}

export interface ShopPaymentFormData {
  bitcoin_address: string;
  paypal_email: string;
}

export interface ShopSettingsFormData {
  name: string;
  email: string;
  status: string;
  domain?: string;
}

export interface ShopStatus {
  value: string;
  label: string;
}

export interface StatsCard {
  id: number;
  name: string;
  stat: DashboardStats | JSX.Element | string | number;
  icon: ReactNode;
}

export interface SubscriptionDetails {
  cancel_at_period_end: boolean;
  current_period_end: number;
  ref_id: string;
  subscription_id: string;
  total_fees: number;
}

export interface SubscriptionTier {
  id: number;
  name: string;
  plan_id: string | undefined;
  priceMonthly: number;
  description: string;
  includedFeatures: string[];
  notIncludedFeatures: string[];
}

export interface ThemeConfigFormData {
  theme: string | string[];
  shop: string;
  status: number;
  config: string;
}

export interface ThemeProductNew {
  id: string;
  item: boolean;
}

export interface ThemeTemplate {
  description: string;
  developer: string;
  name: string;
  ref_id: string;
  updated_at: string;
}

export interface User {
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  ref_id: string;
  subscription_tier: number;
  username: string;
  is_active: boolean;
}
