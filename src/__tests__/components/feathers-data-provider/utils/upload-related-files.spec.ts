import {isUploadsResource} from '../../../../components/feathers-data-provider/utils/upload-related-files/utils';

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
  });
});