// import createFeathersAuthProvider from '../../components/create-feathers-auth-provider';
// import { FeathersClient } from '../../typings/feathers-client';

// // I think this should be put in its own file
// const fakeFeathersClient: FeathersClient = {
//   authenticate: jest.fn(async (pass = true) => {
//     if (!pass) {
//       throw new Error('not authenticated');
//     }
//   }),
//   login: jest.fn(),
// };

describe('feathers-auth-provider', () => {
  // const feathersAuthProvider = createFeathersAuthProvider();
  describe('login', () => {
    it('authenticates the feathersjs client passed to it', () => {});
  });

  describe('authentication check', () => {
    it('resolves when the feathersjs client passed to it is authenticated', () => {});

    it('rejects when the feathersjs client passed to it is not authenticated', () => {});
  });

  describe('logout', () => {
    it('makes the feathersjs client passed to it unauthenticated', () => {});
  });

  describe('authentication error', () => {
    it('rejects if the error is 401 type', () => {});
    it('rejects if the error is of 403 type', () => {});
    it('makes the feathersjs client unauthenticated if error is 401 type', () => {});
    it('makes the feathersjs client unauthenticated if error is 403 type', () => {});
    it('resolves for any other type of error', () => {});
  });

  describe('permissions', () => {
    it("resolves with the authenticated user's permissions field", () => {});
    it('rejects if feathersjs client is not authenticated', () => {});
  });
});
