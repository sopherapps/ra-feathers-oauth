import { FeathersClient } from '../../../typings/feathers-client';

import uploadRelatedFiles, {
  isUploadsResource,
  UploadsConfig,
} from '../utils/upload-related-files';

import isFileInputValueEmpty from '../utils/is-file-input-value-empty';

import {
  convertSingleDatumToReactAdminType,
  decodeObjectFromReactAdmin,
  ReactAdminDataObject,
} from '../utils/ra-feathers-transpiler';

/**
 * Makes a POST request to the feathersjs server to create a single object at a given resource endpoint
 * It uploads any related files if any
 * @param app { FeathersClient } The client that queries the Featherjs back end
 * @param resource { string } The name of the resource being queried
 * @param params {{ [key: string]: any }} The parameters passed by React admin including query params
 * @param primaryKeyField { string } The primary key field of the given resource e.g. '_id'
 * @param uploadsConfig {UploadsConfig} The settings for uploads to happen appropriately etc.
 * uploadsUrl, multerFieldNameSetting etc.
 * @returns {Promise<{data: ReactAdminDataObject}>} Returns a promise of the react-admin-like
 * response from the POST request
 */
export default async (
  app: FeathersClient,
  resource: string,
  params: { [key: string]: any },
  primaryKeyField: string,
  uploadsConfig: UploadsConfig,
): Promise<{ data: ReactAdminDataObject }> => {
  const data = await uploadRelatedFiles(
    app,
    resource,
    params,
    primaryKeyField,
    uploadsConfig,
  );

  if (isUploadsResource(resource, uploadsConfig.uploadsUrl)) {
    // return the same data got from uploading the files
    // some uploads always return arrays, though
    const singleDatum = Array.isArray(data) ? data[0] : data;
    return convertSingleDatumToReactAdminType(singleDatum, primaryKeyField);
  }

  const response = await app
    .service(resource)
    .create(decodeObjectFromReactAdmin(data, primaryKeyField));
  return convertSingleDatumToReactAdminType(response, primaryKeyField);
};
