const environment = Object.entries(require("dotenv").config()["parsed"])
  .map((x) => `${x[0]}=${x[1]}`)
  .join(";");

module.exports = function () {
  process.env.AWS_REGION = "eu-west-2";
  process.env.COMMANDS = JSON.stringify([
    { action: "rotate", secretArn: "foo", keys: ["FOO"] },
    { action: "copy", secretSourceArn: "foo", secretDestination: "bar", keys: ["FOO"] }
  ]);

  return {
    files: [
      "src/**/*.js" // adjust if required
    ],

    tests: [
      "test/**/*.spec.js" // adjust if required
    ],

    env: {
      runner: "node",
      params: {
        env: environment
      }
    }
  };
};
