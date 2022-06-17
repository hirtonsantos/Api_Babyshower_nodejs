import { Request } from "express";
import { AppDataSource } from "../../data-source";
import { Advert } from "../../entities/adverts.entity";
import { CategoryAdvert } from "../../entities/categoryAdverts.entity";
import { Company } from "../../entities/companies.entity";

const registerAdvertService = async (
  { validatedAdvert }: Request,
  companyId: string
) => {
  const advertRepository = AppDataSource.getRepository(Advert);
  const categoryRepository = AppDataSource.getRepository(CategoryAdvert);

  const category = await categoryRepository.findOne({
    where: {
      title: validatedAdvert.title.toLocaleLowerCase(),
    },
  });

  const companyRepository = AppDataSource.getRepository(Company);
  const companies = await companyRepository.find();

  const company = companies.find((company) => company.id === companyId);

  // Default price OR the price with the descount

  if (validatedAdvert.apliedPrice === null) {
    validatedAdvert.apliedPrice = category?.price as number;
  } else {
    validatedAdvert.apliedPrice =
      (category?.price as number) - validatedAdvert.apliedPrice;
  }

  validatedAdvert.company = company as Company;

  const advert = new Advert();

  await advertRepository.save(advert);
};

export default registerAdvertService;

// Middleware to find company ✅
// Middleware to verify if logged user is adm
// Middleware to check if logged user owns the company (company id)
