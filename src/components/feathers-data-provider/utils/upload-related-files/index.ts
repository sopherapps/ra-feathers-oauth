import { FeathersClient } from '../../../../types/feathers-client';
import uploadFiles from './upload-files';
import { shouldUploadFiles } from './utils';
export * from './utils';

export interface UploadsConfig {
  multerFieldNameSetting: string;
  uploadsUrl: string;
  resourceUploadableFieldMap: { [key: string]: string };
  resourceUploadsForeignKeyMap: { [key: string]: string };
}

/**
 *
 * Uploads any related files and updates the params.data uploadable field with the
 * identifiers of the uploaded files. Identifiers can be urls, ids, etc
 * @param app {FeathersClient}
 * @param resource { string }
 * @param params { { [key: string]: any } }
 * @param primaryKeyField { string }
 * @param uploadsConfig {UploadsConfig}
 * @returns { Promise<any>}
 */
export default async (
  app: FeathersClient,
  resource: string,
  params: { [key: string]: any },
  primaryKeyField: string,
  uploadsConfig: UploadsConfig,
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
        uploadsUrl,
        uploadsForeignKey,
      },
      params.data[uploadableField],
    );

    return { ...params.data, [uploadableField]: uploadableFieldNewData };
  }
  return { ...params.data };
};
