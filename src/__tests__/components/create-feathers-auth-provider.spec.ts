import createFeathersAuthProvider from '../../components/create-feathers-auth-provider';
import createFeathersClient from '../../components/create-feathers-client';
import { FeathersClient } from '../../types/feathers-client';
const AUTH_ACTIONS = {
  AUTH_CHECK: 'AUTH_CHECK',
  AUTH_ERROR: 'AUTH_ERROR',
  AUTH_GET_PERMISSIONS: 'AUTH_GET_PERMISSIONS',
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
};

describe('feathers-auth-provider', () => {
  let feathersAuthProvider: (type: any, params: any) => Promise<any>;
  let feathersClient: FeathersClient;
  const originalFetch = window.fetch;
  const apiUrl = 'http://localhost:3000';
  const authProviderOptions = {
    permissionsField: 'roles',
    logoutOnForbidden: true,
    oauthStrategy: 'jwt',
    ...AUTH_ACTIONS,
  };
  const mockFetch = jest.fn(async (url, options) => ({
    json: async () => ({ url, options }),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    window.fetch = mockFetch;
    feathersClient = createFeathersClient(apiUrl);
    feathersClient.authenticate = jest.fn(async (data: any) => data);

    feathersAuthProvider = createFeathersAuthProvider(
      feathersClient,
      authProviderOptions,
    );
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  describe('login', () => {
    it('authenticates the feathersjs client passed to it', async () => {
      const access_token = 'some-random-token';
      await feathersAuthProvider(AUTH_ACTIONS.AUTH_LOGIN, {
        access_token,
      });
      expect(feathersClient.authenticate).toBeCalledWith(
        expect.objectContaining({
          strategy: authProviderOptions.oauthStrategy,
          access_token,
        }),
      );
    });
  });

  describe('authentication check', () => {
    it('calls the feathersjsClient.authenticate method without params', async () => {
      try {
        await feathersAuthProvider(AUTH_ACTIONS.AUTH_CHECK, {});
      } catch (error) {
        console.log(error.message);
      }
      expect(feathersClient.authenticate).toBeCalledWith();
    });
  });

  describe('logout', () => {
    it('calls the feathersjsClient logout method', async () => {
      feathersClient.logout = jest.fn();
      await feathersAuthProvider(AUTH_ACTIONS.AUTH_LOGOUT, {});
      expect(feathersClient.logout).toBeCalledWith();
    });
  });

  describe('authentication error', () => {
    it('rejects if the error is 401 type', async () => {
      await expect(
        feathersAuthProvider(AUTH_ACTIONS.AUTH_ERROR, { code: 401 }),
      ).rejects.toThrow();
    });
    it('rejects if the error is of 403 type', async () => {
      await expect(
        feathersAuthProvider(AUTH_ACTIONS.AUTH_ERROR, { code: 403 }),
      ).rejects.toThrow();
    });
    it('calls the logout method of the feathersClient if error is 401 type', async () => {
      feathersClient.logout = jest.fn();
      try {
        await feathersAuthProvider(AUTH_ACTIONS.AUTH_ERROR, { code: 401 });
      } catch (error) {
        console.log(error.message);
      }
      expect(feathersClient.logout).toBeCalledWith();
    });
    it('calls the logout method of the feathersClient if error is 403 type', async () => {
      feathersClient.logout = jest.fn();
      try {
        await feathersAuthProvider(AUTH_ACTIONS.AUTH_ERROR, { code: 403 });
      } catch (error) {
        console.log(error.message);
      }
      expect(feathersClient.logout).toBeCalledWith();
    });
    it('resolves for any other type of error', async () => {
      await expect(feathersAuthProvider(AUTH_ACTIONS.AUTH_ERROR, { code: 404 }))
        .resolves;
      await expect(feathersAuthProvider(AUTH_ACTIONS.AUTH_ERROR, { code: 500 }))
        .resolves;
    });
  });

  describe('permissions', () => {
    it("resolves with the authenticated user's permissions field", async () => {
      const user = { [authProviderOptions.permissionsField]: 'admin' };
      feathersClient.get = jest.fn(async configName => ({ user }));
      await expect(
        feathersAuthProvider(AUTH_ACTIONS.AUTH_GET_PERMISSIONS, {}),
      ).resolves.toBe(user[authProviderOptions.permissionsField]);
    });
    it('rejects if feathersjs client is not authenticated', async () => {
      feathersClient.get = jest.fn(async configName => ({}));
      await expect(
        feathersAuthProvider(AUTH_ACTIONS.AUTH_GET_PERMISSIONS, {}),
      ).rejects.toThrow('not logged in');
    });
  });
});
