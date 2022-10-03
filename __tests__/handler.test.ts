import {describe, expect, test} from '@jest/globals';
import { CustomerAccountsController } from '../app/controller/customerAccounts';

import { customerAccounts, tokens } from '../app/model';
const customerAccountsController = new CustomerAccountsController(customerAccounts, tokens);


describe('JR Generador de Token',  () => {
    let token: string;
    test('Se envían datos de tarjeta de crédito/debito y se retorna un token', async() => {
    const event = {
        body: '{\r\n' +
    '    \r\n' +
    '    "email": "test@gmail.com",\r\n' +
    '    "card_number": 4919148339734773,\r\n' +
    '    "cvv": 123,\r\n' +
    '    "expiration_year": "2027",\r\n' +
    '    "expiration_month": "3"\r\n' +
    '}',
        headers: {
            Authorization: "Bearer pk_tknzr_"
        }        
    };

    const res = await customerAccountsController.generateToken(event);
    const obj = JSON.parse(res.body);
    token = obj.data.token;
    expect(obj).toEqual({
        "code": 0,
        "message": "success",
        "data": {
            "token": obj.data.token
        }
    });
    });

    test('Se envía el token y se retorna los datos de la tarjeta', async() => {
        const event = {
            headers: {
                Authorization: `Bearer pk_tknzr_${token}`
            }        
        };
    
        const res = await customerAccountsController.getCustomerAccount(event);
        const obj = JSON.parse(res.body);
        
        expect(obj).toEqual({
            "code": 0,
            "message": "success",
            "data": {
                "email": "test@gmail.com",
                "card_number": 4919148339734773,
                "expiration_year": "2027",
                "expiration_month": "03"
            }
        });
        })
});