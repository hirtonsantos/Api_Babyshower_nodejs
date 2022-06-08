import * as yup from "yup";

const registerCompanySchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .transform((value) => value.lowercase()),
  email: yup
    .string()
    .email()
    .required()
    .transform((value) => value.lowercase()),
  password: yup.string().required(),
});

export { registerCompanySchema };
