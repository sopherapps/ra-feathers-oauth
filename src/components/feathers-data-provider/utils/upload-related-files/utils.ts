import hasOnlyFiles from '../has-only-files';

export const isUploadsResource = (resource: string, uploadsUrl: string) =>
  uploadsUrl.split('/').reverse()[0] === resource;

export const shouldUploadFiles = (
  resource: string,
  params: { [key: string]: any },
  resourceUploadableFieldMap: { [key: string]: string },
): boolean => {
  const uploadableField = resourceUploadableFieldMap[resource];
  if (uploadableField) {
    return hasOnlyFiles(params.data[uploadableField]);
  }
  return false;
};
