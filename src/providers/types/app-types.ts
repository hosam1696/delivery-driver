export type DocumentDirection = 'ltr' | 'rtl';

export enum AppDirLang {
  'ar' = 'rtl',
  'en' = 'ltr'
}

export interface RequestAction {
  accept: string,
  await: string,
  cancel: string
}

export enum OrderStatus {
  init = 'init',
  returned = 'returned',
  canceled = 'canceled',
  completed = 'completed',
  refused = 'refused',
  accepted = 'accepted',
  received = 'received',
  processing = 'processing',
  ongoing = 'ongoing',
  waiting = 'waiting',
  delayed = 'delayed'
}

export enum appLangs {
  'ar',
  'en'
}

export type Langs = 'ar' | 'en';

export interface UserData {
  id: number,
  availability: 0 | 1 | number,
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
  "lat": string | number,
  "long": string | number,
  "api_token": string,
  "player_id": string,
  company?: Company,
  logistic_company_service?: any,
  order_count?: any,
  isRestaurantDelegate?: boolean,
  deliveryCost?: number
}

export interface LoginData {
  userName: string,
  password: string,
  player_id: string
}

export interface LoginResponse {
  success: boolean,
  message: string,
  data: { user: UserData, deliveryCost?: number },
  error?: string
}

export interface OrderStatusResponse {
  success: boolean,
  message: string,
  data: { order: Order },
  error?: string
}

export interface DriverOrderResponse {
  message: string,
  success: boolean,
  data: {orders:Array<DriverOrder&Order>},
  error?: string
}

export interface OrderDetailsResponse {
  message: string,
  success: boolean,
  data: { order: DriverOrder & Order },
  error?: string
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
  company_name?: string,
  status: string;
  created_at: string;
  updated_at: string;
  waiting_time?: null;
  comment?: string,
  order: Order;
}

export enum cameraType {
  PHOTOLIBRARY,
  CAMERA,
  SAVEDPHOTOALBUM
}

export type UploadedPhoto = 'photo' | 'idenity_image';
export interface Order {
  id: number;
  user_id: number;
  company_id: number;
  company?: any;
  comment?: string,
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
  deleted_at?: null;
  product_image: string;
  first_item?: FirstItem;
  user?: User,
  items?: Item[],
  lat?: number,
  lng?: number,
  moov_coupon?: any,
  user_total?: number,
  delivery_cost?: number,
  online_payment?: boolean,
  shipment?: boolean,
  added_value?: number,
  company_total?: number,
  original_total?: number,
  discount?: number
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
  extra?:any,
  serial?:string
}

export interface APP_PAGE {
  title: string,
  component: any,
  icon: string,
  pageStatus?: OrderStatus | string,
  pageCount?: number
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
  serial?:string
}

export enum EVENTS {
  UPDATE_STORAGE = 'update:storage',
  UPDATE_LANG = 'update:lang',
  HANDLE_UNAUTHORIZATION = 'handle:unauthorization',
  UPDATE_ROOT = 'update:root',
  UPDATE_ORDERS = 'update:orders',
  GET_WAITING_ORDERS = 'get:waitingorders',
  NOTIFICATION_POPUP = 'open-notification:popup',
  UPDATE_SPLASH = 'update:splashscreen',
  UPDATE_PAGE_COUNT = 'update:page:count'

}

export enum LOCAL_STORAGE {
  LANG = 'delivery:app:lang',
  USERDATA = 'delivery:user:data',
  API_TOKEN = 'delivery:api:token',
  FCM_TOKEN = 'delivery:fcm:token'
} 
