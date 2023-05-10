module.exports = {
  setupFiles: ["dotenv/config"],
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  testEnvironment: "node",
  collectCoverage: true,
  coverageReporters: ["json", "html"],
  testPathIgnorePatterns: ["<rootDir>/node_modules"],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  }
};