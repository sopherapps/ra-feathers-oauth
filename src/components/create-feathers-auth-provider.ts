import { FeathersClient } from '../types/feathers-client';

export default (
  app: FeathersClient,
  {
    permissionsField = 'roles',
    logoutOnForbidden = true,
    oauthStrategy = 'jwt',
    AUTH_LOGIN = 'AUTH_LOGIN',
    AUTH_LOGOUT = 'AUTH_LOGOUT',
    AUTH_GET_PERMISSIONS = 'AUTH_GET_PERMISSIONS',
    AUTH_ERROR = 'AUTH_ERROR',
    AUTH_CHECK = 'AUTH_CHECK',
  },
) => async (type: any, params: any) => {
  switch (type) {
    case AUTH_LOGIN:
      // it expects a call userLogin({ access_token });
      // in the on the React Admin custom Login screen
      const { access_token } = params;
      return await app.authenticate({
        strategy: oauthStrategy,
        access_token,
      });

    case AUTH_LOGOUT:
      return app.logout();

    case AUTH_CHECK:
      await app.authenticate();
      return;

    case AUTH_ERROR:
      const { code } = params;
      if (code === 401 || (logoutOnForbidden && code === 403)) {
        app.logout();
        throw new Error(`${code} Authentication code`);
      }
      return;

    case AUTH_GET_PERMISSIONS:
      const { user } = await app.get('authentication');
      if (!user) {
        throw new Error('User is not logged in');
      }
      return user[permissionsField];

    default:
      throw new Error(`Unsupported FeathersJS authClient action type ${type}`);
  }
};
