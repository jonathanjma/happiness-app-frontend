export interface Setting {
  id: number;
  key: string;
  enabled: boolean;
  value: string;
  userId: number;
}

export interface SettingShort {
  key: string;
  enabled: boolean;
  value: string;
}
