import feathers, {
  authentication,
  errors,
  primus,
  rest,
  socketio,
} from '@feathersjs/client';

type _FeathersClient = typeof feathers;
type _FeathersAuthenticationClient = typeof authentication;
type _FeathersErrors = typeof errors;
type _FeathersPrimusClient = typeof primus;
type _FeathersRestClient = typeof rest;
type _FeathersSocketIOClient = typeof socketio;

export interface PaginatedResponse {
  total: number;
  skip: number;
  limit: number;
  data: Array<{ [key: string]: any }>;
}

export interface Params {
  query?: { [key: string]: any };
  [key: string]: any;
}

export interface Service {
  find: (params: Params) => Promise<PaginatedResponse | any[]>;
  get: (
    id: string | number,
    params?: Params,
  ) => Promise<{ [key: string]: any }>;
  create: (data: any, params?: Params) => Promise<{ [key: string]: any }>;
  update: (
    id: string | number | null,
    data: any,
    params?: Params,
  ) => Promise<{ [key: string]: any } | [{ [key: string]: any }]>;
  patch: (
    id: string | number | null,
    data: any,
    params?: Params,
  ) => Promise<{ [key: string]: any } | [{ [key: string]: any }]>;
  remove: (
    id: string | number | null,
    params?: Params,
  ) => Promise<{ [key: string]: any } | [{ [key: string]: any }]>;
}

export enum ClientTypes {
  Rest = 'rest',
  SocketIO = 'SocketIO',
}

export interface FeathersAuthenticationClient
  extends _FeathersAuthenticationClient {}

export interface FeathersErrors extends _FeathersErrors {}

export interface FeathersPrimusClient extends _FeathersPrimusClient {}

export interface FeathersRestClient extends _FeathersRestClient {}

export interface FeathersSocketIOClient extends _FeathersSocketIOClient {}

export interface FeathersClient extends _FeathersClient {
  [x: string]: any;
  configure: (
    config:
      | FeathersAuthenticationClient
      | FeathersPrimusClient
      | FeathersRestClient
      | FeathersSocketIOClient,
  ) => void;
  service: (resource: string) => Service;
  authenticate: (data?: any) => Promise<any>;
  login: () => Promise<any>;
  logout: () => Promise<any>;
  get: (configName: string) => Promise<{ user?: { [key: string]: any } }>;
}
