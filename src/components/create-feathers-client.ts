import feathers, { authentication, rest, socketio } from '@feathersjs/client';
import * as io from 'socket.io-client';
import { ClientTypes, IFeathersClient } from '../types/feathers-client';

export default (
  apiUrl: string,
  {
    header = 'Authorization',
    jwtStrategy = 'jwt',
    locationErrorKey = 'error',
    locationKey = 'access_token',
    path = '/authentication',
    scheme = 'Bearer',
    storage = localStorage,
    storageKey = 'feathers-jwt',
  } = {},
  clientType: ClientTypes = ClientTypes.Rest,
  socketIOOptions: { timeout?: number } = {},
) => {
  const authOptions = {
    header,
    jwtStrategy,
    locationErrorKey,
    locationKey,
    path,
    scheme,
    storage,
    storageKey,
  };
  // @ts-ignore
  const app: IFeathersClient = feathers();

  // connection setup
  switch (clientType) {
    case ClientTypes.Rest:
      const restClient = rest(apiUrl);
      app.configure(restClient.fetch(window.fetch));
      break;

    case ClientTypes.SocketIO:
      const socket = io(apiUrl);
      const socketIOClient = socketio(socket, socketIOOptions);
      // @ts-ignore
      app.configure(socketIOClient);
      break;
  }

  // the auth client
  // @ts-ignore
  app.configure(authentication(authOptions));
  return app;
};
