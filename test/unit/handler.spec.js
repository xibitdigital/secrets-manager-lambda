const { handlerWithCommands } = require("../../src/index");

const emptyEvent = {};

const commandsSample = [
  {
    action: "rotate",
    secretArn: "foo",
    keys: ["FOO"]
  },
  {
    action: "copy",
    secretSourceArn: "foo",
    secretDestination: "bar",
    keys: ["FOO"]
  }
];

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

describe("handler", () => {
  describe("handlerWithCommands", () => {
    it("should run all commands", async () => {
      const expectedResult = [
        {
          ARN: "arn:aws:secretsmanager:eu-west-2:xxx:secret:test-secret-rotation-xxx",
          Name: "test-secret-rotation",
          VersionId: "0119bbdf-0000-0000-0000-b01be4f52741"
        },
        {
          ARN: "arn:aws:secretsmanager:eu-west-2:xxx:secret:test-secret-rotation-xxx",
          Name: "test-secret-rotation",
          VersionId: "0119bbdf-0000-0000-0000-b01be4f52741"
        }
      ];

      const res = await handlerWithCommands(commandsSample)(emptyEvent);

      expect(res).toEqual(expectedResult);
    });

    it("should return false if no commands are specified", async () => {
      const expectedResult = false;
      const res = await handlerWithCommands("")(emptyEvent);

      expect(res).toEqual(expectedResult);
    });
  });
});
