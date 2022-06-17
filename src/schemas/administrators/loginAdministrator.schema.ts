import * as yup from "yup";

const loginAdminstratorSchema = yup.object().shape(
  {
    username: yup
      .string()
      .transform((value) => value.toLowerCase())
      .when("email", {
        is: (email: string) => !email,
        then: yup.string().required(),
      }),
    email: yup
      .string()
      .email()
      .transform((value) => value.toLowerCase())
      .when("username", {
        is: (username: string) => !username,
        then: yup.string().required(),
      }),
    password: yup.string().required(),
  },
  [
    ["username", "email"],
    ["email", "username"],
  ]
);

export default loginAdminstratorSchema;
