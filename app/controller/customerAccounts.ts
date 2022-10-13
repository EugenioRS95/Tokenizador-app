import { Context } from "aws-lambda";
import { MessageUtil } from '../utils/message';
import { validateCustomerBody, validateHeaderPK,getMonthNumberString,getIdToken } from "../utils/validateCustomerFelds";

import { CreateCustomerAccountDTO } from "../model/dto/createCustomerAccountDTO";
import { v4 } from 'uuid';
import { generate } from 'rand-token';
import { CustomerAccountServiceImpl } from "../service/serviceImpl/customerAccountServiceImpl";

export class CustomerAccountsController {
    private customerAccountsService: CustomerAccountServiceImpl;

    constructor(customerAccountsService: CustomerAccountServiceImpl){
        this.customerAccountsService = customerAccountsService;
    }

    async generateToken (event: any, context?: Context) {
        console.log('functionName', context?.functionName);
        const params: CreateCustomerAccountDTO = JSON.parse(event.body);  
        
        validateHeaderPK(event.headers['Authorization'].split(" ")[1]);
        validateCustomerBody(params);

        try {
            const account = await this.customerAccountsService.createCustomerAccount({
                id: v4(),
                email: params.email,
                card_number: params.card_number,
                cvv: params.cvv,
                expiration_year: params.expiration_year,
                expiration_month: getMonthNumberString(params.expiration_month),
                token: generate(16)                
            });
            if(!account) {
                return MessageUtil.error(1000, "Ha ocurrido un error al registrar el cliente");
            }
            
            return MessageUtil.success({token: account['token']});
        } catch(err) {   
            return MessageUtil.error(err.getCode(), err.message);
        }
    }

    async getCustomerAccount(event: any, context?: Context){
        console.log('functionName', context?.functionName);       
        
        validateHeaderPK(event.headers['Authorization'].split(" ")[1]);

        const idToken = getIdToken(event.headers['Authorization'].split(" ")[1]);
        
        try{
            let customer = await this.customerAccountsService.getToken(idToken);
            
            return MessageUtil.success({
                email: customer[0].email,
                card_number: customer[0].card_number,
                expiration_year: customer[0].expiration_year,
                expiration_month: customer[0].expiration_month
            });

        } catch(err) {
            return MessageUtil.error(err.code, err.message);
        }
    }
}