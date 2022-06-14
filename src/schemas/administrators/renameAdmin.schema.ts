import * as yup from "yup";

import * as bcrypt from "bcrypt";

const registerAdminSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .transform((value) => value.toLowerCase()),
  email: yup
    .string()
    .email()
    .required()
    .transform((value) => value.toLowerCase()),
  password: yup
    .string()
    .required()
    .transform((value) => bcrypt.hashSync(value, 10))
})

const serializedCreateUserSchema = yup.object().shape({
    id: yup.string().uuid().required(),
    username: yup.string().required(),
    email: yup.string().email().required()
});

export { registerAdminSchema, serializedCreateUserSchema };