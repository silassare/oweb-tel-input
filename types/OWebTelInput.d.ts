/**
 * OWebTelInput.js Since 2016
 *
 * Emile Silas Sare (emile.silas@gmail.com)
 *
 * Thanks to https://github.com/jackocnr/intl-tel-input/
 */
import './utils.js';
import { OCountry } from './countries';
declare type OOptions = {
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
    constructor(options?: Partial<OOptions>);
    setPhoneNumber(phoneNumber: string): this;
    setCountry(cc2: string): void;
    private _updateOptions;
    getCurrentCountry(): OCountry;
    getOptions(): OOptions;
    isValid(phoneNumber?: string): boolean;
    isPossible(phoneNumber?: string): boolean;
    isFor(type: string, phoneNumber?: string): boolean;
    getSample(isNationalMode?: boolean): string;
    getInput(format?: boolean): any;
    format(): string;
    static isPhoneNumberPossible(phoneNumber: string, possible?: boolean): boolean;
    static getCountryWithCc2(cc2: string): OCountry;
    static getCountryWithDialCode(dialCode: string): OCountry | null;
    static getCountriesList(): {
        [key: string]: OCountry;
    };
    static getDialCode(str: string): string;
    private _getFormat;
}
export default OWebTelInput;
