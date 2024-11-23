export default {
    testEnvironment: "node", // Ensure Node.js environment
    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"], // Match test files
    testPathIgnorePatterns: ["/node_modules/"], // Ignore `node_modules`
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
};