import { IFeathersClient } from '../../../types/feathers-client';

import {
  isUploadsResource,
  IUploadsConfig,
  uploadRelatedFilesForMultipleObjects,
} from '../utils/upload-related-files';

import {
  convertListDataToReactAdminType,
  decodeListFromReactAdmin,
  IReactAdminDataObject,
} from '../utils/ra-feathers-transpiler';

/**
 * Makes a POST request to the feathersjs server to create a list of object at a given resource endpoint
 * It uploads any related files if any
 * @param app { IFeathersClient } The client that queries the Featherjs back end
 * @param resource { string } The name of the resource being queried
 * @param params {{ [key: string]: any }} The parameters passed by React admin including query params
 * @param primaryKeyField { string } The primary key field of the given resource e.g. '_id'
 * @param IUploadsConfig {IUploadsConfig} The settings for uploads to happen appropriately etc.
 * uploadsUrl, multerFieldNameSetting etc.
 * @returns {Promise<{data: IReactAdminDataObject[]}>} Returns a promise of the react-admin-like
 * response from the POST request
 */
export default async (
  app: IFeathersClient,
  resource: string,
  params: { [key: string]: any },
  primaryKeyField: string,
  IUploadsConfig: IUploadsConfig,
): Promise<{ data: IReactAdminDataObject[] }> => {
  const data = await uploadRelatedFilesForMultipleObjects(
    app,
    resource,
    params,
    primaryKeyField,
    IUploadsConfig,
  );

  if (isUploadsResource(resource, IUploadsConfig.uploadsUrl)) {
    // return the same data got from uploading the files
    // some uploads always return arrays, though
    return convertListDataToReactAdminType(data, primaryKeyField);
  }

  const response = await app
    .service(resource)
    .create(decodeListFromReactAdmin(data, primaryKeyField));
  return convertListDataToReactAdminType(response, primaryKeyField);
};
