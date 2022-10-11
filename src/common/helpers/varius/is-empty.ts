export const isEmpty = (val) => {
  if (val == null) return true;
  if ('boolean' == typeof val) return false;
  if ('number' == typeof val) return val === 0;
  if ('string' == typeof val) return val.length === 0;
  if ('function' == typeof val) return val.length === 0;
  if (Array.isArray(val)) return val.length === 0;
  if (val instanceof Error) return val.message === '';
  return Object.keys(val).length === 0;
};
