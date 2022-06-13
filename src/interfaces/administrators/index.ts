export interface IAdministrator {
  id: string;
  username: string;
  email: string;
}

export interface IAdministratorLogin {
  email: string;
  password: string;
}

export interface IAdministratorRegister {
  username: string;
  email: string;
  password: string;
}
