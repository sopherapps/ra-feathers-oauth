import feathers from '@feathersjs/client';
// import fetch from 'node-fetch';
import createFeathersClient from '../../components/create-feathers-client';

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
    by if clientType is socketIO', () => {});

    it('Has a featherjs configured client with the authOptions passed', () => {});
  });
});
