import hasOnlyFiles from '../has-only-files';

describe('is-file-input-value-empty', () => {
  const dummyFile = new File([''], 'dummy', { type: 'text/pdf' });

  it('returns false if the value passed to it is\
  anything but a File object or array of File objects', () => {
    expect(hasOnlyFiles(undefined)).toBe(false);
    expect(hasOnlyFiles([])).toBe(false);
    expect(hasOnlyFiles('hello')).toBe(false);
    expect(hasOnlyFiles(null)).toBe(false);
    expect(hasOnlyFiles(false)).toBe(false);
    expect(hasOnlyFiles(true)).toBe(false);
    expect(hasOnlyFiles(['hello'])).toBe(false);
    expect(hasOnlyFiles({})).toBe(false);
  });

  it('returns true if the value passed to it is a File object', () => {
    expect(hasOnlyFiles(dummyFile)).toBe(true);
  });

  it('returns true if the value passed to it has a property rawFile that holds a File object', () => {
    expect(hasOnlyFiles({ rawFile: dummyFile })).toBe(true);
  });

  it('returns true if the value passed is an array of File objects or\
  objects with property rawFile holding a File object', () => {
    expect(hasOnlyFiles([dummyFile])).toBe(true);
    expect(hasOnlyFiles([dummyFile, dummyFile])).toBe(true);
    expect(hasOnlyFiles([dummyFile, { rawFile: dummyFile }])).toBe(true);
    expect(hasOnlyFiles([{ rawFile: dummyFile }, { rawFile: dummyFile }])).toBe(
      true,
    );
    expect(hasOnlyFiles([{ rawFile: dummyFile }])).toBe(true);
  });

  it('returns false if the value passed is an array of File objects and other objects', () => {
    expect(hasOnlyFiles([dummyFile, dummyFile, 'hello'])).toBe(false);
  });
});
