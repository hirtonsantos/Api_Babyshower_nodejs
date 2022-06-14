export default {
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: [
    "**/**/**/companies.routes.spec.ts",
    "**/**/**/administrators.routes.spec.ts", //adicionado
    // "**/**/**/chat.routes.spec.ts",
    // "**/**/**/adverts.routes.spec.ts",
  ],
  testEnvironment: "node",
};
