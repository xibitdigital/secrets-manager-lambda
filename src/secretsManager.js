const aws = require("aws-sdk");

const { REGION } = process.env;

const client = new aws.SecretsManager({
  region: REGION
});

const getSecret = async (secretId) => {
  const params = { SecretId: secretId };

  try {
    const data = await client.getSecretValue(params).promise(); //?
    console.log("the data has been retrieved");

    // Decrypts secret using the associated KMS CMK.
    // Depending on whether the secret is a string or binary, one of these fields will be populated.
    if ("SecretString" in data) {
      return data.SecretString; //?
    } else {
      let buff = Buffer.from(data.SecretBinary, "base64");

      return buff.toString("ascii");
    }
  } catch (err) {
    if (err.code === "DecryptionFailureException") {
      // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    } else if (err.code === "InternalServiceErrorException") {
      // An error occurred on the server side.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    } else if (err.code === "InvalidParameterException") {
      // You provided an invalid value for a parameter.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    } else if (err.code === "InvalidRequestException") {
      // You provided a parameter value that is not valid for the current state of the resource.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    } else if (err.code === "ResourceNotFoundException") {
      // We can't find the resource that you asked for.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err;
    }

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
