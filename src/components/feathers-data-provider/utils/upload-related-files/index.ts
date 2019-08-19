import { IFeathersClient } from '../../../../types/feathers-client';
import uploadFiles from './upload-files';
import { shouldUploadFiles } from './utils';
export * from './utils';

export interface IUploadsConfig {
  multerFieldNameSetting: string;
  uploadsUrl: string;
  resourceUploadableFieldMap: { [key: string]: string };
  resourceUploadsForeignKeyMap: { [key: string]: string };
}

/**
 *
 * Uploads any related files and updates the params.data uploadable field with the
 * identifiers of the uploaded files. Identifiers can be urls, ids, etc
 * @param app {IFeathersClient}
 * @param resource { string }
 * @param params { { [key: string]: any } }
 * @param primaryKeyField { string }
 * @param IUploadsConfig {IUploadsConfig}
 * @returns { Promise<any>}
 */
export const uploadRelatedFiles = async (
  app: IFeathersClient,
  resource: string,
  params: { [key: string]: any },
  primaryKeyField: string,
  uploadsConfig: IUploadsConfig,
): Promise<any> => {
  const {
    resourceUploadableFieldMap,
    resourceUploadsForeignKeyMap,
    multerFieldNameSetting,
    uploadsUrl,
  } = uploadsConfig;
  if (shouldUploadFiles(resource, params, resourceUploadableFieldMap)) {
    const uploadableField = resourceUploadableFieldMap[resource];
    const uploadsForeignKey =
      resourceUploadsForeignKeyMap[resource] || primaryKeyField;
    const uploadableFieldNewData = await uploadFiles(
      app,
      {
        multerFieldNameSetting,
        uploadsForeignKey,
        uploadsUrl,
      },
      params.data[uploadableField],
    );

    return { ...params.data, [uploadableField]: uploadableFieldNewData };
  }
  return { ...params.data };
};

export const uploadRelatedFilesForMultipleObjects = async (
  app: IFeathersClient,
  resource: string,
  params: { [key: string]: any },
  primaryKeyField: string,
  uploadsConfig: IUploadsConfig,
): Promise<any> => {
  if (Array.isArray(params.data)) {
    let response = [];
    for (let datum of params.data) {
      const tmp = await uploadRelatedFiles(
        app,
        resource,
        { ...params, data: datum },
        primaryKeyField,
        uploadsConfig,
      );
      response.push(tmp);
    }
    return response;
  }
  return params.data;
};

export default uploadRelatedFiles;
