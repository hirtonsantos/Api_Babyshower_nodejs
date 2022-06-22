import * as yup from "yup";

const updateAdvertSchema = yup.object().shape({
  title: yup.string().notRequired(),
  description: yup.string().notRequired(),
  linkAdverts: yup.string().notRequired(),
  image: yup.string().notRequired(),
  category: yup
    .string()
    .notRequired()
    .transform((value) => value.toLowerCase()),
  apliedPrice: yup.number().notRequired(),
});

export default updateAdvertSchema;