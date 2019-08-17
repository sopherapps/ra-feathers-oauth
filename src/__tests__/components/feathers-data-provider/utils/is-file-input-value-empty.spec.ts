export default (value: any) =>
  (Array.isArray(value) && value.length === 0) || value === undefined;

import isFileInputValueEmpty from '../../../../components/feathers-data-provider/utils/is-file-input-value-empty';

describe('is-file-input-value-empty', () => {
  it('returns true if the value passed is undefined', () => {
    expect(isFileInputValueEmpty(undefined)).toBe(true);
  });

  it('returns true if the value passed to it is an empty array', () => {
    expect(isFileInputValueEmpty([])).toBe(true);
  });

  it('returns false if the value passed to it is\
  anything but an empty array or undefined', () => {
    expect(isFileInputValueEmpty('hello')).toBe(false);
    expect(isFileInputValueEmpty(null)).toBe(false);
    expect(isFileInputValueEmpty(false)).toBe(false);
    expect(isFileInputValueEmpty(true)).toBe(false);
    expect(isFileInputValueEmpty(['hello'])).toBe(false);
    expect(isFileInputValueEmpty({})).toBe(false);
  });
});
