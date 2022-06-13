export default {
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: [
    "**/**/**/companies.routes.spec.ts",
    "**/**/**/administrators.routes.spec.ts", //adicionado
  ],
  testEnvironment: "node",
};
