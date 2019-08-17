import { IFeathersClient } from '../../../types/feathers-client';
import createFeathersClient from '../../create-feathers-client';
import createFeathersDataProvider from '../index';
import {
  convertListDataToReactAdminType,
  convertSingleDatumToReactAdminType,
} from '../utils/ra-feathers-transpiler';

jest.mock('../../../components/feathers-data-provider/utils/generate-query');
import generateQuery from '../utils/generate-query';
import uploadRelatedFiles from '../utils/upload-related-files';
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
  const resource = 'churches';
  const uploadsResource = 'uploads';
  const dataProviderOptions = {
    uploadsUrl: `http://localhost:3030/${uploadsResource}`,
    multerFieldNameSetting: 'files',
    resourceUploadsForeignKeyMap: {
      [resource]: 'name',
      [uploadsResource]: 'name',
    },
    resourceUploadableFieldMap: {
      [resource]: 'logo',
      [uploadsResource]: 'uploadName',
    },
    resourcePrimaryKeyFieldMap: {},
    defaultPrimaryKeyField: '_id',
    ...DATA_PROVIDER_ACTIONS,
  };
  const apiUrl = 'http://localhost:3000';

  let feathersDataProvider: (
    type: any,
    resource: string,
    params?: any,
  ) => Promise<any>;
  let feathersClient: IFeathersClient;

  const originalFetch = window.fetch;
  const mockFetch = jest.fn(async (url, options) => ({
    json: async () => options.body && Array.from(options.body.values()),
  }));

  const dummyFile = new File([''], 'duumy-file', { type: 'text/html' });
  const file = { ...dummyFile, rawFile: dummyFile };

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
    beforeEach(() => {
      feathersClient.service(resource).patch = jest.fn(
        async (id: any, data: any) => data,
      );
    });

    it('outputs {data: feathersjsClient.service(resource).patch(params.id, params.data)}\
     with uploadable field updated to the foreignKey of the uploaded file', async () => {
      const params = {
        id: 5,
        data: { name: 'John Doe', logo: file },
      };
      const uploadableField =
        dataProviderOptions.resourceUploadableFieldMap[resource];
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
          { ...expectedResponse, [uploadableField]: file.rawFile.name },
          dataProviderOptions.defaultPrimaryKeyField,
        ),
      );
    });
    describe('uploads', () => {
      it('throws error if the resource is the same as the one on the uploadsUrl', async () => {
        const params = {
          id: 5,
          data: { title: 'John Doe Photo', uploadsName: file },
        };
        await expect(
          feathersDataProvider(
            DATA_PROVIDER_ACTIONS.UPDATE,
            uploadsResource,
            params,
          ),
        ).rejects.toThrow('editting');
      });
    });
  });

  describe('type: UPDATE_MANY', () => {
    const params = {
      ids: [6, 7, 17],
      data: { logo: file, address: 'Plot 5, Chwa II road' },
    };

    beforeEach(() => {
      feathersClient.service(resource).patch = jest.fn(
        async (_id: any, data: any, extraParams: any) => {
          const idField = dataProviderOptions.defaultPrimaryKeyField;
          return (
            extraParams.query &&
            extraParams.query[idField] &&
            Array.isArray(extraParams.query[idField].$in) &&
            extraParams.query[idField].$in.map(() => ({
              ...data,
            }))
          );
        },
      );
    });

    it('generates a query out of the params.ids', async () => {
      try {
        await feathersDataProvider(
          DATA_PROVIDER_ACTIONS.UPDATE_MANY,
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

    it('outputs {data: feathersjsClient.service(resource).patch(null, data, {query})}\
    with uploadable field for each updated to the foreignKey of the uploaded file', async () => {
      const uploadableField =
        dataProviderOptions.resourceUploadableFieldMap[resource];
      const response = await feathersDataProvider(
        DATA_PROVIDER_ACTIONS.UPDATE_MANY,
        resource,
        params,
      );

      const query = generateQuery(
        params,
        dataProviderOptions.defaultPrimaryKeyField,
      );

      let expectedResponse = await feathersClient
        .service(resource)
        .patch(null, params.data, { query });

      expectedResponse = expectedResponse.map((obj: any) => ({
        ...obj,
        [uploadableField]: file.rawFile.name,
      }));

      expect(response).toMatchObject(
        convertListDataToReactAdminType(
          expectedResponse,
          dataProviderOptions.defaultPrimaryKeyField,
        ),
      );
    });

    describe('uploads', () => {
      it('throws error if the resource is the same as the one on the uploadsUrl', async () => {
        const uploadsParams = {
          ids: [6, 7, 17],
          data: { uploadsName: file, size: '50mb' },
        };
        await expect(
          feathersDataProvider(
            DATA_PROVIDER_ACTIONS.UPDATE_MANY,
            uploadsResource,
            uploadsParams,
          ),
        ).rejects.toThrow('editting');
      });
    });
  });

  describe('type: CREATE', () => {
    beforeEach(() => {
      feathersClient.service(resource).create = jest.fn(
        async (data: any) => data,
      );
    });

    it('outputs {data: feathersjsClient.service(resource).create(data)}\
    with uploadable field updated to the foreignKey of the uploaded file', async () => {
      const uploadableField =
        dataProviderOptions.resourceUploadableFieldMap[resource];

      const params = {
        data: { name: 'John Doe', [uploadableField]: file },
      };
      const response = await feathersDataProvider(
        DATA_PROVIDER_ACTIONS.CREATE,
        resource,
        params,
      );
      const expectedResponse = await feathersClient
        .service(resource)
        .create(params.data);

      expect(response).toMatchObject(
        convertSingleDatumToReactAdminType(
          { ...expectedResponse, [uploadableField]: file.rawFile.name },
          dataProviderOptions.defaultPrimaryKeyField,
        ),
      );
    });

    describe('uploads', () => {
      it('outputs response from the upload if the resource is the same as the one on the uploadsUrl', async () => {
        const uploadableField =
          dataProviderOptions.resourceUploadableFieldMap[uploadsResource];

        const params = {
          data: { title: 'John Doe Photo', [uploadableField]: file },
        };

        const response = await feathersDataProvider(
          DATA_PROVIDER_ACTIONS.CREATE,
          uploadsResource,
          params,
        );
        const expectedResponse = await uploadRelatedFiles(
          feathersClient,
          uploadsResource,
          params,
          dataProviderOptions.defaultPrimaryKeyField,
          dataProviderOptions,
        );

        expect(response).toMatchObject(
          convertSingleDatumToReactAdminType(
            expectedResponse,
            dataProviderOptions.defaultPrimaryKeyField,
          ),
        );
      });
    });
  });

  describe('type: DELETE', () => {
    it('outputs {data: feathersjsClient.service(resource).remove(params.id)}', async () => {
      feathersClient.service(resource).remove = jest.fn(async (_id: any) => ({
        [dataProviderOptions.defaultPrimaryKeyField]: _id,
      }));
      const params = {
        id: 4,
      };
      const expectedResponse = await feathersClient
        .service(resource)
        .remove(params.id);

      await expect(
        feathersDataProvider(DATA_PROVIDER_ACTIONS.DELETE, resource, params),
      ).resolves.toMatchObject(
        convertSingleDatumToReactAdminType(
          expectedResponse,
          dataProviderOptions.defaultPrimaryKeyField,
        ),
      );
    });
  });

  describe('type: DELETE_MANY', () => {
    const params = {
      ids: [4, 5, 19],
    };

    beforeEach(() => {
      feathersClient.service(resource).remove = jest.fn(
        async (_id: any, extraParams: any) => {
          const idField = dataProviderOptions.defaultPrimaryKeyField;
          return (
            extraParams.query &&
            extraParams.query[idField] &&
            Array.isArray(extraParams.query[idField].$in) &&
            extraParams.query[idField].$in.map((id: any) => ({
              [idField]: id,
            }))
          );
        },
      );
    });

    it('generates a query out of the params.ids', async () => {
      try {
        await feathersDataProvider(
          DATA_PROVIDER_ACTIONS.DELETE_MANY,
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

    it('outputs {data: feathersjsClient.service(resource).remove(null, {query})}', async () => {
      const query = generateQuery(
        params,
        dataProviderOptions.defaultPrimaryKeyField,
      );

      const expectedResponse = await feathersClient
        .service(resource)
        .remove(null, { query });

      await expect(
        feathersDataProvider(
          DATA_PROVIDER_ACTIONS.DELETE_MANY,
          resource,
          params,
        ),
      ).resolves.toMatchObject(
        convertListDataToReactAdminType(
          expectedResponse,
          dataProviderOptions.defaultPrimaryKeyField,
        ),
      );
    });
  });
});
