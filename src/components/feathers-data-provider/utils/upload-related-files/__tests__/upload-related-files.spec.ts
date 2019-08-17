import { IFeathersClient } from '../../../../../types/feathers-client';
import createFeathersClient from '../../../../create-feathers-client';
import uploadRealtedFiles from '../index';
import uploadRelatedFiles from '../index';
import uploadFiles from '../upload-files';
import { isUploadsResource, shouldUploadFiles } from '../utils';

describe('upload-related-files', () => {
  describe('utils', () => {
    describe('isUploadsResource', () => {
      it('checks whether the path of the resource\
      is equal to that reflected in the uploads url', () => {
        const uploadsResource = 'files';
        const nonUploadsResource = 'some-other-path';
        const uploadsUrl = `http://localhost:3000/${uploadsResource}`;
        expect(isUploadsResource(uploadsResource, uploadsUrl)).toBe(true);
        expect(isUploadsResource(nonUploadsResource, uploadsUrl)).toBe(false);
      });
    });

    describe('shouldUploadFiles', () => {
      const resource = 'churches';
      const params = {
        data: {
          logo: 'some-stuff',
        },
      };
      const resourceUploadableFieldMap = {
        [resource]: 'logo',
      };

      it('returns true if the resource has a a field in the resourceUploadableFieldMap\
      and that field has a value in params.data', () => {
        expect(
          shouldUploadFiles(resource, params, resourceUploadableFieldMap),
        ).toBe(true);
      });

      it('returns false if the value of the uploadable field params.data is undefined', () => {
        const dataWithoutLogo = {
          data: {
            someOtherField: 'hello world',
          },
        };
        expect(
          shouldUploadFiles(
            resource,
            dataWithoutLogo,
            resourceUploadableFieldMap,
          ),
        ).toBe(false);
      });

      it('returns false if the resourceUploadableFieldMap lacks any entry\
      for the given resource', () => {
        const emptyResourceUploadableFieldMap = {
          'some-other-resource': 'uploads',
        };
        expect(
          shouldUploadFiles(resource, params, emptyResourceUploadableFieldMap),
        ).toBe(false);
      });
    });
  });

  describe('upload-files', () => {
    const dataProviderOptions = {
      uploadsUrl: 'http://localhost:3030/uploads',
      multerFieldNameSetting: 'files',
      resourcePrimaryKeyFieldMap: {},
      defaultPrimaryKeyField: 'id',
    };
    const apiUrl = 'http://localhost:3000';
    let feathersClient: IFeathersClient;
    const originalFetch = window.fetch;
    const mockFetch = jest.fn(async (url, options) => ({
      json: async () => options.body && Array.from(options.body.values()),
    }));
    const dummyFile = new File([''], 'duumy-file', { type: 'text/html' });

    beforeEach(() => {
      jest.clearAllMocks();
      // @ts-ignore
      window.fetch = mockFetch;
      feathersClient = createFeathersClient(apiUrl);

      // @ts-ignore
      feathersClient.authentication.getAccessToken = jest.fn(
        () => 'some-random-token',
      );
    });

    afterEach(() => {
      window.fetch = originalFetch;
    });

    it('calls the getAccessToken method of feathersClient.authentication', async () => {
      await uploadFiles(
        feathersClient,
        { ...dataProviderOptions, uploadsForeignKey: 'id' },
        { ...dummyFile, rawFile: dummyFile },
      );
      // @ts-ignore
      expect(feathersClient.authentication.getAccessToken).toBeCalled();
    });

    it('POSTs to the uploadsUrl the formData containing\
    the files with an Authorization header\
    having the access token of the current user', async () => {
      const files = [1, 2, 3].map(() => ({ ...dummyFile, rawFile: dummyFile }));
      await uploadFiles(
        feathersClient,
        { ...dataProviderOptions, uploadsForeignKey: 'id' },
        files,
      );

      // @ts-ignore
      const accessToken = feathersClient.authentication.getAccessToken();
      const formData = new FormData();

      for (const file of files) {
        formData.append(
          dataProviderOptions.multerFieldNameSetting,
          file.rawFile,
          file.name,
        );
      }

      expect(mockFetch).toBeCalledWith(
        dataProviderOptions.uploadsUrl,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${accessToken}`,
          }),
          body: formData,
        }),
      );
    });

    it('returns the an array of the foreignKeys of the uploaded files\
    if an array of files was passed to it', async () => {
      const files = [1, 2, 3].map(() => ({ ...dummyFile, rawFile: dummyFile }));
      const fileNames = files.map(file => file.rawFile.name);
      const fileLastModifiedValues = files.map(
        file => file.rawFile.lastModified,
      );

      await expect(
        uploadFiles(
          feathersClient,
          { ...dataProviderOptions, uploadsForeignKey: 'name' },
          files,
        ),
      ).resolves.toEqual(expect.arrayContaining(fileNames));

      await expect(
        uploadFiles(
          feathersClient,
          { ...dataProviderOptions, uploadsForeignKey: 'lastModified' },
          files,
        ),
      ).resolves.toEqual(expect.arrayContaining(fileLastModifiedValues));
    });
    it('returns a forerignKey of the uploaded file\
    if a single file was passed to it', async () => {
      const file = { ...dummyFile, rawFile: dummyFile };

      await expect(
        uploadFiles(
          feathersClient,
          { ...dataProviderOptions, uploadsForeignKey: 'name' },
          file,
        ),
      ).resolves.toEqual(file.rawFile.name);

      await expect(
        uploadFiles(
          feathersClient,
          { ...dataProviderOptions, uploadsForeignKey: 'lastModified' },
          file,
        ),
      ).resolves.toEqual(file.rawFile.lastModified);
    });
  });

  describe('upload-related-files default import', () => {
    const resource = 'churches';
    const dataProviderOptions = {
      uploadsUrl: 'http://localhost:3030/uploads',
      multerFieldNameSetting: 'files',
      resourcePrimaryKeyFieldMap: {},
      resourceUploadsForeignKeyMap: { [resource]: 'url' },
      resourceUploadableFieldMap: { [resource]: 'logo' },
      defaultPrimaryKeyField: 'id',
    };
    const apiUrl = 'http://localhost:3000';
    let feathersClient: IFeathersClient;
    const originalFetch = window.fetch;
    const mockFetch = jest.fn(async (url, options) => ({
      json: async () => options.body && Array.from(options.body.values()),
    }));
    const dummyFile = new File([''], 'duumy-file', { type: 'text/html' });

    beforeEach(() => {
      jest.clearAllMocks();
      // @ts-ignore
      window.fetch = mockFetch;
      feathersClient = createFeathersClient(apiUrl);

      // @ts-ignore
      feathersClient.authentication.getAccessToken = jest.fn(
        () => 'some-random-token',
      );
    });

    afterEach(() => {
      window.fetch = originalFetch;
    });

    it('returns params.data with the uploadable field replaced\
    by the array of the foreignkeys of the uploaded files for multiple file upload', async () => {
      const files = [1, 2, 3].map(() => ({ ...dummyFile, rawFile: dummyFile }));
      const uploadableField =
        dataProviderOptions.resourceUploadableFieldMap[resource];
      const params = {
        data: {
          [uploadableField]: files,
          name: 'All Saints Cathedral, Hoima',
          address: 'Hoima town',
        },
      };
      const fileNames = files.map(file => file.rawFile.name);
      const fileLastModifiedValues = files.map(
        file => file.rawFile.lastModified,
      );

      await expect(
        uploadRelatedFiles(feathersClient, resource, params, '_id', {
          ...dataProviderOptions,
          resourceUploadsForeignKeyMap: { [resource]: 'name' },
        }),
      ).resolves.toMatchObject({
        ...params.data,
        [uploadableField]: fileNames,
      });

      await expect(
        uploadRelatedFiles(feathersClient, resource, params, '_id', {
          ...dataProviderOptions,
          resourceUploadsForeignKeyMap: { [resource]: 'lastModified' },
        }),
      ).resolves.toMatchObject({
        ...params.data,
        [uploadableField]: fileLastModifiedValues,
      });
    });

    it('returns params.data with the uploadable field replaced\
    by the foreign key of the uploaded file for single file upload', async () => {
      const file = { ...dummyFile, rawFile: dummyFile };
      const uploadableField =
        dataProviderOptions.resourceUploadableFieldMap[resource];
      const params = {
        data: {
          [uploadableField]: file,
          name: 'All Saints Cathedral, Hoima',
          address: 'Hoima town',
        },
      };

      await expect(
        uploadRelatedFiles(feathersClient, resource, params, '_id', {
          ...dataProviderOptions,
          resourceUploadsForeignKeyMap: { [resource]: 'name' },
        }),
      ).resolves.toMatchObject({
        ...params.data,
        [uploadableField]: file.rawFile.name,
      });

      await expect(
        uploadRelatedFiles(feathersClient, resource, params, '_id', {
          ...dataProviderOptions,
          resourceUploadsForeignKeyMap: { [resource]: 'lastModified' },
        }),
      ).resolves.toMatchObject({
        ...params.data,
        [uploadableField]: file.rawFile.lastModified,
      });
    });

    it('returns the original params.data if resource has no uploadable field', async () => {
      const params = {
        data: {
          name: 'All Saints Cathedral, Hoima',
          address: 'Hoima town',
        },
      };

      await expect(
        uploadRelatedFiles(feathersClient, resource, params, '_id', {
          ...dataProviderOptions,
          resourceUploadsForeignKeyMap: { [resource]: 'name' },
          resourceUploadableFieldMap: { [`${resource}extra`]: 'logo' },
        }),
      ).resolves.toMatchObject(params.data);

      await expect(
        uploadRelatedFiles(feathersClient, resource, params, '_id', {
          ...dataProviderOptions,
          resourceUploadsForeignKeyMap: { [resource]: 'lastModified' },
          resourceUploadableFieldMap: { [`${resource}extra`]: 'logo' },
        }),
      ).resolves.toMatchObject(params.data);
    });

    it('returns the original params.data if the value of\
    the uploadbale field was undefined', async () => {
      const uploadableField =
        dataProviderOptions.resourceUploadableFieldMap[resource];
      const params = {
        data: {
          [uploadableField]: undefined,
          name: 'All Saints Cathedral, Hoima',
          address: 'Hoima town',
        },
      };

      await expect(
        uploadRelatedFiles(feathersClient, resource, params, '_id', {
          ...dataProviderOptions,
          resourceUploadsForeignKeyMap: { [resource]: 'name' },
        }),
      ).resolves.toMatchObject(params.data);

      await expect(
        uploadRelatedFiles(feathersClient, resource, params, '_id', {
          ...dataProviderOptions,
          resourceUploadsForeignKeyMap: { [resource]: 'lastModified' },
        }),
      ).resolves.toMatchObject(params.data);
    });

    it('returns the original params.data if the value of\
    the uploadbale field was an empty array', async () => {
      const uploadableField =
        dataProviderOptions.resourceUploadableFieldMap[resource];
      const params = {
        data: {
          [uploadableField]: [],
          name: 'All Saints Cathedral, Hoima',
          address: 'Hoima town',
        },
      };

      await expect(
        uploadRelatedFiles(feathersClient, resource, params, '_id', {
          ...dataProviderOptions,
          resourceUploadsForeignKeyMap: { [resource]: 'name' },
        }),
      ).resolves.toMatchObject(params.data);

      await expect(
        uploadRelatedFiles(feathersClient, resource, params, '_id', {
          ...dataProviderOptions,
          resourceUploadsForeignKeyMap: { [resource]: 'lastModified' },
        }),
      ).resolves.toMatchObject(params.data);
    });
  });
});
