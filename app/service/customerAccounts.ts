import { Model } from 'mongoose';
import { CreateCustomerAccountDTO } from '../model/dto/createCustomerAccountDTO';


export class CustomerAccountsService {
    private customerAccounts: Model<any>;
    private tokens: Model<any>;

    constructor(customerAccounts: Model<any>, tokens: Model<any>) {
        this.customerAccounts = customerAccounts;
        this.tokens = tokens;
    }

    protected async createCustomerAccount(params: CreateCustomerAccountDTO): Promise<object> {
        
        
        try{
            const result = await this.customerAccounts.create({
                id: params.id,
                email: params.email,
                card_number: params.card_number,
                cvv: params.cvv,
                expiration_year: params.expiration_year,
                expiration_month: params.expiration_month
            });
            return result;
            
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    protected validateCardNumberLength(cardNumber: number) {
        const cardNumberLength = cardNumber.toString().split('').length;

        if((cardNumberLength<13) || (cardNumberLength >16)){
            return false;
        }
        return true;
    }

    protected validateCardNumberPattern(cardNumber: number) {
        const pattern = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
        const cardNumberString = cardNumber.toString();

        return pattern.test(cardNumberString);
    }

    protected validateCvvLength(cvvNumber: number){
        const cvvNumberLength = cvvNumber.toString().split('').length;
        if((cvvNumberLength<3) || (cvvNumberLength >4)){
            return false;
        }
        return true;
    }

    protected getCardType(cvvNumber: number): string{
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
                return "none";
                break;
        }
    }

    protected validateExpirationMonthLength(expirationMonth: string) {
        const expirationMonthLength = expirationMonth.split('').length;
        if((expirationMonthLength<1) || (expirationMonthLength >2)){
            return false;
        }
        return true;
    }
    
    protected validateExpirationMonthNumber(expirationMonth: string) {
        const expirationMonthNumber = +expirationMonth;
        if((expirationMonthNumber < 1) || (expirationMonthNumber>12)){
            return false;
        }
        return true;
    }

    protected getMonthNumberString(expirationMonth: string) {
        const expirationMonthNumber = +expirationMonth;
        if(expirationMonthNumber < 10){
            return "0".concat(expirationMonthNumber.toString())
        }
        return expirationMonthNumber.toString();
    }

    protected validateExpirationYearLength(expirationYear: string) {
        const expirationYearLength = expirationYear.split('').length;
        if((expirationYearLength !== 4)){
            return false;
        }
        return true;
    }

    protected validateExpirationYearRange(expirationYear: string) {
        const expirationYearNumber = +expirationYear;
        let actuallyYear = new Date();

        if((expirationYearNumber < actuallyYear.getFullYear()) || (expirationYearNumber > (actuallyYear.getFullYear()+5))) {
            return false;
        }

        return true;
    }

    protected validateEmailLength(email: string) {
        const emailLength = email.split('').length;
        if((emailLength < 5) || (emailLength > 100)){
            return false;
        }
        return true;
    }

    protected validateDomainEmail(email: string) {
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
                return "none";
                break;
        }
    }

    protected validateHeaderPK(pkString: string) {
        const pkArr = pkString.split("_");
        const pkValue = pkArr[0];
        const businessValue = pkArr[1];

        if((businessValue !== "tknzr") || (pkValue !== "pk")) {
            return false;
        }
        return true;
    }

    protected async setIdToken(idToken: string, token: string) {
        try{
            await this.tokens.create({
                id: idToken,
                token: token
            });

        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    protected getIdToken(token: string){
        const pkArr = token.split("_");
        const tokenValue = pkArr[2];
        if(pkArr.length === 3) {
            return tokenValue;
        }
        return "none";
    }

    protected  getToken(idToken: string) {        
        return this.tokens.find({id: idToken});         
    }

    protected getCustomer(id: string) {
        return this.customerAccounts.find({id: id});
    }
}