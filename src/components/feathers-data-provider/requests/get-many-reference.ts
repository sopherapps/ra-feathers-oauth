import { FeathersClient } from '../../../typings/feathers-client';
import {
  convertListDataToReactAdminType,
  ReactAdminDataObject,
} from '../utils/ra-feathers-transpiler';

import generateQuery from '../utils/generate-query';

/**
 * Makes a GET request to the feathersjs server to retrieve a list from a given resource endpoint
 * with one of the queries being {[params.target]: params.id}
 * @param app { FeathersClient } The client that queries the Featherjs back end
 * @param resource { string } The name of the resource being queried
 * @param params {{ [key: string]: any }} The parameters passed by React admin including query params
 * @param primaryKeyField { string } The primary key field of the given resource e.g. '_id'
 * @returns {Promise<{data: ReactAdminDataObject[]}>} Returns a promise of the react-admin-like response from the GET request
 */
export default async (
  app: FeathersClient,
  resource: string,
  params: { [key: string]: any },
  primaryKeyField: string,
): Promise<{ data: ReactAdminDataObject[] }> => {
  let query = generateQuery(params, primaryKeyField);
  query = { ...query, [params.target]: params.id };
  const response = await app.service(resource).find({ query });

  let data: ReactAdminDataObject[];

  return convertListDataToReactAdminType(response, primaryKeyField);
};
