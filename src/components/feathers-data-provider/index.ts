import { IFeathersClient } from '../../types/feathers-client';
import create from './requests/create';
import createMany from './requests/create-many';
import _delete from './requests/delete';
import deleteMany from './requests/delete-many';
import getList from './requests/get-list';
import getMany from './requests/get-many';
import getManyReference from './requests/get-many-reference';
import getOne from './requests/get-one';
import update from './requests/update';
import updateMany from './requests/update-many';

export interface IFeathersDataProviderConfig {
  uploadsUrl?: string;
  multerFieldNameSetting?: string;
  resourceUploadsForeignKeyMap?: { [key: string]: string };
  resourceUploadableFieldMap?: { [key: string]: string };
  resourcePrimaryKeyFieldMap?: { [key: string]: string };
  defaultPrimaryKeyField?: string;
  CREATE?: string;
  CREATE_MANY?: string;
  DELETE?: string;
  DELETE_MANY?: string;
  GET_LIST?: string;
  GET_MANY?: string;
  GET_MANY_REFERENCE?: string;
  GET_ONE?: string;
  UPDATE?: string;
  UPDATE_MANY?: string;
}

/**
 * Maps react-admin queries to A feathersjs server with\
 *  an uploads service to handle multipart/form-data
 *
 * @example
 * GET_LIST           => app.service('messages').find({query: {$limit: 10, $skip: 3, $sort: {createdAt: -1}}})
 * GET_ONE            => app.service('messages').get(id);
 * GET_MANY           => app.service('messages').find({query: {$limit: 10, $skip: 3, $sort: {createdAt: -1}, author: 1}})
 * GET_MANY_REFERENCE => app.service('messages').find({author: 20})
 * CREATE             => app.service('messages').create({title: 'Hello World'})
 * UPDATE             => app.service('messages').patch(1, {title: 'No World'})
 * UPDATE_MANY        => app.service('messages').patch(null, {title: 'Yes'}, {query: {author: 2}})
 * DELETE             => app.service('messages').remove(1)
 * DELETE_MANY        => app.service('messages').remove(null, {query: {author: 1}})
 */
export default (
  app: IFeathersClient,
  {
    uploadsUrl = 'http://localhost:3030/uploads',
    multerFieldNameSetting = 'files',
    resourceUploadsForeignKeyMap = {},
    resourceUploadableFieldMap = {},
    resourcePrimaryKeyFieldMap = {},
    defaultPrimaryKeyField = 'id',
    CREATE = 'CREATE',
    CREATE_MANY = 'CREATE_MANY',
    DELETE = 'DELETE',
    DELETE_MANY = 'DELETE_MANY',
    GET_LIST = 'GET_LIST',
    GET_MANY = 'GET_MANY',
    GET_MANY_REFERENCE = 'GET_MANY_REFERENCE',
    GET_ONE = 'GET_ONE',
    UPDATE = 'UPDATE',
    UPDATE_MANY = 'UPDATE_MANY',
  }: IFeathersDataProviderConfig = {},
) => {
  /**
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'messages'
   * @param {Object} params The data request params, depending on the type
   * @returns {Promise} for data response
   */
  return async (type: any, resource: string, params?: any) => {
    const primaryKeyField: string =
      resourcePrimaryKeyFieldMap[resource] || defaultPrimaryKeyField;

    const IUploadsConfig = {
      multerFieldNameSetting,
      resourceUploadableFieldMap,
      resourceUploadsForeignKeyMap,
      uploadsUrl,
    };

    switch (type) {
      case GET_LIST:
        return await getList(app, resource, params, primaryKeyField);

      case GET_MANY:
        return await getMany(app, resource, params, primaryKeyField);

      case GET_ONE:
        return await getOne(app, resource, params, primaryKeyField);

      case GET_MANY_REFERENCE:
        return await getManyReference(app, resource, params, primaryKeyField);

      case UPDATE:
        return await update(
          app,
          resource,
          params,
          primaryKeyField,
          IUploadsConfig,
        );

      case UPDATE_MANY:
        return await updateMany(
          app,
          resource,
          params,
          primaryKeyField,
          IUploadsConfig,
        );

      case CREATE:
        return await create(
          app,
          resource,
          params,
          primaryKeyField,
          IUploadsConfig,
        );

      case CREATE_MANY:
        return await createMany(
          app,
          resource,
          params,
          primaryKeyField,
          IUploadsConfig,
        );

      case DELETE:
        return await _delete(app, resource, params, primaryKeyField);

      case DELETE_MANY:
        return await deleteMany(app, resource, params, primaryKeyField);

      default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
  };
};
