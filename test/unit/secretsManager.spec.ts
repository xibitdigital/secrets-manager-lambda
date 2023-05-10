import { mockClient } from "aws-sdk-client-mock";
import {
	SecretsManagerClient,
	GetSecretValueCommand,
	UpdateSecretCommand,
} from "@aws-sdk/client-secrets-manager";
import { getSecret, updateSecret } from "../../src/secretsManager";

const smcMock = mockClient(SecretsManagerClient);

const getSecretValueCommandSampleRensponseMock = {
	foo: "foo",
	"FOO-foo": "bar",
};

const updateSecretCommandRensponseMock = {
	ARN: "arn:aws:secretsmanager:eu-west-2:xxx:secret:test-secret-rotation-xxx",
	Name: "test-secret-rotation",
	VersionId: "0119bbdf-0000-0000-0000-b01be4f52741",
};

describe("secretsManager", () => {
	beforeEach(() => {
		smcMock.reset();
	});

	describe("getSecret", () => {
		it("retrieve a secret", async () => {
			smcMock.on(GetSecretValueCommand).resolves({
				SecretString: JSON.stringify(getSecretValueCommandSampleRensponseMock),
			});

			const expectedResult = getSecretValueCommandSampleRensponseMock;
			const res = await getSecret("foo-arn");

			expect(res).toEqual(expectedResult);
		});
	});

	describe("updateSecret", () => {
		it("updateSecret a secret", async () => {
			smcMock
				.on(UpdateSecretCommand)
				.resolves(updateSecretCommandRensponseMock);

			const expectedResult = updateSecretCommandRensponseMock;
			const res = await updateSecret("foo-arn", {});

			expect(res).toEqual(expectedResult);
		});
	});
});
