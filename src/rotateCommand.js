const { getSecret, updateSecret } = require("./secretsManager");

const makeToken = (length = 32) => {
  let result = "";
  // list of chars that can be picked by the function
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const rotateSecret = (secret, keys, tokenLength = 32) =>
  Object.keys(secret).reduce((acc, val) => {
    let obj;

    if (val.includes(keys)) {
      obj = { [val]: makeToken(tokenLength) };
    } else {
      obj = { [val]: secret[val] };
    }

    return { ...acc, ...obj };
  }, {});

const handleRotateCommand = async (command) => {
  const { secretArn, keys } = command;

  const data = await getSecret(secretArn);

  if (Object.keys(data).length > 0) {
    const updatedSecret = rotateSecret(data, keys);
    const newSecret = await updateSecret(secretArn, updatedSecret);

    return newSecret;
  }

  return false;
};

module.exports = {
  makeToken,
  rotateSecret,
  handleRotateCommand
};
