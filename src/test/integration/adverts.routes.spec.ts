import {
  generateAdministrator,
  generateAdvert,
  generateCompany,
  generateToken,
  IAdministrator,
  IAdvert,
  ICompany,
} from "..";
import { Advert } from "../../entities/adverts.entity";
import supertest from "supertest";
import app from "../../app";
import { validate, v4 as uuid } from "uuid";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Company } from "../../entities/companies.entity";
import { Administrator } from "../../entities/administrators.entity";
import { CategoryAdvert } from "../../entities/categoryAdverts.entity";
/*
describe("Create advert route by company | Integration Test", () => {
  let connection: DataSource;

  let tokenAdm: string;
  let tokenCompany: string;
  let advert: Partial<IAdvert> = generateAdvert();
  let adm: Administrator;
  let company: Company;
  let otherCompany: Company;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const newInstance = (generate: ICompany | IAdministrator): any => {
      const { password, ...newPayload } = generate;
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    };

    //add admnistrator
    const admRepo = connection.getRepository(Administrator);
    adm = Object.assign(
      new Administrator(),
      newInstance(generateAdministrator())
    );
    adm = await admRepo.save(adm);
    tokenAdm = generateToken(adm.id as string);

    //add company
    const companyRepo = connection.getRepository(Company);
    company = Object.assign(new Company(), newInstance(generateCompany()));
    company = await companyRepo.save(company);
    tokenCompany = generateToken(company.id as string);

    //add other company
    otherCompany = Object.assign(new Company(), newInstance(generateCompany()));
    otherCompany = await companyRepo.save(otherCompany);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Advert as JSON response | Status code 201", async () => {
    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...advert });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...advert }));
  });

  it("Return: Advert as JSON response image and linkAdverts as undefined | Status code 201", async () => {
    const { image, linkAdverts, ...newAdvert } = advert;

    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...newAdvert });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(response.body).toHaveProperty(["image"]);
    expect(response.body).toHaveProperty(["linkAdverts"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...newAdvert }));
  });

  it("Return: Advert as JSON response token ADM | Status code 201", async () => {
    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + tokenAdm)
      .send({ ...advert });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["id"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...advert }));
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .send({ ...advert });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token",
    });
  });

  it("Return: Body error, missing some mandatory-key | Status code: 400", async () => {
    const { title, description, ...newAdvert } = advert;

    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...newAdvert });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      errors: ["password is a required field"],
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .post(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ ...advert });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permission | Status code: 403", async () => {
    const response = await supertest(app)
      .post(`/adverts/byCompany/${otherCompany.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...advert });

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      Error: "You are not allowed to access this information",
    });
  });

  it("Return: Body error, company not found | Status code: 404", async () => {
    const response = await supertest(app)
      .post(`/adverts/byCompany/${adm.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...advert });

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      Message: "Company not found",
    });
  });
}); */ 

/*describe("Get adverts by company | Integration Test", () => {
  let connection: DataSource;

  let tokenAdm: string;
  let tokenCompany: string;
  let tokenOtherCompany: string;
  let adverts: Advert[] = [];
  let company: Company;
  let adm: Administrator;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const newInstance = (generate: ICompany | IAdministrator): any => {
      const { password, ...newPayload } = generate;
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    };
    
    //add categories
    const categoryRepo = connection.getRepository(CategoryAdvert);
    const categoariesTitles = ["Black", "Premium", "Platinum"]
    for(let i = 0; i <=2; i ++){
      let category = new CategoryAdvert()
      category = Object.assign(category, {
        "title": categoariesTitles[i],
        "price": 100,
        "description": "teste"
      })
      categoryRepo.save(category)
    }

    //add admnistrator
    const admRepo = connection.getRepository(Administrator);
    adm = Object.assign(
      new Administrator(),
      newInstance(generateAdministrator())
    );
    adm = await admRepo.save(adm);
    tokenAdm = generateToken(adm.id as string);

    //add company
    const companyRepo = connection.getRepository(Company);
    company = Object.assign(new Company(), newInstance(generateCompany()));
    company = await companyRepo.save(company);
    tokenCompany = generateToken(company.id as string);

    //add other company
    let otherCompany = Object.assign(
      new Company(),
      newInstance(generateCompany())
    );
    otherCompany = await companyRepo.save(otherCompany);
    tokenOtherCompany = generateToken(otherCompany.id as string);

    //insert 10 adverts for company
    const advertRepo = connection.getRepository(Advert);
    for (let i = 1; i <= 10; i++) {
      let payloadAdvert = generateAdvert();
      const category = await categoryRepo.findOneBy({
        title: i <= 5 ? "Premium" : i <= 7 ? "Platinum" : "Black",
      });

      const advert = await advertRepo.save(
        Object.assign(new Advert(), {
          ...payloadAdvert,
          company: company,
          category: category,
        })
      );
      adverts.push(advert);
    }
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Adverts as JSON response | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(8);
    // expect(response.body[0]).toEqual(expect.objectContaining(adverts[0]));
  });

  it("Return: Adverts as JSON response ADM | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + tokenAdm);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(8);
  });

  it("Return: Companies as JSON response page 2 | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/adverts/byCompany/${company.id}?page=2`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  it("Return: Companies as JSON response perPage 4 | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/adverts/byCompany/${company.id}?perPage=4`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(4);
  });

  it("Return: Companies as JSON response page 3 perPage 4 | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/adverts/byCompany/${company.id}?page=3&perPage=4`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  it("Return: Companies as JSON response category Premium | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/adverts/byCompany/${company.id}?category=Premium`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(5);
  });

  it("Return: Companies as JSON response category platinum | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/adverts/byCompany/${company.id}?category=platinum`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  it("Return: Companies as JSON response category blACk | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/adverts/byCompany/${company.id}?category=bLACk`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(3);
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app).get(
      `/adverts/byCompany/${company.id}`
    );

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token",
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .get(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permission | Status code: 403", async () => {
    const response = await supertest(app)
      .get(`/adverts/byCompany/${company.id}`)
      .set("Authorization", "Bearer " + tokenOtherCompany);

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      Error: "You can't access information of another company",
    });
  });

  it("Return: Body error, company not found | Status code: 404", async () => {
    const response = await supertest(app)
      .get(`/adverts/byCompany/${adm.id}`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      Message: "Company not found",
    });
  });
}); */
/*
describe("Get adverts | Integration Test", () => {
  let connection: DataSource;

  let adverts: Advert[] = [];

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const newInstance = (generate: ICompany | IAdministrator): any => {
      const { password, ...newPayload } = generate;
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    };

    //insert 10 companies with 1 advert
    const companyRepo = connection.getRepository(Company);
    const advertRepo = connection.getRepository(Advert);
    const categoryRepo = connection.getRepository(CategoryAdvert);
    for (let i = 1; i <= 10; i++) {
      let company: Company = Object.assign(
        new Company(),
        newInstance(generateCompany())
      );
      company = await companyRepo.save(company);

      let payloadAdvert = generateAdvert();
      const category = await categoryRepo.findOneBy({
        title: i <= 5 ? "Premium" : i <= 7 ? "Platinum" : "Black",
      });

      const advert = await advertRepo.save(
        Object.assign(new Advert(), {
          ...payloadAdvert,
          company: company,
          category: category,
        })
      );
      adverts.push(advert);
    }
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Adverts as JSON response | Status code: 200", async () => {
    const response = await supertest(app).get("/adverts");

    const { id, linkAdverts, image } = adverts[0];

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(8);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id,
        linkAdverts,
        image,
      })
    );
  });

  it("Return: Companies as JSON response page 2 | Status code: 200", async () => {
    const response = await supertest(app).get("/adverts?page=2");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  it("Return: Companies as JSON response perPage 4 | Status code: 200", async () => {
    const response = await supertest(app).get("/adverts?perPage=4");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(4);
  });

  it("Return: Companies as JSON response page 3 perPage 4 | Status code: 200", async () => {
    const response = await supertest(app).get("/adverts?page=3&perPage=4");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  it("Return: Companies as JSON response category Premium | Status code: 200", async () => {
    const response = await supertest(app).get("/adverts?category=Premium");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(5);
  });

  it("Return: Companies as JSON response category platinum | Status code: 200", async () => {
    const response = await supertest(app).get("/adverts?category=platinum");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  });

  it("Return: Companies as JSON response category blACk | Status code: 200", async () => {
    const response = await supertest(app).get("/adverts?category=blACk");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(3);
  });
}); */

describe("Get advert route | Integration Test", () => {
  let connection: DataSource;

  let tokenCompany: string;
  let tokenAdm: string;
  let tokenOtherCompany: string;
  let advert: Advert;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const newInstance = (generate: ICompany | IAdministrator): any => {
      const { password, ...newPayload } = generate;
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    };

    //add admnistrator
    const admRepo = connection.getRepository(Administrator);
    let adm: Administrator = Object.assign(
      new Administrator(),
      newInstance(generateAdministrator())
    );
    adm = await admRepo.save(adm);
    tokenAdm = generateToken(adm.id as string);

    //insert logged company
    const companyRepo = connection.getRepository(Company);
    let company = Object.assign(new Company(), newInstance(generateCompany()));
    company = await companyRepo.save(company);
    tokenCompany = generateToken(company.id as string);

    //insert otherCompany
    let otherCompany = Object.assign(
      new Company(),
      newInstance(generateCompany())
    );
    otherCompany = await companyRepo.save(otherCompany);
    tokenOtherCompany = generateToken(otherCompany.id as string);
    
    //add categories
    const categoryRepo = connection.getRepository(CategoryAdvert);
    const categoariesTitles = ["Black", "Premium", "Platinum"]
    for(let i = 0; i <=2; i++){
      let catego = new CategoryAdvert()
      catego = Object.assign(catego, {
        "title": categoariesTitles[i],
        "price": 100,
        "description": "teste"
      })
      categoryRepo.save(catego)
    }

    //insert newAdvert for company
    const advertRepo = connection.getRepository(Advert);
    //const categoryRepo = connection.getRepository(CategoryAdvert);
    const payloadAdvert = generateAdvert();
    const category = await categoryRepo.findOneBy({
      title: "Premium",
    });
    console.log(category)

    advert = await advertRepo.save(
      Object.assign(new Advert(), {
        ...payloadAdvert,
        company: company,
        category: category,
      })
    );
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Advert as JSON response | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + tokenCompany);
    const { company, category, ...newAdvert } = advert;
    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty("passwordHash");
    expect(response.body).toEqual(
      expect.objectContaining({
        ...newAdvert,
        // category: category.title,
      })
    );
  });

  it("Return: Advert as JSON response | Status code: 200", async () => {
    const response = await supertest(app)
      .get(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + tokenAdm);
    const { company, category, ...newAdvert } = advert;
    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty("passwordHash");
    expect(response.body).toEqual(
      expect.objectContaining({
        ...newAdvert,
        // companyId: company.id,
        // category: category.title,
      })
    );
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app).get(`/adverts/${advert.id}`);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token",
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .get(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const response = await supertest(app)
      .get(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + tokenOtherCompany);

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      Error: "You can't access information of another company",
    });
  });

  it("Return: Body error, not Found | Status code: 404", async () => {
    const response = await supertest(app)
      .get(`/adverts/${"idNotExistent"}`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      Message: "Company not found",
    });
  });
});

/* describe("Update advert route | Integration Test", () => {
  let connection: DataSource;

  let tokenAdm: string;
  let tokenCompany: string;
  let tokenOtherCompany: string;
  let advert: Advert;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const newInstance = (generate: ICompany | IAdministrator): any => {
      const { password, ...newPayload } = generate;
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    };

    //add admnistrator
    const admRepo = connection.getRepository(Administrator);
    let adm = Object.assign(
      new Administrator(),
      newInstance(generateAdministrator())
    );
    adm = await admRepo.save(adm);
    tokenAdm = generateToken(adm.id as string);

    //add company
    const companyRepo = connection.getRepository(Company);
    let company = Object.assign(new Company(), newInstance(generateCompany()));
    company = await companyRepo.save(company);
    tokenCompany = generateToken(company.id as string);

    //add otherCompany
    let otherCompany = Object.assign(
      new Company(),
      newInstance(generateCompany())
    );
    otherCompany = await companyRepo.save(otherCompany);
    tokenOtherCompany = generateToken(otherCompany.id as string);

    //add advert for company
    const advertRepo = connection.getRepository(Advert);
    const categoryRepo = connection.getRepository(CategoryAdvert);
    const payloadAdvert = generateAdvert();
    const category = await categoryRepo.findOneBy({
      title: "Premium",
    });

    advert = await advertRepo.save(
      Object.assign(new Advert(), {
        ...payloadAdvert,
        company: company,
        category: category,
      })
    );
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: No body response | Status code: 204", async () => {
    const newInformation = generateAdvert();

    const response = await supertest(app)
      .patch(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...newInformation });

    const { category, ...newPayload } = newInformation;

    const advertRepo = connection.getRepository(Advert);
    const updatedAdvert = await advertRepo.findOneBy({ id: advert.id });

    expect(response.status).toBe(204);
    expect(updatedAdvert?.category.title).toStrictEqual(category);
    expect(updatedAdvert).toEqual(expect.objectContaining({ ...newPayload }));
  });

  it("Return: No body response updating by ADM | Status code: 204", async () => {
    const newInformation = generateAdvert();

    const response = await supertest(app)
      .patch(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + tokenAdm)
      .send({ ...newInformation });

    const { category, ...newPayload } = newInformation;

    const advertRepo = connection.getRepository(Advert);
    const updatedAdvert = await advertRepo.findOneBy({ id: advert.id });

    expect(response.status).toBe(204);
    expect(updatedAdvert?.category.title).toStrictEqual(category);
    expect(updatedAdvert).toEqual(expect.objectContaining({ ...newPayload }));
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app)
      .patch(`/adverts/${advert.id}`)
      .send({ ...generateAdvert() });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token.",
    });
  });

  it("Return: Body error, invalid information | Status code: 400", async () => {
    const newInformation = { title: 126, apliedPrice: "1263" };

    const response = await supertest(app)
      .patch(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...newInformation });

    expect(response.status).toBe(400);
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .patch(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ ...generateAdvert() });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const response = await supertest(app)
      .patch(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + tokenOtherCompany)
      .send({ ...generateAdvert() });

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      Error: "You can't access information of another company",
    });
  });

  it("Return: Body error, advert not Found | Status code: 404", async () => {
    const response = await supertest(app)
      .patch(`/adverts/${"idNotExist"}`)
      .set("Authorization", "Bearer " + tokenCompany)
      .send({ ...generateCompany() });

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      Message: "Advert not found",
    });
  });
}); */

/* describe("Delete advert route | Integration Test", () => {
  let connection: DataSource;

  let tokenAdm: string;
  let tokenCompany: string;
  let tokenOtherCompany: string;
  let advert: Advert;

  beforeEach(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const newInstance = (generate: ICompany | IAdministrator): any => {
      const { password, ...newPayload } = generate;
      return {
        ...newPayload,
        passwordHash: "passwordHash",
      };
    };

    //add admnistrator
    const admRepo = connection.getRepository(Administrator);
    let adm = Object.assign(
      new Administrator(),
      newInstance(generateAdministrator())
    );
    adm = await admRepo.save(adm);
    tokenAdm = generateToken(adm.id as string);

    //add company
    const companyRepo = connection.getRepository(Company);
    let company = Object.assign(new Company(), newInstance(generateCompany()));
    company = await companyRepo.save(company);
    tokenCompany = generateToken(company.id as string);

    //add otherCompany
    let otherCompany = Object.assign(
      new Company(),
      newInstance(generateCompany())
    );
    otherCompany = await companyRepo.save(otherCompany);
    tokenOtherCompany = generateToken(otherCompany.id as string);

    //add advert for company
    const advertRepo = connection.getRepository(Advert);
    const categoryRepo = connection.getRepository(CategoryAdvert);
    const payloadAdvert = generateAdvert();
    const category = await categoryRepo.findOneBy({
      title: "Premium",
    });

    advert = await advertRepo.save(
      Object.assign(new Advert(), {
        ...payloadAdvert,
        company: company,
        category: category,
      })
    );
  });

  afterEach(async () => {
    await connection.destroy();
  });

  it("Return: No body response | Status code: 204", async () => {
    const response = await supertest(app)
      .delete(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + tokenCompany);

    const advertRepo = connection.getRepository(Advert);
    const deletedAdvert = await advertRepo.findOneBy({ id: advert.id });

    expect(response.status).toBe(204);
    expect(deletedAdvert).toBeFalsy;
  });

  it("Return: No body response updating by ADM | Status code: 204", async () => {
    const response = await supertest(app)
      .delete(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + tokenAdm);

    const advertRepo = connection.getRepository(Advert);
    const deletedAdvert = await advertRepo.findOneBy({ id: advert.id });

    expect(response.status).toBe(204);
    expect(deletedAdvert).toBeFalsy;
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app).delete(`/adverts/${advert.id}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      Error: "Missing authorization token.",
    });
  });

  it("Return: Body error, invalid token | Status code: 401", async () => {
    const token = "invalidToken";

    const response = await supertest(app)
      .delete(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      Error: "Invalid Token",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const response = await supertest(app)
      .delete(`/adverts/${advert.id}`)
      .set("Authorization", "Bearer " + tokenOtherCompany);

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      Error: "You can't access information of another company",
    });
  });

  it("Return: Body error, advert not Found | Status code: 404", async () => {
    const response = await supertest(app)
      .delete(`/adverts/${"idNotExist"}`)
      .set("Authorization", "Bearer " + tokenCompany);

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      Message: "Advert not found",
    });
  });
}); */
