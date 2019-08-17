import {
  isUploadsResource,
  shouldUploadFiles,
} from '../../../../components/feathers-data-provider/utils/upload-related-files/utils';

describe('upload-related-files', () => {
  describe('utils', () => {
    describe('isUploadsResource', () => {
      it('checks whether the path of the resource\
      is equal to that reflected in the uploads url', () => {
        const uploadsResource = 'files';
        const nonUploadsResource = 'some-other-path';
        const uploadsUrl = `http://localhost:3000/${uploadsResource}`;
        expect(isUploadsResource(uploadsResource, uploadsUrl)).toBe(true);
        expect(isUploadsResource(nonUploadsResource, uploadsUrl)).toBe(false);
      });
    });

    describe('shouldUploadFiles', () => {
      const resource = 'churches';
      const params = {
        data: {
          logo: 'some-stuff',
        },
      };
      const resourceUploadableFieldMap = {
        [resource]: 'logo',
      };

      it('returns true if the resource has a a field in the resourceUploadableFieldMap\
      and that field has a value in params.data', () => {
        expect(
          shouldUploadFiles(resource, params, resourceUploadableFieldMap),
        ).toBe(true);
      });

      it('returns false if the value of the uploadable field params.data is undefined', () => {
        const dataWithoutLogo = {
          data: {
            someOtherField: 'hello world',
          },
        };
        expect(
          shouldUploadFiles(
            resource,
            dataWithoutLogo,
            resourceUploadableFieldMap,
          ),
        ).toBe(false);
      });

      it('returns false if the resourceUploadableFieldMap lacks any entry\
      for the given resource', () => {
        const emptyResourceUploadableFieldMap = {
          'some-other-resource': 'uploads',
        };
        expect(
          shouldUploadFiles(resource, params, emptyResourceUploadableFieldMap),
        ).toBe(false);
      });
    });
  });
});
