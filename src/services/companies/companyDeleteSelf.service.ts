import { AppDataSource } from "../../data-source";
import { Administrator } from "../../entities/administrators.entity";
import { Company } from "../../entities/companies.entity";
import { AppError } from "../../errors/appError";
import verifyIfAdmOrCompany from "../../test/utils/company/verifyIfAdmOrCompany";

const companyDeleteService = async (id: string /* , idToken: string */) => {
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
        }

        await companyRepository.delete(id);

        return true
    }
        
    if (!companyCurrent) {
        throw new AppError(404, { Message: "Company not found" });
    } */

  await companyRepository.delete(id);

  /* return true */
};

export default companyDeleteService;
