import { FeathersClient } from '../../../typings/feathers-client';
import {
  convertSingleDatumToReactAdminType,
  ReactAdminDataObject,
} from '../utils/ra-feathers-transpiler';

/**
 * Makes a GET request to the feathersjs server to retrieve a single object from a given resource endpoint
 * @param app { FeathersClient } The client that queries the Featherjs back end
 * @param resource { string } The name of the resource being queried
 * @param params {{ id: any, [key: string]: any }} The parameters passed by React admin including query params
 * @param primaryKeyField { string } The primary key field of the given resource e.g. '_id'
 * @returns {Promise<{data: ReactAdminDataObject}>} Returns a promise of the react-admin-like response from the GET request
 */
export default async (
  app: FeathersClient,
  resource: string,
  params: { id: any; [key: string]: any },
  primaryKeyField: string,
): Promise<{ data: ReactAdminDataObject }> => {
  const response = await app.service(resource).get(params.id);
  return convertSingleDatumToReactAdminType(response, primaryKeyField);
};
