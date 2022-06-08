import * as yup from "yup";

import * as bcrypt from "bcrypt";

const registerCompanySchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .transform((value) => value.toLowerCase()),
  email: yup
    .string()
    .email()
    .required()
    .transform((value) => value.toLowerCase()),
  passwordHash: yup
    .string()
    .required()
    .transform((value) => bcrypt.hashSync(value, 10)),
  razaoSocial: yup
    .string()
    .required()
    .transform((value) => value.toUpperCase()),
  cnpj: yup
    .string()
    .required()
    .matches(/\d+/g, "CNPJ can only have numbers")
    .min(11, "CNPJ must have 11 digits")
    .max(11, "CNPJ must have 11 digits"),
  phone: yup
    .string()
    .optional()
    .matches(/\(\d{2}\)\s9?\d{4}-\d{4}/, "Invalid phone number"),
  imageLogo: yup.string().optional(),
});

const serializedCreateUserSchema = yup.object().shape({
  id: yup.string().uuid().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  razaoSocial: yup.string().required(),
  cnpj: yup.string().required(),
  phone: yup.string().optional(),
});

export { registerCompanySchema, serializedCreateUserSchema };
