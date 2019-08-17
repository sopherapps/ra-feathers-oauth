import createFeathersClient from '../../../components/create-feathers-client';
import createFeathersDataProvider from '../../../components/feathers-data-provider';
import { FeathersClient } from '../../../types/feathers-client';

describe('feathers-data-provider', () => {
  const DATA_PROVIDER_ACTIONS = {
    CREATE: 'CREATE',
    CREATE_MANY: 'CREATE_MANY',
    DELETE: 'DELETE',
    DELETE_MANY: 'DELETE_MANY',
    GET_LIST: 'GET_LIST',
    GET_MANY: 'GET_MANY',
    GET_MANY_REFERENCE: 'GET_MANY_REFERENCE',
    GET_ONE: 'GET_ONE',
    UPDATE: 'UPDATE',
    UPDATE_MANY: 'UPDATE_MANY',
  };
  const dataProviderOptions = {
    uploadsUrl: 'http://localhost:3030/uploads',
    multerFieldNameSetting: 'files',
    resourceUploadsForeignKeyMap: {},
    resourceUploadableFieldMap: {},
    resourcePrimaryKeyFieldMap: {},
    defaultPrimaryKeyField: 'id',
    ...DATA_PROVIDER_ACTIONS,
  };
  const apiUrl = 'http://localhost:3000';
  let feathersDataProvider: (
    type: any,
    resource: string,
    params?: any,
  ) => Promise<any>;
  let feathersClient: FeathersClient;
  const originalFetch = window.fetch;
  const mockFetch = jest.fn(async (url, options) => ({
    json: async () => ({ url, options }),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    window.fetch = mockFetch;
    feathersClient = createFeathersClient(apiUrl);
    // feathersClient.authenticate = jest.fn(async (data: any) => data);

    feathersDataProvider = createFeathersDataProvider(
      feathersClient,
      dataProviderOptions,
    );
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  describe('type: GET_LIST', () => {
    it('generates a query out of the params', () => {});
    it('outputs {data: feathersjsClient.service(resource).find({query})}', async () => {
      // feathersDataProvider(DATA_PROVIDER_ACTIONS.GET_LIST, );
    });
  });

  describe('type: GET_MANY', () => {
    it('generates a query out of the params.ids', () => {});
    it('outputs {data: feathersjsClient.service(resource).find({query})}', () => {});
  });

  describe('type: GET_ONE', () => {
    it('outputs {data: feathersjsClient.service(resource).get(params.id)}', () => {});
  });

  describe('type: GET_MANY_REFERENCE', () => {
    it('generates a query containing {[params.target]: params.id}', () => {});

    it('outputs {data: feathersjsClient.service(resource).find({query})}', () => {});
  });

  describe('type: UPDATE', () => {
    it(
      'outputs {data: feathersjsClient.service(resource).patch(params.id, data)}',
    );
    describe('uploads', () => {
      it('makes a POST to the uploadsUrl in case the resource has an uploadable field', () => {});

      it('outputs response from the upload if the resource is the same as the one on the uploadsUrl', () => {});

      // eslint-disable-next-line no-multi-str
      it('updates the data to include the output from the POST to the uploadsUrl\
      if resource is not the upload resource', () => {});
    });
  });

  describe('type: UPDATE_MANY', () => {
    it('generates a query out of the params.ids', () => {});
    it(
      'outputs {data: feathersjsClient.service(resource).patch(null, data, {query})}',
    );
    describe('uploads', () => {
      it('makes a POST to the uploadsUrl in case the resource has an uploadable field', () => {});

      it('outputs response from the upload if the resource is the same as the one on the uploadsUrl', () => {});

      // eslint-disable-next-line no-multi-str
      it('updates the data to include the output from the POST to the uploadsUrl\
      if resource is not the upload resource', () => {});
    });
  });

  describe('type: CREATE', () => {
    it('outputs {data: feathersjsClient.service(resource).create(data)}');
    describe('uploads', () => {
      it('makes a POST to the uploadsUrl in case the resource has an uploadable field', () => {});

      it('outputs response from the upload if the resource is the same as the one on the uploadsUrl', () => {});

      // eslint-disable-next-line no-multi-str
      it('updates the data to include the output from the POST to the uploadsUrl\
      if resource is not the upload resource', () => {});
    });
  });

  describe('type: DELETE', () => {
    it('outputs {data: feathersjsClient.service(resource).remove(params.id)}', () => {});
  });

  describe('type: DELETE_MANY', () => {
    it('generates a query out of the params', () => {});
    it('outputs {data: feathersjsClient.service(resource).remove(null, {query})}', () => {});
  });
});
