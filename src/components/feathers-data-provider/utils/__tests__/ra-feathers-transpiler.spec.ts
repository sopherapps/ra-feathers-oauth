import {
  convertListDataToReactAdminType,
  convertSingleDatumToReactAdminType,
  decodeObjectFromReactAdmin,
  encodeListDataForReactAdmin,
  encodeObjectForReactAdmin,
} from '../ra-feathers-transpiler';

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
