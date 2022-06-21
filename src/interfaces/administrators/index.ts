export interface IAdministrator {
  id: string;
  username: string;
  email: string;
}

export interface IAdministratorLogin {
  email: string;
  username: string;
  password: string;
  id?: number
}

export interface IAdministratorRegister {
  username: string;
  email: string;
  password: string;
}
