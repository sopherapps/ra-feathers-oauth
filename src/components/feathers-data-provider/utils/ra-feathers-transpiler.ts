export interface IReactAdminDataObject {
  id?: any;
  [key: string]: any;
}

export interface ISingleObject {
  [key: string]: any;
}

/**
 * Converts a Data object from Feathersjs to React Admin style {e.g. _id to id}
 * @param obj {{[primaryKeyField]:any, [key: string]: any}} object to convert
 * @param primaryKeyField {string} primaryKey on the featherjs side of things
 * @returns {IReactAdminDataObject} {{ id: any, [key: string]: any }}
 */
export const encodeObjectForReactAdmin = (
  obj: { [key: string]: any },
  primaryKeyField: string = 'id',
): IReactAdminDataObject => ({
  ...obj,
  [primaryKeyField]: undefined,
  id: obj[primaryKeyField],
});

/**
 * Converts a Data object from React Admin style to Feathersjs {e.g. id to _id}
 * @param obj {{ id: any, [key: string]: any }} object to convert
 * @param primaryKeyField {string} primaryKey on the featherjs side of things
 * @returns {ISingleObject} {{[key: string]: any}}
 */
export const decodeObjectFromReactAdmin = (
  obj: IReactAdminDataObject,
  primaryKeyField: string = 'id',
): ISingleObject => ({
  ...obj,
  id: undefined,
  [primaryKeyField]: obj.id,
});

/**
 * Converts an array of objects from Featherjs style to React Admin style e.g. _id to id
 * @param data { [{[primaryKeyField]: any, [key: string]: any}] } array of objects to convert
 * @param primaryKeyField {string} primaryKey on the featherjs side of things
 * @returns {IReactAdminDataObject[]} {[{ id: any, [key: string]: any }]}
 */
export const encodeListDataForReactAdmin = (
  data: ISingleObject[],
  primaryKeyField: string = 'id',
): IReactAdminDataObject[] => {
  if (Array.isArray(data)) {
    return data.map(datum => encodeObjectForReactAdmin(datum, primaryKeyField));
  }
  return data;
};

/**
 * Converts the feathersjsData in list form to the kind React Admin understands
 * @param feathersjsData {any} the data from the feathersjs server that is to be converted
 * @param primaryKeyField { string } the primaryKeyField in the data provided
 */
export const convertListDataToReactAdminType = (
  feathersjsData: any,
  primaryKeyField: string,
): { data: IReactAdminDataObject[] } => {
  const tmp = Array.isArray(feathersjsData)
    ? feathersjsData
    : feathersjsData && feathersjsData.data;
  const otherDetails =
    feathersjsData && feathersjsData.data ? feathersjsData : {};
  return {
    ...otherDetails,
    data: encodeListDataForReactAdmin(tmp, primaryKeyField),
  };
};

/**
 * Converts the feathersjsData in object form to the kind React Admin understands
 * @param feathersjsData {any} the data from the feathersjs server that is to be converted
 * @param primaryKeyField { string } the primaryKeyField in the data provided
 */
export const convertSingleDatumToReactAdminType = (
  feathersjsData: any,
  primaryKeyField: string,
): { data: IReactAdminDataObject } => {
  return { data: encodeObjectForReactAdmin(feathersjsData, primaryKeyField) };
};
