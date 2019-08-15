import isFileInputValueEmpty from '../is-file-input-value-empty';

export const isUploadsResource = (resource: string, uploadsUrl: string) =>
  uploadsUrl.split('/').reverse()[0] === resource;

export const shouldUploadFiles = (
  resource: string,
  params: { [key: string]: any },
  resourceUploadableFieldMap: { [key: string]: string },
) => {
  const uploadableField = resourceUploadableFieldMap[resource];
  return (
    uploadableField && !isFileInputValueEmpty(params.data[uploadableField])
  );
};
