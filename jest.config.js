module.exports = {
  setupFiles: ["dotenv/config"],
  collectCoverage: true,
  coverageReporters: ["json", "html"],
  testPathIgnorePatterns: ["<rootDir>/node_modules"],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 100,
      lines: 79,
      statements: 80
    }
  }
};
