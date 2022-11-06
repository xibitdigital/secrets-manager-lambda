const { getSecret, updateSecret } = require("./secretsManager");

const compose =
  (...functions) =>
  (args) =>
    functions.reduceRight((arg, fn) => fn(arg), args);

const findInKeys = (keys) => (str) => keys.filter((x) => str.indexOf(`${x}`) > -1);

const filterObjectByKeys = (searchKey) =>
  compose(Object.fromEntries, (arr) => arr.filter((pair) => searchKey(pair[0]).length > 0), Object.entries);

const filterSecret = (secret, keys) => filterObjectByKeys(findInKeys(keys))(secret);

const handleCopyCommand = async (command) => {
  const { secretSourceArn, secretDestination, keys } = command;
  const data = await getSecret(secretSourceArn);

  if (Object.keys(data).length > 0) {
    const filteredSecret = filterSecret(data, keys);
    const res = await updateSecret(secretDestination, filteredSecret);

    return res;
  }

  return false;
};

module.exports = {
  findInKeys,
  filterSecret,
  handleCopyCommand
};
