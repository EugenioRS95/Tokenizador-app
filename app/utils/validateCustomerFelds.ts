import { CreateCustomerAccountDTO } from "../model/dto/createCustomerAccountDTO";
import { CustomError } from "./customError";


function validateCardNumberLength(cardNumber: number): boolean{
    const cardNumberLength = cardNumber.toString().split('').length;

    if((cardNumberLength<13) || (cardNumberLength >16)){
        throw new CustomError(1001, 'Longitud de tarjeta inválida.');
    }
    return true;
}

function validateCardNumberPattern(cardNumber: number): boolean {
    const pattern = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
    const cardNumberString = cardNumber.toString();

    if(!pattern.test(cardNumberString)) {
        throw new CustomError(1002, 'El número de tarjeta no corresponde a una tarjeta de crédito o débito.');
    }
    return true;
}

function validateCvvLength(cvvNumber: number) {
    const cvvNumberLength = cvvNumber.toString().split('').length;
        if((cvvNumberLength<3) || (cvvNumberLength >4)){
            throw new CustomError(1003, 'Longitud de cvv inválido.');
        }
        return true;
}

function getCardType(cvvNumber: number) {
    switch (cvvNumber) {
        case 123:
            console.log("Card Type: Visa / Mastercard");
            return "Visa / MasterCard";
            break;
        case 4532:
            console.log("Card Type: Amex")
            return "Amex";
            break;
        default:
            console.log("No registrado");
            throw new CustomError(1004, 'Tipo de tarjeta no registrado.');
            break;
    }
}

function validateExpirationMonthLength(expirationMonth: string): boolean {
    const expirationMonthLength = expirationMonth.split('').length;
        if((expirationMonthLength<1) || (expirationMonthLength >2)){
            throw new CustomError(1005, 'Longitud de mes de expiración inválido.');
        }
        return true;
}

function validateExpirationMonthNumber(expirationMonth: string): boolean {
    const expirationMonthNumber = +expirationMonth;
        if((expirationMonthNumber < 1) || (expirationMonthNumber>12)){
            throw new CustomError(1006, 'Número de mes de expiración inválido.');
        }
        return true;
}

function validateExpirationYearLength(expirationYear: string): boolean {
    const expirationYearLength = expirationYear.split('').length;
        if((expirationYearLength !== 4)){
            throw new CustomError(1007, 'Longitud de año de expiración inválido.');
        }
        return true;
}

function validateExpirationYearRange(expirationYear: string): boolean {
    const expirationYearNumber = +expirationYear;
        let actuallyYear = new Date();

        if((expirationYearNumber < actuallyYear.getFullYear()) || (expirationYearNumber > (actuallyYear.getFullYear()+5))) {
            throw new CustomError(1008, 'Año de expiración fuera de rango.');
        }

        return true;
}

function validateEmailLength(email: string): boolean {
    const emailLength = email.split('').length;
        if((emailLength < 5) || (emailLength > 100)){
            throw new CustomError(1009, 'Longitud de email fuera de rango.');
        }
        return true;
}

function validateDomainEmail(email: string){
    const emailDomain = email.split("@")[1];

    switch (emailDomain) {
        case "gmail.com":
            console.log("Email Domain: Gmail.");
            return "Gmail";
            break;
        case "hotmail.com":
            console.log("Email Domain: Hotmail.");
            return "Hotmail";
            break;
        case "yahoo.es":
            console.log("Email Domain: Yahoo.");
            return "Yahoo";
            break;
        default:
            console.log("Email Domain: No registrado.");
            throw new CustomError(1010, 'Dominio de email inválido.');
            break;
    }
}

export function getMonthNumberString(expirationMonth: string){
    const expirationMonthNumber = +expirationMonth;
        if(expirationMonthNumber < 10){
            return "0".concat(expirationMonthNumber.toString())
        }
    return expirationMonthNumber.toString();
}

export function validateHeaderPK(pkString: string) {
    const pkArr = pkString.split("_");
        const pkValue = pkArr[0];
        const businessValue = pkArr[1];

        if((businessValue !== "tknzr") || (pkValue !== "pk")) {
            throw new CustomError(2000, 'Pk de negocio incorrecto.');
        }
        return true;
}

export function getIdToken(token: string){
    const pkArr = token.split("_");
        const tokenValue = pkArr[2];
        if(pkArr.length === 3) {
            return tokenValue;
        }
    throw new CustomError(1011, 'No se ha introducido el token.');;
}

export function validateCustomerBody(body: CreateCustomerAccountDTO){
    
    try {
        validateCardNumberLength(body.card_number);
        validateCardNumberPattern(body.card_number);
        validateCvvLength(body.cvv);
        getCardType(body.cvv);
        validateExpirationMonthLength(body.expiration_month);
        validateExpirationMonthNumber(body.expiration_month);
        validateExpirationYearLength(body.expiration_year);
        validateExpirationYearRange(body.expiration_year);
        validateEmailLength(body.email);
        validateDomainEmail(body.email);
        
    } catch(err) {
        console.log("err.mensaje: ",err.message);
        console.log("err.code: ",err.code);
        throw err;
    }
}