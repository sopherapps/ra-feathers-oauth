export default (fileInputValue: any) => {
  if (Array.isArray(fileInputValue)) {
    if (fileInputValue.length === 0) {
      return false;
    }

    for (const element of fileInputValue) {
      if (
        !(element instanceof File) &&
        !(element && element.rawFile instanceof File)
      ) {
        return false;
      }
    }
    return true;
  }
  return (
    (fileInputValue && fileInputValue.rawFile instanceof File) ||
    fileInputValue instanceof File
  );
};
