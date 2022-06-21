import * as yup from "yup";

export const advertUpdateSchema = yup.object().shape(
  {
    title: yup.string().notRequired(),
    apliedPrice: yup.string().notRequired(),
    description: yup.string().notRequired(),
    linkAdverts: yup.string().notRequired(),
    image: yup.string().notRequired(),
    category: yup.string().notRequired(),
  },
);

const serializedUpdateAdvertSchema = yup.object().shape({
    title: yup.string().notRequired(),
    apliedPrice: yup.number().notRequired(),
    linkAdverts: yup.string().notRequired(),
    image: yup.string().notRequired(),
    category: yup.string().notRequired(),
  });
  
export default serializedUpdateAdvertSchema;
  