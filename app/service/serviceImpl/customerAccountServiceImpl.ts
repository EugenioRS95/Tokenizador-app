import { CreateCustomerAccountDTO } from "../../model/dto/createCustomerAccountDTO";
import { ICustomerAccountService } from "../customerAccountsService";
import { customerAccounts } from '../../model';
import { CustomError } from "../../utils/customError";

export class CustomerAccountServiceImpl implements ICustomerAccountService {
    
    async createCustomerAccount(obj: CreateCustomerAccountDTO): Promise<object> {
        try{
            const result = await customerAccounts.create({
                id: obj.id,
                email: obj.email,
                card_number: obj.card_number,
                cvv: obj.cvv,
                expiration_year: obj.expiration_year,
                expiration_month: obj.expiration_month,
                token: obj.token
            });
            return result;
            
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getToken(idToken: string) {
        try{
            const customer = await customerAccounts.find({token: idToken});
            if(customer.length === 0 ){
                throw new CustomError(1012, 'El token ha expirado.');
            }
            return customer;
        } catch(err) {
            throw err;
            
        }        
    }
}