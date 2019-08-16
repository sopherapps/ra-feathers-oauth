import { FeathersClient } from '../../../types/feathers-client';

import generateQuery from '../utils/generate-query';

import {
  convertListDataToReactAdminType,
  encodeListDataForReactAdmin,
  ReactAdminDataObject,
} from '../utils/ra-feathers-transpiler';

/**
 * Makes a DELETE request to the feathersjs server to remove a list of objects at a given resource endpoint
 * @param app { FeathersClient } The client that queries the Featherjs back end
 * @param resource { string } The name of the resource being queried
 * @param params {{ [key: string]: any }} The parameters passed by React admin including query params
 * @param primaryKeyField { string } The primary key field of the given resource e.g. '_id'
 * @returns {Promise<{data: ReactAdminDataObject[]}>} Returns a promise of the react-admin-like response
 * from the DELETE request
 */
export default async (
  app: FeathersClient,
  resource: string,
  params: { [key: string]: any },
  primaryKeyField: string,
): Promise<{ data: ReactAdminDataObject[] }> => {
  const query = generateQuery(params, primaryKeyField);
  const response = await app.service(resource).remove(null, { query });

  return convertListDataToReactAdminType(response, primaryKeyField);
};
