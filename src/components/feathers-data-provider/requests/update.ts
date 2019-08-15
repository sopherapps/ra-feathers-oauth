import { FeathersClient } from '../../../typings/feathers-client';
import uploadRelatedFiles, {
  isUploadsResource,
  UploadsConfig,
} from '../utils/upload-related-files';

import {
  convertSingleDatumToReactAdminType,
  decodeObjectFromReactAdmin,
  ReactAdminDataObject,
} from '../utils/ra-feathers-transpiler';

/**
 * Makes a PATCH request to the feathersjs server to update a single object from a given resource endpoint
 * It uploads any related files if any
 * @param app { FeathersClient } The client that queries the Featherjs back end
 * @param resource { string } The name of the resource being queried
 * @param params {{ [key: string]: any }} The parameters passed by React admin including query params
 * @param primaryKeyField { string } The primary key field of the given resource e.g. '_id'
 * @param uploadsConfig {UploadsConfig} The settings for uploads to happen appropriately etc.
 * uploadsUrl, multerFieldNameSetting etc.
 * @returns {Promise<{data: ReactAdminDataObject}>} Returns a promise of the react-admin-like response from the PATCH request
 */
export default async (
  app: FeathersClient,
  resource: string,
  params: { [key: string]: any },
  primaryKeyField: string,
  uploadsConfig: UploadsConfig,
): Promise<{ data: ReactAdminDataObject }> => {
  if (isUploadsResource(resource, uploadsConfig.uploadsUrl)) {
    // updates are not allowed on the uploads resource
    throw new Error(`${resource} does not permit editting`);
  }

  const data = await uploadRelatedFiles(
    app,
    resource,
    params,
    primaryKeyField,
    uploadsConfig,
  );

  const response = await app
    .service(resource)
    .patch(params.id, decodeObjectFromReactAdmin(data, primaryKeyField));

  return convertSingleDatumToReactAdminType(response, primaryKeyField);
};
