/**
 * OWebTelInput.js Since 2016
 *
 * Emile Silas Sare (emile.silas@gmail.com)
 *
 * Thanks to https://github.com/jackocnr/intl-tel-input/
 */
declare type OCountryItem = {
    0: string;
    1: string;
    2: string;
    3?: number | null;
    4?: string[] | null;
};
declare const countries: OCountryItem[];
export declare type OCountry = {
    name: string;
    dialCode: string;
    cc2: string;
    priority: number;
    areaCodes: string[] | null;
};
declare const cc2ToCountry: {
    [key: string]: OCountry;
}, dialCodeToCc2: {
    [key: string]: string[];
};
export { countries, cc2ToCountry, dialCodeToCc2 };
