import * as yup from "yup";

const loginUserSchema = yup.object().shape(
  {
    email: yup
      .string()
      .email()
      .transform((value) => value.toLowerCase())
      .when(["cnpj", "username"], {
        is: (cnpj: string, username: string) => !cnpj && !username,
        then: yup.string().required(),
      }),
    cnpj: yup
      .string()
      .matches(/\d+/g, "CNPJ can only have numbers")
      .min(14, "CNPJ must have 14 digits")
      .max(14, "CNPJ must have 14 digits")
      .when(["email", "username"], {
        is: (email: string, username: string) => !email && !username,
        then: yup.string().required(),
      }),
    username: yup
      .string()
      .transform((value) => value.toLowerCase())
      .when(["cnpj", "email"], {
        is: (cnpj: string, email: string) => !cnpj && !email,
        then: yup.string().required(),
      }),
    password: yup.string().required(),
  },
  [
    ["cnpj", "username"],
    ["email", "username"],
    ["cnpj", "email"],
  ]
);

export default loginUserSchema;
