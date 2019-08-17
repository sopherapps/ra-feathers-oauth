// export interface ReactAdminDataObject {
//   id?: any;
//   [key: string]: any;
// }

// export interface SingleObject {
//   [key: string]: any;
// }

// /**
//  * Converts a Data object from Feathersjs to React Admin style {e.g. _id to id}
//  * @param obj {{[primaryKeyField]:any, [key: string]: any}} object to convert
//  * @param primaryKeyField {string} primaryKey on the featherjs side of things
//  * @returns {ReactAdminDataObject} {{ id: any, [key: string]: any }}
//  */
// export const encodeObjectForReactAdmin = (
//   obj: { [key: string]: any },
//   primaryKeyField: string = 'id',
// ): ReactAdminDataObject => ({
//   ...obj,
//   [primaryKeyField]: undefined,
//   id: obj[primaryKeyField],
// });

// /**
//  * Converts a Data object from React Admin style to Feathersjs {e.g. id to _id}
//  * @param obj {{ id: any, [key: string]: any }} object to convert
//  * @param primaryKeyField {string} primaryKey on the featherjs side of things
//  * @returns {SingleObject} {{[key: string]: any}}
//  */
// export const decodeObjectFromReactAdmin = (
//   obj: ReactAdminDataObject,
//   primaryKeyField: string = 'id',
// ): SingleObject => ({
//   ...obj,
//   id: undefined,
//   [primaryKeyField]: obj.id,
// });

// /**
//  * Converts an array of objects from Featherjs style to React Admin style e.g. _id to id
//  * @param data { [{[primaryKeyField]: any, [key: string]: any}] } array of objects to convert
//  * @param primaryKeyField {string} primaryKey on the featherjs side of things
//  * @returns {ReactAdminDataObject[]} {[{ id: any, [key: string]: any }]}
//  */
// export const encodeListDataForReactAdmin = (
//   data: SingleObject[],
//   primaryKeyField: string = 'id',
// ): ReactAdminDataObject[] => {
//   if (Array.isArray(data)) {
//     return data.map(datum => encodeObjectForReactAdmin(datum, primaryKeyField));
//   }
//   return data;
// };

// /**
//  * Converts the feathersjsData in list form to the kind React Admin understands
//  * @param feathersjsData {any} the data from the feathersjs server that is to be converted
//  * @param primaryKeyField { string } the primaryKeyField in the data provided
//  */
// export const convertListDataToReactAdminType = (
//   feathersjsData: any,
//   primaryKeyField: string,
// ): { data: ReactAdminDataObject[] } => {
//   const tmp = Array.isArray(feathersjsData)
//     ? feathersjsData
//     : feathersjsData.data;
//   return { data: encodeListDataForReactAdmin(tmp, primaryKeyField) };
// };

// /**
//  * Converts the feathersjsData in object form to the kind React Admin understands
//  * @param feathersjsData {any} the data from the feathersjs server that is to be converted
//  * @param primaryKeyField { string } the primaryKeyField in the data provided
//  */
// export const convertSingleDatumToReactAdminType = (
//   feathersjsData: any,
//   primaryKeyField: string,
// ): { data: ReactAdminDataObject } => {
//   return { data: encodeObjectForReactAdmin(feathersjsData, primaryKeyField) };
// };

import {
  convertListDataToReactAdminType,
  convertSingleDatumToReactAdminType,
  decodeObjectFromReactAdmin,
  encodeListDataForReactAdmin,
  encodeObjectForReactAdmin,
} from '../../../../components/feathers-data-provider/utils/ra-feathers-transpiler';

describe('ra-feathers-transpiler', () => {
  describe('encodeObjectForReactAdmin', () => {
    it('changes the primaryKey name to id for a given object', () => {
      const primaryKeyField = '_id';
      const rawObject = {
        [primaryKeyField]: 5,
        name: 'John Doe',
        email: 'johndoe@example.com',
      };
      const expectedObject = {
        id: rawObject[primaryKeyField],
        name: rawObject.name,
        email: rawObject.email,
      };
      expect(
        encodeObjectForReactAdmin(rawObject, primaryKeyField),
      ).toMatchObject(expectedObject);
    });
  });
  describe('decodeObjectFromReactAdmin', () => {
    it('changes id to the primaryKeyField name for a given object', () => {
      const primaryKeyField = '_no';
      const rawObject = {
        id: 5,
        name: 'John Doe',
        email: 'johndoe@example.com',
      };
      const expectedObject = {
        [primaryKeyField]: rawObject.id,
        name: rawObject.name,
        email: rawObject.email,
      };
      expect(
        decodeObjectFromReactAdmin(rawObject, primaryKeyField),
      ).toMatchObject(expectedObject);
    });
  });
  describe('encodeListDataForReactAdmin', () => {
    it('changes the primaryKeyField(s) of all the objects\
    in the list to id', () => {
      const primaryKeyField = '_no';
      const rawObjects = [
        {
          [primaryKeyField]: 5,
          name: 'John Doe',
          email: 'johndoe@example.com',
        },
        {
          [primaryKeyField]: 12,
          name: 'Jane Doe',
          email: 'janedoe@example.com',
        },
        {
          [primaryKeyField]: 14,
          name: 'Paul Doe',
          email: 'pauldoe@example.com',
        },
      ];
      const expectedObjects = rawObjects.map(object => ({
        ...object,
        id: object[primaryKeyField],
        [primaryKeyField]: undefined,
      }));
      expect(encodeListDataForReactAdmin(rawObjects, primaryKeyField)).toEqual(
        expectedObjects,
      );
    });
  });
  describe('convertListDataToReactAdminType', () => {
    it('returns an object with property data as the\
    list of objects whose primaryKeyField has been changed to id', () => {
      const primaryKeyField = '_no';
      const rawObjects = [
        {
          [primaryKeyField]: 5,
          name: 'John Doe',
          email: 'johndoe@example.com',
        },
        {
          [primaryKeyField]: 12,
          name: 'Jane Doe',
          email: 'janedoe@example.com',
        },
        {
          [primaryKeyField]: 14,
          name: 'Paul Doe',
          email: 'pauldoe@example.com',
        },
      ];
      const expectedObjects = rawObjects.map(object => ({
        ...object,
        id: object[primaryKeyField],
        [primaryKeyField]: undefined,
      }));
      expect(
        convertListDataToReactAdminType(rawObjects, primaryKeyField),
      ).toMatchObject({ data: expectedObjects });
    });
  });
  describe('convertSingleDatumToReactAdminType', () => {
    it('returns an object with a data property as the\
    object whose primaryKeyField has been changed to id', () => {
      const primaryKeyField = 'number';
      const rawObject = {
        [primaryKeyField]: 5,
        name: 'John Doe',
        email: 'johndoe@example.com',
      };
      const expectedObject = {
        id: rawObject[primaryKeyField],
        name: rawObject.name,
        email: rawObject.email,
      };
      expect(
        convertSingleDatumToReactAdminType(rawObject, primaryKeyField),
      ).toMatchObject({ data: expectedObject });
    });
  });
});
