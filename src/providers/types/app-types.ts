export type DocumentDirection = 'ltr' | 'rtl';

export enum AppDirLang {
  'ar' = 'rtl',
  'en' = 'ltr',
  'rtl' = 'ar',
  'ltr' = 'en'
}


export enum appLangs {
  'ar',
  'en'
}

export type Langs = 'ar' | 'en';
export interface UserData {
  
    id: number,
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
}
