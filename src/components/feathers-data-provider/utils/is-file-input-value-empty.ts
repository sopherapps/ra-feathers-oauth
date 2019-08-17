export default (fileInputValue: any) =>
  (Array.isArray(fileInputValue) && fileInputValue.length === 0) ||
  fileInputValue === undefined;
