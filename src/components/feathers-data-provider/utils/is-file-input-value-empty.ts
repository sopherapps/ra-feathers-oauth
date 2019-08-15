export default (value: any) =>
  (Array.isArray(value) && value.length === 0) || value === undefined;
