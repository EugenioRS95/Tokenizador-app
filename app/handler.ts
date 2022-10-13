import { Handler, Context } from 'aws-lambda';
import { CustomerAccountServiceImpl } from './service/serviceImpl/customerAccountServiceImpl';
import { CustomerAccountsController } from './controller/customerAccounts';
const customerAccountsController = new CustomerAccountsController(new CustomerAccountServiceImpl());

export const generateToken: Handler = (event: any, context: Context) => {
    return customerAccountsController.generateToken(event,context);
}

export const getCustomer: Handler = (event: any, context: Context) => {
    return customerAccountsController.getCustomerAccount(event,context);
}
