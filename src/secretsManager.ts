import {
	SecretsManagerClient,
	GetSecretValueCommand,
	UpdateSecretCommand,
} from "@aws-sdk/client-secrets-manager";

const { AWS_REGION } = process.env;

const client = new SecretsManagerClient({
	region: AWS_REGION,
});

export const getSecret = async (secretId: string) => {
	const params = { SecretId: secretId };

	try {
		const command = new GetSecretValueCommand(params);
		const res = await client.send(command);

		// Decrypts secret using the associated KMS CMK.
		// Depending on whether the secret is a string or binary, one of these fields will be populated.
		if (res.SecretString === undefined) {
			return null;
		} else if ("SecretString" in res) {
			return JSON.parse(res.SecretString);
		} else {
			// rome-ignore lint: reason
			//const buff = Buffer.from(res.SecretBinary, "base64");
			//return buff.toString("ascii");
		}
	} catch (err) {
		console.error("error in retrieving secret", err);

		return false;
	}
};

// NOTE using secretArn instead of name because it can be used cross accounts
export const updateSecret = async (secretArn: string, data: object) => {
	const params = {
		SecretId: secretArn,
		SecretString: JSON.stringify(data),
	};

	try {
		const command = new UpdateSecretCommand(params);
		const res = await client.send(command);

		return res;
	} catch (err) {
		console.error("error in updating secret", err);

		return false;
	}
};
