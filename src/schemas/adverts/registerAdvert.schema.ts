import * as yup from "yup";

const categories = ["premium", "platinum", "black"];

const registerAdvertSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  linkAdvert: yup.string().optional(),
  image: yup.string().optional(),
  category: yup
    .string()
    .required()
    .transform((value) => value.toLowerCase())
    .oneOf(categories),
  apliedPrice: yup.number().optional(),
});

export default registerAdvertSchema;
