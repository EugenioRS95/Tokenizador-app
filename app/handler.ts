import { Handler, Context } from 'aws-lambda';
import dotenv from 'dotenv';
import path from 'path';
const dotenvPath = path.join(__dirname, '../', `config/.env.${process.env.NODE_ENV}`);
dotenv.config({
    path: dotenvPath,
});


import { customerAccounts, tokens } from './model';
import { CustomerAccountsController } from './controller/customerAccounts';
const customerAccountsController = new CustomerAccountsController(customerAccounts, tokens);

export const generateToken: Handler = (event: any, context: Context) => {
    return customerAccountsController.generateToken(event,context);
}

export const getCustomer: Handler = (event: any, context: Context) => {
    return customerAccountsController.getCustomerAccount(event,context);
}
