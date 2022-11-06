const { findInKeys, filterSecret, handleCopyCommand } = require("../../src/copyCommand");

const sampleSecret = {
  foo: "foo",
  "FOO-bar": "bar"
};

const commandSample = {
  action: "copy",
  secretSourceArn: "foo",
  secretDestination: "bar",
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

describe("copyCommand", () => {
  describe("findInKeys", () => {
    it("should create a ramdon string of 32 chars", () => {
      const expectedResult = 1;
      const searchKey = findInKeys(["foo", "bar"]);
      const res = searchKey("fooooo");
      expect(res.length).toEqual(expectedResult);
    });
  });

  describe("filterSecret", () => {
    it("filter an object by keys", () => {
      const expectedResult = {
        "FOO-bar": "bar"
      };

      const keysFilter = ["FOO"];

      const res = filterSecret(sampleSecret, keysFilter);
      expect(res).toEqual(expectedResult);
    });
  });

  describe("handleCopyCommand", () => {
    it("should copy a secret with the defined keys", async () => {
      const expectedResult = updateSecretCommandRensponseMock;

      const res = await handleCopyCommand(commandSample);
      expect(res).toEqual(expectedResult);
    });
  });
});
