import {Request} from "express"
import { AppDataSource } from "../../data-source"
import { Administrator } from "../../entities/administrators.entity"
import { IAdministratorRegister } from "../../interfaces/administrators"
import { serializedCreateUserSchema } from "../../schemas/administrators/renameAdmin.schema"

const administratorRegisterService = async ({username, email, password}: IAdministratorRegister) => {
    
    const adminRepository = AppDataSource.getRepository(Administrator)

    const admin = new Administrator();
    admin.username = username;
    admin.email = email;
    admin.passwordHash = password;

    await adminRepository.save(admin);
    
    return await serializedCreateUserSchema.validate(admin, {
        stripUnknown: true,
    });
}

export default administratorRegisterService