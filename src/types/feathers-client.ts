import feathers, {
  authentication,
  errors,
  primus,
  rest,
  socketio,
} from '@feathersjs/client';

type _FeathersClient = typeof feathers;
export type IFeathersAuthenticationClient = typeof authentication;
export type IFeathersErrors = typeof errors;
export type IFeathersPrimusClient = typeof primus;
export type IFeathersRestClient = typeof rest;
export type IFeathersSocketIOClient = typeof socketio;

export interface IPaginatedResponse {
  total: number;
  skip: number;
  limit: number;
  data: Array<{ [key: string]: any }>;
}

export interface IParams {
  query?: { [key: string]: any };
  [key: string]: any;
}

export interface IService {
  find: (params: IParams) => Promise<IPaginatedResponse | any[]>;
  get: (
    id: string | number,
    params?: IParams,
  ) => Promise<{ [key: string]: any }>;
  create: (data: any, params?: IParams) => Promise<{ [key: string]: any }>;
  update: (
    id: string | number | null,
    data: any,
    params?: IParams,
  ) => Promise<{ [key: string]: any } | { [key: string]: any }[]>;
  patch: (
    id: string | number | null,
    data: any,
    params?: IParams,
  ) => Promise<{ [key: string]: any } | { [key: string]: any }[]>;
  remove: (
    id: string | number | null,
    params?: IParams,
  ) => Promise<{ [key: string]: any } | { [key: string]: any }[]>;
}

export enum ClientTypes {
  Rest = 'rest',
  SocketIO = 'SocketIO',
}

export interface IFeathersClient extends _FeathersClient {
  [x: string]: any;
  configure: (
    config:
      | IFeathersAuthenticationClient
      | IFeathersPrimusClient
      | IFeathersRestClient
      | IFeathersSocketIOClient,
  ) => void;
  service: (resource: string) => IService;
  authenticate: (data?: any) => Promise<any>;
  login: () => Promise<any>;
  logout: () => Promise<any>;
  get: (configName: string) => Promise<{ user?: { [key: string]: any } }>;
}
