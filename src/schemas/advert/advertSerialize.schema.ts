import * as yup from "yup";

const registerAdvertSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().notRequired(),
  linkAdverts: yup.string().notRequired(),
  image: yup.string().notRequired(),
  category: yup
    .string()
    .notRequired()
    .transform((value) => value.toLowerCase()),
  apliedPrice: yup.number().required(),
});

export default registerAdvertSchema;
  