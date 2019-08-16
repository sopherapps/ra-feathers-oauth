import feathers from '@feathersjs/client';
import nodeFetch from 'node-fetch';
import createFeathersClient from '../../components/create-feathers-client';
import { ClientTypes } from '../../types/feathers-client';

describe('create-feathers-client', () => {
  const originalFetch = window.fetch;
  const mockFetch = jest.fn(async (url, options) => ({
    json: async () => ({ url, options }),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    window.fetch = mockFetch;
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  describe('the client created', () => {
    it('Is an instance of the feathersjs/client', () => {
      const feathersClient = createFeathersClient('http://localhost:3000');
      // @ts-ignore
      const feathersClientInstance = feathers();
      expect(typeof feathersClient).toBe(typeof feathersClientInstance);
    });

    it('Has a configured rest client using window.fetch for the given apiUrl by default', async () => {
      const apiUrl = 'http://localhost:3000';
      const resource = 'beans';

      const feathersClient = createFeathersClient(apiUrl);
      expect(feathersClient.rest).not.toBe(undefined);
      try {
        await feathersClient.service(resource).find({});
      } catch (error) {
        console.log(error.message);
      }
      expect(mockFetch).toBeCalledWith(
        `${apiUrl}/${resource}`,
        expect.objectContaining({}),
      );
    });

    it('Has a configured socketio client for the given apiUrl\
    by if clientType is socketIO', async () => {
      /*
       * Sadly, mocking socketIO stuff is super-chaotic
       * Thus I will run only one test for socketio
       * with a real server.
       */
      const apiUrl = 'https://united-church-api.herokuapp.com';
      const resource = 'churches';

      // Check whether the url is avalaible
      const remoteResponse = await nodeFetch(`${apiUrl}/${resource}`, {
        method: 'OPTIONS',
      });
      if (remoteResponse.ok) {
        const feathersClient = createFeathersClient(
          apiUrl,
          undefined,
          ClientTypes.SocketIO,
        );
        try {
          await feathersClient.service(resource).find({});
        } catch (error) {
          console.log(error.message);
        }
        expect(mockFetch).not.toBeCalled();
        expect(feathersClient.io.io.uri).toBe(apiUrl);
      }
    }, 10000);

    it('Has a featherjs configured client with the authOptions passed', () => {
      const defaultAuthOptions = {
        storageKey: 'feathers-jwt',
        storage: localStorage,
        path: '/authentication',
        locationKey: 'access_token',
        locationErrorKey: 'error',
        jwtStrategy: 'jwt',
        header: 'Authorization',
        scheme: 'Bearer',
      };

      const apiUrl = 'http://localhost:3000';
      const feathersClient = createFeathersClient(apiUrl);
      expect(feathersClient.authentication.options).toMatchObject(
        expect.objectContaining(defaultAuthOptions),
      );
    });
  });
});
