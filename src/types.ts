export interface StrapiEnv {
  (key: string, defaultValue?: any): any;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
  array<T = any>(key: string, defaultValue?: T[]): T[];
  date(key: string, defaultValue?: Date): Date;
  json<T = any>(key: string, defaultValue?: T): T;
}
