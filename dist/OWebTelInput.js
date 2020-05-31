/**
 * OWebTelInput.js 2016-2019
 *
 * Emile Silas Sare (emile.silas@gmail.com)
 *
 * Thanks to https://github.com/jackocnr/intl-tel-input/
 */
import './utils.js';
import { cc2ToCountry, dialCodeToCc2 } from './countries';
const utils = window.intlTelInputUtils, defaultOptions = {
    cc2: 'bj',
    // nationalMode: false,
    phoneNumber: '',
    numberType: 'MOBILE',
    preferredCountries: ['bj'],
    showSamplePlaceholder: true,
    allowedCountries: () => [],
}, cleanPhoneString = function (str) {
    return ('+' +
        str
            .replace(/[^\d -]/g, '')
            .replace(/\s+/g, ' ')
            .replace(/-[^\d]/g, '-')
            .replace(/^[^1-9]+/g, ''));
};
class OWebTelInput {
    constructor(options) {
        this.phoneNumber = '';
        this.options = {};
        this.currentCountry = {};
        this._updateOptions(options);
    }
    setPhoneNumber(phoneNumber) {
        phoneNumber = cleanPhoneString(phoneNumber);
        const dialCode = OWebTelInput.getDialCode(phoneNumber);
        let formatted;
        if (dialCode) {
            this.currentCountry =
                OWebTelInput.getCountryWithDialCode(dialCode) ||
                    this.currentCountry;
            formatted = this._getFormat(phoneNumber);
            this.phoneNumber = formatted;
        }
        else {
            this.phoneNumber = phoneNumber;
        }
        return this;
    }
    setCountry(cc2) {
        const cc2Lower = cc2.toLowerCase();
        if (cc2ToCountry[cc2Lower]) {
            const opt = Object.assign({}, this.options);
            opt.cc2 = cc2Lower;
            opt.phoneNumber = '+' + cc2ToCountry[cc2Lower].dialCode;
            this._updateOptions(opt);
        }
        else {
            throw new Error('Unknown country code: ' + cc2);
        }
    }
    _updateOptions(options) {
        this.options = Object.assign({}, defaultOptions, options || this.options || {});
        this.currentCountry = OWebTelInput.getCountryWithCc2(this.options.cc2);
        if (!this.options.phoneNumber) {
            // if no phoneNumber initialize to default cc2 dialCode
            this.options.phoneNumber =
                '+' + cc2ToCountry[this.options.cc2.toLowerCase()].dialCode;
        }
        this.setPhoneNumber(this.options.phoneNumber);
        return this;
    }
    getCurrentCountry() {
        return this.currentCountry;
    }
    getOptions() {
        return this.options;
    }
    isValid(phoneNumber = this.phoneNumber) {
        return utils.isValidNumber(phoneNumber, this.currentCountry.cc2);
    }
    isPossible(phoneNumber = this.phoneNumber) {
        return (utils.getValidationError(phoneNumber, this.currentCountry.cc2) ===
            utils.validationError.IS_POSSIBLE);
    }
    isFor(type, phoneNumber = this.phoneNumber) {
        return (utils.getNumberType(phoneNumber, this.currentCountry.cc2) ===
            utils.numberType[type]);
    }
    getSample(isNationalMode = false) {
        const numberType = utils.numberType[this.options.numberType];
        return utils.getExampleNumber(this.currentCountry.cc2, Boolean(isNationalMode), numberType);
    }
    getInput(format = false) {
        return format
            ? this._getFormat(this.phoneNumber)
            : utils.formatNumber(this.phoneNumber, this.currentCountry.cc2);
    }
    static isPhoneNumberPossible(phoneNumber, possible = false) {
        const instance = new OWebTelInput({ phoneNumber });
        if (possible === true) {
            return instance.isPossible();
        }
        return (instance.isValid() ||
            (instance.isPossible() && instance.isFor('MOBILE')));
    }
    static getCountryWithCc2(cc2) {
        return cc2ToCountry[cc2.toLowerCase()];
    }
    static getCountryWithDialCode(dialCode) {
        let found = null;
        if (dialCode) {
            const cc2List = dialCodeToCc2[dialCode];
            for (let j = 0; j < cc2List.length; j++) {
                const first = cc2List[j]; // may be null so we let it and go to the next if exists
                if (first) {
                    found = OWebTelInput.getCountryWithCc2(first);
                    break;
                }
            }
        }
        return found;
    }
    static getCountriesList() {
        return cc2ToCountry;
    }
    static getDialCode(str) {
        const phoneNumber = String(str), numberReg = /[0-9]/;
        let dialCode = '';
        // only interested in international numbers (starting with a plus)
        if (phoneNumber.charAt(0) === '+') {
            let numericChars = '';
            // iterate over chars
            for (let i = 0; i < phoneNumber.length; i++) {
                const c = phoneNumber.charAt(i);
                // if char is phoneNumber
                if (numberReg.test(c)) {
                    numericChars += c;
                    // if current numericChars make a valid dial code
                    if (dialCodeToCc2[numericChars]) {
                        // store the actual raw string (useful for matching later)
                        dialCode = numericChars;
                    }
                    // longest dial code is 4 chars
                    if (numericChars.length === 4) {
                        break;
                    }
                }
            }
        }
        return dialCode;
    }
    _getFormat(phoneNumber, isNationalMode = false) {
        const run = phoneNumber && phoneNumber.trim().length > 1;
        if (run) {
            const format = isNationalMode || phoneNumber.charAt(0) !== '+'
                ? utils.numberFormat.NATIONAL
                : utils.numberFormat.INTERNATIONAL;
            phoneNumber = utils.formatNumber(phoneNumber, this.currentCountry.cc2, format);
        }
        return phoneNumber;
    }
}
export default OWebTelInput;
//# sourceMappingURL=OWebTelInput.js.map