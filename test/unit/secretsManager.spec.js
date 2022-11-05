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

jest.mock("aws-sdk", () => ({
  SecretsManager: function () {
    return {
      getSecretValue: () => {
        {
          return {
            promise: () => {
              return {
                SecretString: JSON.stringify(getSecretValueCommandSampleRensponseMock)
              };
            }
          };
        }
      },
      updateSecret: () => {
        {
          return {
            promise: () => updateSecretCommandRensponseMock
          };
        }
      }
    };
  }
}));

describe("secretsManager", () => {
  describe("getSecret", () => {
    it("retrieve a secret", async () => {
      const expectedResult = getSecretValueCommandSampleRensponseMock;
      const res = await getSecret("foo-arn");

      expect(res).toEqual(expectedResult);
    });
  });

  describe("updateSecret", () => {
    it("updateSecret a secret", async () => {
      const expectedResult = updateSecretCommandRensponseMock;
      const res = await updateSecret("foo-arn");

      expect(res).toEqual(expectedResult);
    });
  });
});
