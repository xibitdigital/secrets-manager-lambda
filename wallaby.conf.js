module.exports = function (wallaby) {
  return {
    files: [
      "src/**/*.js",
      "src/**/*.json",
      "test/**/*.json",
      "test/**/*.mock.js",
      "!test/*.spec.js",
      "!node_modules"
    ],
    tests: ["test/unit/**/*.spec.js"],
    env: {
      type: "node",
      params: {
        env: "REGION=eu-west-2;SECRET_ARN=foo"
      }
    },
    testFramework: "jest",
    workers: {
      recycle: true
    },
    debug: true
  };
};
