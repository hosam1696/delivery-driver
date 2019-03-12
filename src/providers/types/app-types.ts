export type DocumentDirection = 'ltr' | 'rtl';

export enum AppDirLang {
  'ar' = 'rtl',
  'en' = 'ltr',
  'rtl' = 'ar',
  'ltr' = 'en'
}

export interface RequestAction {
  accept: string,
  await: string,
  cancel: string
}
export enum OrderStatus {
  all,
  processing,
  shipping,
  completed
}

export enum appLangs {
  'ar',
  'en'
}

export type Langs = 'ar' | 'en';

export interface UserData {
    id: number,
    availability: 0 | 1,
    current_password?: any,
    "fullName": string,
    "userName": string,
    "age": string,
    "uniqueId": string,
    "nationalId": string,
    "phoneNumber": string,
    "photo": string,
    "created_at": string,
    "updated_at": string,
    "active": number,
    "new_photo": string,
    "company_id": number,
    "lat": string| number,
    "long": string | number,
    "api_token": string,
    "player_id": string,
    company?: Company,
    order_count?: any

}

export interface Company {
  id: number;
  role_id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  gender?: any;
  birth_date?: any;
  speciality_id: number;
  account_type: string;
  company_type: string;
  years: string;
  bank_number?: any;
  country?: any;
  state?: any;
  city?: any;
  pay_date: string;
  allow_date: string;
  bio?: any;
  lat: number;
  long: number;
  is_active: number;
  email_active: number;
  logo: string;
  settings?: any;
  created_at: string;
  updated_at: string;
  player_id?: any;
  range?: any;
  logisticsCompanyId?: any;
  lastMessageDate?: any;
  unreadMessagesWithMe?: any;
  avgRate: number;
  country_name: string;
  state_name: string;
  city_name: string;
  ordersCount: number;
  status?: any;
  is_new?: any;
}


export interface Sound {
  key: string;
  asset: string;
  isNative: boolean
}

export interface User {
  id: number;
  role_id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  gender: string;
  birth_date: string;
  speciality_id?: any;
  account_type: string;
  company_type: string;
  years: string;
  bank_number?: any;
  country?: any;
  state?: any;
  city?: any;
  pay_date?: any;
  allow_date?: any;
  bio?: any;
  lat: number;
  long: number;
  is_active: number;
  email_active: number;
  logo: string;
  settings?: any;
  created_at: string;
  updated_at: string;
  player_id?: any;
  range?: any;
  lastMessageDate: string;
  unreadMessagesWithMe: number;
  avgRate: number;
  country_name: string;
  state_name: string;
  city_name: string;
  ordersCount: number;
  status: string;
  is_new: string;
  countRate: number;
}

export interface DriverOrder {
  id: number;
  name?: null;
  order_id: number;
  delivery_company_service_id?: null;
  delivery_driver_id: number;
  user_id: number;
  company_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  waiting_time?: null;
  order: Order;
}
export interface Order {
  id: number;
  user_id: number;
  company_id: number;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  product_image: string;
  first_item: FirstItem;
  user?: User,
  items?: Item[]
}

export interface Item {
  id: number;
  product_id: number;
  order_id: number;
  qty: number;
  title: string;
  price: number;
  created_at: string;
  updated_at: string;
  deleted_at?: any;
  image: string;
}

export interface FirstItem {
  id: number;
  product_id: number;
  order_id: number;
  qty: number;
  title: string;
  price: number;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
}
