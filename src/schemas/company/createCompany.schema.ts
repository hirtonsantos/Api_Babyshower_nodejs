import * as yup from "yup";

const registerCompanySchema = yup.object().shape({
  username: yup.string().email().lowercase().required(),
});

export { registerCompanySchema };
