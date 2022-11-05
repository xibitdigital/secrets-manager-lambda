module.exports = function (wallaby) {
  require("dotenv").config();

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
      runner: "node",
      params: {
        env: "REGION=porco"
      }
    },
    testFramework: "jest",
    workers: {
      recycle: true
    },
    debug: true
  };
};
