/**
 * OWebTelInput.js 2016-2019
 *
 * Emile Silas Sare (emile.silas@gmail.com)
 *
 * Thanks to https://github.com/jackocnr/intl-tel-input/
 */
import './utils.js';
import { tCountry } from './countries';
declare type tOptions = {
    cc2: string;
    phoneNumber: string;
    numberType: 'MOBILE';
    preferredCountries: string[];
    showSamplePlaceholder: boolean;
    allowedCountries: () => string[];
};
declare class OWebTelInput {
    private phoneNumber;
    private options;
    private currentCountry;
    constructor(options: any);
    setPhoneNumber(phoneNumber: string): this;
    setCountry(cc2: string): void;
    private _updateOptions;
    getCurrentCountry(): tCountry;
    getOptions(): tOptions;
    isValid(phoneNumber?: string): boolean;
    isPossible(phoneNumber?: string): boolean;
    isFor(type: string, phoneNumber?: string): boolean;
    getSample(isNationalMode?: boolean): string;
    getInput(format?: boolean): any;
    static isPhoneNumberPossible(phoneNumber: string, possible?: boolean): boolean;
    static getCountryWithCc2(cc2: string): tCountry;
    static getCountryWithDialCode(dialCode: string): tCountry | null;
    static getCountriesList(): {
        [key: string]: tCountry;
    };
    static getDialCode(str: string): string;
    private _getFormat;
}
export default OWebTelInput;
