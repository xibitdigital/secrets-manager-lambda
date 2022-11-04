const { handleRotateCommand, rotateSecret, makeToken } = require("../../src/rotateCommand");

const sampleSecret = {
  foo: "foo",
  "FOO-bar": "bar"
};

const commandSample = {
  action: "rotate",
  secretArn: "foo",
  keys: ["FOO"]
};

const getSecretValueCommandSampleRensponseMock = {
  foo: "foo",
  "FOO-bar": "bar"
};
const updateSecretCommandRensponseMock = {
  ARN: "arn:aws:secretsmanager:eu-west-2:xxx:secret:test-secret-rotation-xxx",
  Name: "test-secret-rotation",
  VersionId: "0119bbdf-0000-0000-0000-b01be4f52741"
};

jest.mock("../../src/secretsManager", () => ({
  getSecret: () =>
    Promise.resolve({
      SecretString: JSON.stringify(getSecretValueCommandSampleRensponseMock)
    }),
  updateSecret: () => Promise.resolve(updateSecretCommandRensponseMock)
}));

describe("rotateCommand", () => {
  describe("makeToken", () => {
    it("should create a rqmdon string of 32 chars", () => {
      const expectedResult = 32;

      const res = makeToken(32);
      expect(res.length).toEqual(expectedResult);
    });
  });

  describe("rotateSecret", () => {
    it("should update only the secret that has FOO as key", () => {
      const expectedResult = 32;

      const res = rotateSecret(sampleSecret, ["FOO"]);
      expect(res["FOO-bar"].length).toEqual(expectedResult);
    });
  });

  describe("handleRotationCommand", () => {
    it("should rotate a secret", async () => {
      const expectedResult = true;

      const res = await handleRotateCommand(commandSample);
      expect(res).toEqual(expectedResult);
    });
  });
});
