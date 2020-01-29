export declare type tCountry = {
    name: string;
    dialCode: string;
    cc2: string;
    priority: number;
    areaCodes: string[];
};
declare const _default: {
    countries: {
        [key: string]: tCountry;
    };
    dialCodeToCc2: {
        [key: string]: string[];
    };
};
export default _default;
