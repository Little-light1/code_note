export const getLocal = (key = "") => {
  if (!key) {
    throw new Error("key is required.");
  }

  let value = localStorage.getItem(key);

  if (value === null) {
    return value;
  }

  try {
    value = JSON.parse(value);
  } catch (error) {
    // do nothing
  }
  return value;
};
