import { CreateCustomerAccountDTO } from "../model/dto/createCustomerAccountDTO";

export interface ICustomerAccountService {
    createCustomerAccount(obj: CreateCustomerAccountDTO): Promise<object>;
    getToken(idToken: string);
}