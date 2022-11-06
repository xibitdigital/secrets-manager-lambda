const aws = require("aws-sdk");

const { AWS_REGION } = process.env;

AWS_REGION;//?

const client = new aws.SecretsManager({
  region: AWS_REGION
});

const getSecret = async (secretId) => {
  const params = { SecretId: secretId };

  try {
    const data = await client.getSecretValue(params).promise();
    console.log("the data has been retrieved");

    // Decrypts secret using the associated KMS CMK.
    // Depending on whether the secret is a string or binary, one of these fields will be populated.
    if ("SecretString" in data) {
      return JSON.parse(data.SecretString);
    } else {
      let buff = Buffer.from(data.SecretBinary, "base64");

      return buff.toString("ascii");
    }
  } catch (err) {
    console.error("error in retrieving secret", err);

    return false;
  }
};

// NOTE using secretArn instead of name because it can be used cross accounts
const updateSecret = async (data, secretArn) => {
  const params = {
    SecretId: secretArn,
    SecretString: JSON.stringify(data)
  };

  try {
    const res = await client.updateSecret(params).promise();
    console.log("the secret has been updated");

    return res;
  } catch (err) {
    console.error("error in updating secret", err);

    return false;
  }
};

module.exports = {
  getSecret,
  updateSecret
};
