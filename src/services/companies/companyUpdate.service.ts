import { Request } from "express";
import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";
import { AppError } from "../../errors/appError";
import verifyIfAdmOrCompany from "../../test/utils/company/verifyIfAdmOrCompany";

const companyUpdateService = async (
  id: string,
  /* idToken: string, */ { validated }: Request
) => {
  /* await verifyIfAdmOrCompany(idToken); */

  const companyRepository = AppDataSource.getRepository(Company);

  /* const tokenIdIsCompany: any = await companyRepository.findOne({
        where: {
        id: idToken,
        },
    });

    const companyCurrent = await companyRepository.findOne({
        where: {
        id: id,
        },
    });

    if (tokenIdIsCompany) {

        if (!companyCurrent || !tokenIdIsCompany) {

            throw new AppError(404, { Message: "Company not found" });
        }

        if (tokenIdIsCompany.id !== companyCurrent?.id) {
            throw new AppError(403, {
                Error: "You can't access information of another company",
            });
        } */

  await companyRepository.update(id, { ...validated });

  /* return true */
  /*  }

    if (!companyCurrent) {
        throw new AppError(404, { Message: "Company not found" });
    }

    await companyRepository.update(id, { ...validated })

    return true; */
};

export default companyUpdateService;
