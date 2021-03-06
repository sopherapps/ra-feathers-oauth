import { IFeathersClient } from '../../../../types/feathers-client';

interface IReactDropzoneFile extends File {
  rawFile: File;
}

interface IUploadFilesConfig {
  multerFieldNameSetting: string;
  uploadsUrl: string;
  uploadsForeignKey: string;
}

/**
 * Uploads a file to the uploadsUrl and returns the identifier(s) of the uploaded file(s)
 * the ids are important for the related object to relate to these uploads
 * @param feathersClient {IFeathersClient}
 * @param config {{ multerFieldNameSetting: string, uploadsUrl: string, uploadsForeignKey: string}}
 * @param fileInputValue {IReactDropzoneFile[] | IReactDropzoneFile} where ReactDropzone is
 * the blob object from a react-dropzone file input field
 * @returns {(string | number)[]|(string | number)}
 */
export default async (
  feathersClient: IFeathersClient,
  config: IUploadFilesConfig,
  fileInputValue: IReactDropzoneFile[] | IReactDropzoneFile,
): Promise<Array<string | number> | (string | number)> => {
  let multipleFilesAllowed = false;
  let files: IReactDropzoneFile[] = [];

  // push the files from fileInputValue to files
  if (Array.isArray(fileInputValue)) {
    files = fileInputValue;
    multipleFilesAllowed = true;
  } else {
    files = [fileInputValue];
  }

  // append the files to FormData
  const form = new FormData();
  for (const file of files) {
    const rawFile = file.rawFile || file;
    if (file) {
      form.append(config.multerFieldNameSetting, rawFile, rawFile.name);
    }
  }

  // Initialize the params to pass to fetch
  // @ts-ignore
  const accessToken = await feathersClient.authentication.getAccessToken();
  const options: RequestInit = {
    body: form,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
  };
  // important: unset the Content-Type header so that the browser sets an appropriate one
  // https://muffinman.io/uploading-files-using-fetch-multipart-form-data/
  // @ts-ignore
  delete options.headers['Content-Type'];

  // Make POST request to the Uploads endpoint
  const fetchResponse = await fetch(config.uploadsUrl, options);
  const responseAfterUpload = await fetchResponse.json();

  // return a list of the identifiers of the uploaded files
  if (multipleFilesAllowed) {
    return responseAfterUpload.map(
      (uploadedFile: any) => uploadedFile[config.uploadsForeignKey],
    );
  } else {
    // return the identifier of the uploaded file
    let uploadedFileKey: any;

    if (Array.isArray(responseAfterUpload) && responseAfterUpload[0]) {
      uploadedFileKey = responseAfterUpload[0][config.uploadsForeignKey];
    } else {
      uploadedFileKey = responseAfterUpload[config.uploadsForeignKey];
    }

    return uploadedFileKey;
  }
};
