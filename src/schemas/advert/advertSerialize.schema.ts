import * as yup from "yup";

const serializedUpdateAdvertSchema = yup.object().shape({
    title: yup.string(),
    apliedPrice: yup.string(),
    linkAdvert: yup.string(),
    image: yup.string(),
    category: yup.string(),
  });
  
export  default serializedUpdateAdvertSchema;
  