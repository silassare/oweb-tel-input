declare const countries: [string, string, string, number | null, string[] | null][];
export declare type tCountry = {
    name: string;
    dialCode: string;
    cc2: string;
    priority: number;
    areaCodes: string[];
};
declare let cc2ToCountry: {
    [key: string]: tCountry;
}, dialCodeToCc2: {
    [key: string]: string[];
};
export { countries, cc2ToCountry, dialCodeToCc2 };
