import isFileInputValueEmpty from '../is-file-input-value-empty';

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
