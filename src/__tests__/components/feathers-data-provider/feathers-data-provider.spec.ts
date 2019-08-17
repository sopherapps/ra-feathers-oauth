import createFeathersClient from '../../../components/create-feathers-client';
import createFeathersDataProvider from '../../../components/feathers-data-provider';
import {
  convertListDataToReactAdminType,
  convertSingleDatumToReactAdminType,
} from '../../../components/feathers-data-provider/utils/ra-feathers-transpiler';
import { FeathersClient } from '../../../types/feathers-client';

jest.mock('../../../components/feathers-data-provider/utils/generate-query');
import generateQuery from '../../../components/feathers-data-provider/utils/generate-query';
const actualGenerateQuery = jest.requireActual(
  '../../../components/feathers-data-provider/utils/generate-query',
).default;

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
  const resource = 'churches';
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
    // @ts-ignore
    generateQuery.mockImplementation(actualGenerateQuery);

    feathersDataProvider = createFeathersDataProvider(
      feathersClient,
      dataProviderOptions,
    );
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  describe('type: GET_LIST', () => {
    const params = { filter: { id: 6 } };
    it('generates a query out of the params', async () => {
      try {
        await feathersDataProvider(
          DATA_PROVIDER_ACTIONS.GET_LIST,
          resource,
          params,
        );
      } catch (error) {
        console.log(error.message);
      }
      expect(generateQuery).toBeCalledWith(
        params,
        dataProviderOptions.defaultPrimaryKeyField,
      );
    });

    it('outputs {data: feathersjsClient.service(resource).find({query})}', async () => {
      feathersClient.service(resource).find = jest.fn(async (data: any) => [
        data,
      ]);
      const response = await feathersDataProvider(
        DATA_PROVIDER_ACTIONS.GET_LIST,
        resource,
        params,
      );
      const query = generateQuery(
        params,
        dataProviderOptions.defaultPrimaryKeyField,
      );
      const expectedResponse = await feathersClient
        .service(resource)
        .find({ query });
      expect(response).toMatchObject(
        convertListDataToReactAdminType(
          expectedResponse,
          dataProviderOptions.defaultPrimaryKeyField,
        ),
      );
    });
  });

  // First handle the testing of the ra-feathers-transpiler utility
  describe('type: GET_MANY', () => {
    const params = { ids: [6, 7, 17] };
    it('generates a query out of the params.ids', async () => {
      try {
        await feathersDataProvider(
          DATA_PROVIDER_ACTIONS.GET_MANY,
          resource,
          params,
        );
      } catch (error) {
        console.log(error.message);
      }
      expect(generateQuery).toBeCalledWith(
        params,
        dataProviderOptions.defaultPrimaryKeyField,
      );
    });

    it('outputs {data: feathersjsClient.service(resource).find({query})}', async () => {
      feathersClient.service(resource).find = jest.fn(async (data: any) => [
        data,
      ]);
      const response = await feathersDataProvider(
        DATA_PROVIDER_ACTIONS.GET_MANY,
        resource,
        params,
      );
      const query = generateQuery(
        params,
        dataProviderOptions.defaultPrimaryKeyField,
      );
      const expectedResponse = await feathersClient
        .service(resource)
        .find({ query });
      expect(response).toMatchObject(
        convertListDataToReactAdminType(
          expectedResponse,
          dataProviderOptions.defaultPrimaryKeyField,
        ),
      );
    });
  });

  describe('type: GET_ONE', () => {
    const params = { id: 2 };
    it('outputs {data: feathersjsClient.service(resource).get(params.id)}', async () => {
      feathersClient.service(resource).get = jest.fn(async (data: any) => data);
      const response = await feathersDataProvider(
        DATA_PROVIDER_ACTIONS.GET_ONE,
        resource,
        params,
      );
      const expectedResponse = await feathersClient
        .service(resource)
        .get(params.id);
      expect(response).toMatchObject(
        convertSingleDatumToReactAdminType(
          expectedResponse,
          dataProviderOptions.defaultPrimaryKeyField,
        ),
      );
    });
  });

  describe('type: GET_MANY_REFERENCE', () => {
    const params = { id: 5, target: 'location' };
    it('generates a query containing {[params.target]: params.id}', async () => {
      try {
        await feathersDataProvider(
          DATA_PROVIDER_ACTIONS.GET_MANY,
          resource,
          params,
        );
      } catch (error) {
        console.log(error.message);
      }
      expect(generateQuery).toBeCalledWith(
        params,
        dataProviderOptions.defaultPrimaryKeyField,
      );
    });

    it('outputs {data: feathersjsClient.service(resource).find({query})}', async () => {
      feathersClient.service(resource).find = jest.fn(async (data: any) => [
        data,
      ]);
      const response = await feathersDataProvider(
        DATA_PROVIDER_ACTIONS.GET_MANY_REFERENCE,
        resource,
        params,
      );
      let query = generateQuery(
        params,
        dataProviderOptions.defaultPrimaryKeyField,
      );
      query = { ...query, [params.target]: params.id };

      const expectedResponse = await feathersClient
        .service(resource)
        .find({ query });
      expect(response).toMatchObject(
        convertListDataToReactAdminType(
          expectedResponse,
          dataProviderOptions.defaultPrimaryKeyField,
        ),
      );
    });
  });

  describe('type: UPDATE', () => {
    const params = { id: 5, data: { name: 'John Doe' } };
    it('outputs {data: feathersjsClient.service(resource).patch(params.id, params.data)}', async () => {
      feathersClient.service(resource).patch = jest.fn(
        async (id: any, data: any) => ({ id, data }),
      );
      const response = await feathersDataProvider(
        DATA_PROVIDER_ACTIONS.UPDATE,
        resource,
        params,
      );
      const expectedResponse = await feathersClient
        .service(resource)
        .patch(params.id, params.data);
      expect(response).toMatchObject(
        convertSingleDatumToReactAdminType(
          expectedResponse,
          dataProviderOptions.defaultPrimaryKeyField,
        ),
      );
    });
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
    it('outputs {data: feathersjsClient.service(resource).patch(null, data, {query})}', () => {});
    describe('uploads', () => {
      it('makes a POST to the uploadsUrl in case the resource has an uploadable field', () => {});

      it('outputs response from the upload if the resource is the same as the one on the uploadsUrl', () => {});

      // eslint-disable-next-line no-multi-str
      it('updates the data to include the output from the POST to the uploadsUrl\
      if resource is not the upload resource', () => {});
    });
  });

  describe('type: CREATE', () => {
    it('outputs {data: feathersjsClient.service(resource).create(data)}', () => {});
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
