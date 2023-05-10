const { mockClient } = require("aws-sdk-client-mock");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
  UpdateSecretCommand
} = require("@aws-sdk/client-secrets-manager");
const smcMock = mockClient(SecretsManagerClient);

const { getSecret, updateSecret } = require("../../src/secretsManager");

const getSecretValueCommandSampleRensponseMock = {
  foo: "foo",
  "FOO-foo": "bar"
};

const updateSecretCommandRensponseMock = {
  ARN: "arn:aws:secretsmanager:eu-west-2:xxx:secret:test-secret-rotation-xxx",
  Name: "test-secret-rotation",
  VersionId: "0119bbdf-0000-0000-0000-b01be4f52741"
};

describe.only("secretsManager", () => {
  beforeEach(() => {
    smcMock.reset();
  });

  describe("getSecret", () => {
    it("retrieve a secret", async () => {
      smcMock.on(GetSecretValueCommand).resolves({
        SecretString: JSON.stringify(getSecretValueCommandSampleRensponseMock)
      });

      const expectedResult = getSecretValueCommandSampleRensponseMock;
      const res = await getSecret("foo-arn");

      expect(res).toEqual(expectedResult);
    });
  });

  describe("updateSecret", () => {
    it("updateSecret a secret", async () => {
      smcMock.on(UpdateSecretCommand).resolves(updateSecretCommandRensponseMock);

      const expectedResult = updateSecretCommandRensponseMock;
      const res = await updateSecret("foo-arn");

      expect(res).toEqual(expectedResult);
    });
  });
});
