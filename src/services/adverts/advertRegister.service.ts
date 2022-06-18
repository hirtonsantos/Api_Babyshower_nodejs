import { Request } from "express";
import { AppDataSource } from "../../data-source";
import { Advert } from "../../entities/adverts.entity";
import { CategoryAdvert } from "../../entities/categoryAdverts.entity";
import { Company } from "../../entities/companies.entity";
import { AppError } from "../../errors/appError";

// Middleware to find company ✅
// Middleware to verify if logged user is adm ✅
// Middleware to check if logged user owns the company (company id) ✅

const advertRegisterService = async (
  { validatedAdvert }: Request,
  companyId: string
) => {
  // The companyId is making through
  // The validatedAdvert is making trough
  const categoryRepository = AppDataSource.getRepository(CategoryAdvert);
  const categories = await categoryRepository.find();

  const category = categories.find(
    (category) => category.title.toLowerCase() === validatedAdvert.category
  );

  if (!category) {
    throw new AppError(404, { Error: "Category not found" });
  }

  if (validatedAdvert.apliedPrice === null) {
    validatedAdvert.apliedPrice = category?.price as number;
  } else {
    validatedAdvert.apliedPrice = validatedAdvert.apliedPrice;
  }

  const companyRepository = AppDataSource.getRepository(Company);
  const companies = await companyRepository.find();

  const company = companies.find((company) => company.id === companyId);

  validatedAdvert.company = company as Company;
  validatedAdvert.category = category as CategoryAdvert;

  const advertRepository = AppDataSource.getRepository(Advert);

  const advert = Object.assign(new CategoryAdvert(), validatedAdvert);

  await advertRepository.save(advert as Advert);

  const advertClone: any = Object.assign({}, advert);

  ["company", "category"].forEach((e) => delete advertClone[e]);

  advertClone["company"] = advert.id;
  advertClone["category"] = category.title;

  return advertClone;
};

export default advertRegisterService;
