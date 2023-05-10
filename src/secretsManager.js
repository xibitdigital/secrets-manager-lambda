const {
  SecretsManagerClient,
  GetSecretValueCommand,
  UpdateSecretCommand
} = require("@aws-sdk/client-secrets-manager");

const { AWS_REGION } = process.env;

const client = new SecretsManagerClient({
  region: AWS_REGION
});

const getSecret = async (secretId) => {
  const params = { SecretId: secretId };

  try {
    const command = new GetSecretValueCommand(params);

    const res = await client.send(command);

    console.log("the data has been retrieved");

    // Decrypts secret using the associated KMS CMK.
    // Depending on whether the secret is a string or binary, one of these fields will be populated.
    if ("SecretString" in res) {
      return JSON.parse(res.SecretString);
    } else {
      const buff = Buffer.from(res.SecretBinary, "base64");

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
    const command = new UpdateSecretCommand(params);

    const res = await client.send(command);

    // const res = await client.updateSecret(params).promise();
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
