module.exports = {
  setupFiles: ["dotenv/config"],
  collectCoverage: true,
  coverageReporters: ["json", "html"],
  testPathIgnorePatterns: ["<rootDir>/node_modules"],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 100,
      lines: 90,
      statements: 91
    }
  }
};
