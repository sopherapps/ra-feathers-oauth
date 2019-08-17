import feathers, { authentication, rest, socketio } from '@feathersjs/client';
import * as io from 'socket.io-client';
import { ClientTypes, FeathersClient } from '../types/feathers-client';

export default (
  apiUrl: string,
  authOptions = {
    storageKey: 'feathers-jwt',
    storage: localStorage,
    path: '/authentication',
    locationKey: 'access_token',
    locationErrorKey: 'error',
    jwtStrategy: 'jwt',
    header: 'Authorization',
    scheme: 'Bearer',
  },
  clientType: ClientTypes = ClientTypes.Rest,
  socketIOOptions: { timeout?: number } = {},
) => {
  // @ts-ignore
  const app: FeathersClient = feathers();

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
