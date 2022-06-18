import * as yup from "yup";

const registerAdvertSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  linkAdverts: yup.string().notRequired(),
  image: yup.string().notRequired(),
  category: yup
    .string()
    .required()
    .transform((value) => value.toLowerCase()),
  apliedPrice: yup.number().notRequired(),
});

export default registerAdvertSchema;
