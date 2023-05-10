const { handlerWithCommands } = require("../../src/index");

const { mockClient } = require("aws-sdk-client-mock");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
  UpdateSecretCommand
} = require("@aws-sdk/client-secrets-manager");

const smcMock = mockClient(SecretsManagerClient);

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

const responseMessage = (code, body) => ({
  statusCode: code,
  body: body
});

const getSecretValueCommandSampleRensponseMock = {
  foo: "foo",
  "FOO-foo": "bar"
};
const updateSecretCommandRensponseMock = {
  ARN: "arn:aws:secretsmanager:eu-west-2:xxx:secret:test-secret-rotation-xxx",
  Name: "test-secret-rotation",
  VersionId: "0119bbdf-0000-0000-0000-b01be4f52741"
};

describe("handler", () => {
  beforeEach(() => {
    smcMock.reset();
  });

  describe("handlerWithCommands", () => {
    it("should run all commands", async () => {
      smcMock
        .on(GetSecretValueCommand)
        .resolves({
          SecretString: JSON.stringify(getSecretValueCommandSampleRensponseMock)
        })
        .on(UpdateSecretCommand)
        .resolves(updateSecretCommandRensponseMock);

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

      expect(res).toEqual(responseMessage(200, expectedResult));
    });

    it("should return false if no commands are specified", async () => {
      const expectedResult = "no commands specified";
      const res = await handlerWithCommands("")(emptyEvent);

      expect(res).toEqual(responseMessage(400, expectedResult));
    });
  });
});
