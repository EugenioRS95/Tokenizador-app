import { Context } from "aws-lambda";
import { Model } from "mongoose";
import { MessageUtil } from '../utils/message';
import { CustomerAccountsService } from '../service/customerAccounts';
import { CreateCustomerAccountDTO } from "../model/dto/createCustomerAccountDTO";
import { v4 } from 'uuid';
import { generate } from 'rand-token';
import { sign, verify } from 'jsonwebtoken';

export class CustomerAccountsController extends CustomerAccountsService {
    constructor(customerAccounts: Model<any>, tokens: Model<any>) {
        super(customerAccounts, tokens);
    }

    async generateToken (event: any, context?: Context) {
        console.log('functionName', context?.functionName);
        const params: CreateCustomerAccountDTO = JSON.parse(event.body);
        const idCustomer = v4();
        const idToken = generate(16);
        let newToken: string = "";
        let cardType: string = "";
        let domainEmail: string = "";
        
        if(!this.validateHeaderPK(event.headers['Authorization'].split(" ")[1])){
            return MessageUtil.error(2000, 'Pk de negocio incorrecto.');
        }

        if(!this.validateCardNumberLength(params.card_number)){
            return MessageUtil.error(1001, 'Longitud de tarjeta inválida.');
        }

        if(!this.validateCardNumberPattern(params.card_number)){
            return MessageUtil.error(1002, 'El número de tarjeta no corresponde a una tarjeta de crédito o débito.');
        }

        if(!this.validateCvvLength(params.cvv)){
            return MessageUtil.error(1003, 'Longitud de cvv inválido.');
        }

        cardType = this.getCardType(params.cvv);

        if( cardType.toLowerCase() === "none") {
            return MessageUtil.error(1004, 'Tipo de tarjeta no registrado.');
        }

        if(!this.validateExpirationMonthLength(params.expiration_month)) {
            return MessageUtil.error(1005, 'Longitud de mes de expiración inválido.');
        }

        if (!this.validateExpirationMonthNumber(params.expiration_month)) {
            return MessageUtil.error(1006, 'Número de mes de expiración inválido.');
        }

        if(!this.validateExpirationYearLength(params.expiration_year)){
            return MessageUtil.error(1007, 'Longitud de año de expiración inválido.');
        }

        if(!this.validateExpirationYearRange(params.expiration_year)) {
            return MessageUtil.error(1008, 'Año de expiración fuera de rango.');
        }

        if(!this.validateEmailLength(params.email)){
            return MessageUtil.error(1009, 'Longitud de email fuera de rango.');
        }

        domainEmail = this.validateDomainEmail(params.email);

        if(domainEmail.toLowerCase() === "none") {
            return MessageUtil.error(1010, 'Dominio de email inválido.');
        }

        newToken = sign({idCustomer: idCustomer}, process.env.SECRET_KEY,{
            expiresIn: 60*15
        });

        try {
            this.setIdToken(idToken, newToken);
        } catch(err){
            console.log(err);
            return MessageUtil.error(err.code, err.message);
        }        

        try {
            const account = await this.createCustomerAccount({
                id: idCustomer,
                email: params.email,
                card_number: params.card_number,
                cvv: params.cvv,
                expiration_year: params.expiration_year,
                expiration_month: this.getMonthNumberString(params.expiration_month)                 
            });
            if(!account) {
                return MessageUtil.error(1000, "Ha ocurrido un error al registrar el cliente");
            }

            const result = {token: idToken};

            return MessageUtil.success(result);
        } catch(err) {
            console.log(err);

            return MessageUtil.error(err.code, err.message);
        }
    }

    async getCustomerAccount(event: any, context?: Context){
        console.log('functionName', context?.functionName);
        let idToken: string = "";
        
        
        if(!this.validateHeaderPK(event.headers['Authorization'].split(" ")[1])){
            return MessageUtil.error(2000, 'Pk de negocio incorrecto.');
        }

        idToken = this.getIdToken(event.headers['Authorization'].split(" ")[1]);

        if(idToken === "none") {
            return MessageUtil.error(1011, 'No se ha introducido el token.');
        }
        
        try{
            const tk: object = await this.getToken(idToken);
            
            

            const decode = verify(tk[0].token, process.env.SECRET_KEY);
            const idCustomer = decode.idCustomer;
            const customer = await this.getCustomer(idCustomer);
        
            return MessageUtil.success({
                email: customer[0].email,
                card_number: customer[0].card_number,
                expiration_year: customer[0].expiration_year,
                expiration_month: customer[0].expiration_month
            });

        } catch(err) {
            console.log(err);

            if(err.message === "jwt expired") {
                return MessageUtil.error(1012, "El token ha expirado.");
            }

            if(err.message === "Cannot read property 'token' of undefined") {
                return MessageUtil.error(1014, "El token no existe.");
            }

            return MessageUtil.error(err.code, err.message);
        }


        
    }
}