/**
 * OWebTelInput.js 2016-2019
 *
 * Emile Silas Sare (emile.silas@gmail.com)
 */
// thanks to https://github.com/jackocnr/intl-tel-input/
import './utils.js';
import { cc2ToCountry, dialCodeToCc2, } from './countries.js';
const utils = window.intlTelInputUtils, defaultOptions = {
    cc2: 'bj',
    //nationalMode: false,
    number: '',
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
    setPhoneNumber(number) {
        number = cleanPhoneString(number);
        let dialCode = OWebTelInput.getDialCode(number), formatted;
        if (dialCode) {
            this.currentCountry =
                OWebTelInput.getCountryWithDialCode(dialCode) ||
                    this.currentCountry;
            formatted = this._getFormat(number);
            this.phoneNumber = formatted;
        }
        else {
            this.phoneNumber = number;
        }
        return this;
    }
    setCountry(cc2) {
        let cc2Lower = cc2.toLowerCase();
        if (cc2ToCountry[cc2Lower]) {
            let opt = Object.assign({}, this.options);
            opt.cc2 = cc2Lower;
            opt.number = '+' + cc2ToCountry[cc2Lower].dialCode;
            this._updateOptions(opt);
        }
        else {
            throw new Error('Unknown country code: ' + cc2);
        }
    }
    _updateOptions(options) {
        this.options = Object.assign({}, defaultOptions, options || this.options || {});
        this.currentCountry = OWebTelInput.getCountryWithCc2(this.options.cc2);
        if (!this.options.number) {
            // if no number initialize to default cc2 dialCode
            this.options.number =
                '+' + cc2ToCountry[this.options.cc2.toLowerCase()].dialCode;
        }
        this.setPhoneNumber(this.options.number);
        return this;
    }
    getCurrentCountry() {
        return this.currentCountry;
    }
    getOptions() {
        return this.options;
    }
    isValid(number = this.phoneNumber) {
        return utils.isValidNumber(number, this.currentCountry.cc2);
    }
    isPossible(number = this.phoneNumber) {
        return (utils.getValidationError(number, this.currentCountry.cc2) ===
            utils.validationError.IS_POSSIBLE);
    }
    isFor(type, number = this.phoneNumber) {
        return (utils.getNumberType(number, this.currentCountry.cc2) ===
            utils.numberType[type]);
    }
    getSample(isNationalMode = false) {
        let numberType = utils.numberType[this.options.numberType];
        return utils.getExampleNumber(this.currentCountry.cc2, Boolean(isNationalMode), numberType);
    }
    getInput(format = false) {
        return format
            ? this._getFormat(this.phoneNumber)
            : utils.formatNumber(this.phoneNumber, this.currentCountry.cc2);
    }
    static isPhoneNumberPossible(number, possible = false) {
        let instance = new OWebTelInput({ number: number });
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
            let cc2List = dialCodeToCc2[dialCode];
            for (let j = 0; j < cc2List.length; j++) {
                let first = cc2List[j]; //may be null so we let it and go to the next if exists
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
        let dialCode = '', phoneNumber = String(str), numberReg = /[0-9]/;
        // only interested in international numbers (starting with a plus)
        if (phoneNumber.charAt(0) === '+') {
            let numericChars = '';
            // iterate over chars
            for (let i = 0; i < phoneNumber.length; i++) {
                let c = phoneNumber.charAt(i);
                // if char is number
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
    _getFormat(number, isNationalMode = false) {
        let run = number && number.trim().length > 1;
        if (run) {
            let format = isNationalMode || number.charAt(0) !== '+'
                ? utils.numberFormat.NATIONAL
                : utils.numberFormat.INTERNATIONAL;
            number = utils.formatNumber(number, this.currentCountry.cc2, format);
        }
        return number;
    }
}
export default OWebTelInput;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT1dlYlRlbElucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL09XZWJUZWxJbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsd0RBQXdEO0FBQ3hELE9BQU8sWUFBWSxDQUFDO0FBQ3BCLE9BQU8sRUFFTixZQUFZLEVBQ1osYUFBYSxHQUViLE1BQU0sZ0JBQWdCLENBQUM7QUFZeEIsTUFBTSxLQUFLLEdBQUksTUFBYyxDQUFDLGlCQUFpQixFQUM5QyxjQUFjLEdBQWE7SUFDMUIsR0FBRyxFQUFFLElBQUk7SUFDVCxzQkFBc0I7SUFDdEIsTUFBTSxFQUFFLEVBQUU7SUFDVixVQUFVLEVBQUUsUUFBUTtJQUNwQixrQkFBa0IsRUFBRSxDQUFDLElBQUksQ0FBQztJQUMxQixxQkFBcUIsRUFBRSxJQUFJO0lBQzNCLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7Q0FDMUIsRUFDRCxnQkFBZ0IsR0FBRyxVQUFTLEdBQVc7SUFDdEMsT0FBTyxDQUNOLEdBQUc7UUFDSCxHQUFHO2FBQ0QsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7YUFDdkIsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7YUFDcEIsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUM7YUFDdkIsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FDMUIsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVIO0lBS0MsWUFBWSxPQUFZO1FBSmhCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLFlBQU8sR0FBYSxFQUFjLENBQUM7UUFDbkMsbUJBQWMsR0FBYSxFQUFjLENBQUM7UUFHakQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsY0FBYyxDQUFDLE1BQWM7UUFDNUIsTUFBTSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxDLElBQUksUUFBUSxH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MEQ7d0JBQzFELFFBQVEsR0FBRyxZQUFZLENBQUM7cUJBQ3hCO29CQUNELCtCQUErQjtvQkFDL0IsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTt3QkFDOUIsTUFBTTtxQkFDTjtpQkFDRDthQUNEO1NBQ0Q7UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNqQixDQUFDO0lBRU8sVUFBVSxDQUNqQixNQUFjLEVBQ2QsaUJBQTBCLEtBQUs7UUFFL0IsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLElBQUksR0FBRyxFQUFFO1lBQ1IsSUFBSSxNQUFNLEdBQ1QsY0FBYyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRztnQkFDekMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUTtnQkFDN0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDO1lBQ3JDLE1BQU0sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUMxQixNQUFNLEVBQ04sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQ3ZCLE1BQU0sQ0FDTixDQUFDO1NBQ0Y7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7Q0FDRDtBQUVELGVBQWUsWUFBWSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIE9XZWJUZWxJbnB1dC5qcyAyMDE2LTIwMTlcclxuICpcclxuICogRW1pbGUgU2lsYXMgU2FyZSAoZW1pbGUuc2lsYXNAZ21haWwuY29tKVxyXG4gKi9cclxuXHJcbi8vIHRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vamFja29jbnIvaW50bC10ZWwtaW5wdXQvXHJcbmltcG9ydCAnLi91dGlscy5qcyc7XHJcbmltcG9ydCB7XHJcblx0dENvdW50cnksXHJcblx0Y2MyVG9Db3VudHJ5LFxyXG5cdGRpYWxDb2RlVG9DYzIsXHJcblx0Y291bnRyaWVzLFxyXG59IGZyb20gJy4vY291bnRyaWVzLmpzJztcclxuXHJcbnR5cGUgdE9wdGlvbnMgPSB7XHJcblx0Y2MyOiBzdHJpbmc7XHJcblx0Ly9uYXRpb25hbE1vZGU6IHRydWUsXHJcblx0bnVtYmVyOiBzdHJpbmc7XHJcblx0bnVtYmVyVHlwZTogJ01PQklMRSc7XHJcblx0cHJlZmVycmVkQ291bnRyaWVzOiBzdHJpbmdbXTtcclxuXHRzaG93U2FtcGxlUGxhY2Vob2xkZXI6IGJvb2xlYW47XHJcblx0YWxsb3dlZENvdW50cmllczogKCkgPT4gc3RyaW5nW107XHJcbn07XHJcblxyXG5jb25zdCB1dGlscyA9ICh3aW5kb3cgYXMgYW55KS5pbnRsVGVsSW5wdXRVdGlscyxcclxuXHRkZWZhdWx0T3B0aW9uczogdE9wdGlvbnMgPSB7XHJcblx0XHRjYzI6ICdiaicsXHJcblx0XHQvL25hdGlvbmFsTW9kZTogZmFsc2UsXHJcblx0XHRudW1iZXI6ICcnLFxyXG5cdFx0bnVtYmVyVHlwZTogJ01PQklMRScsXHJcblx0XHRwcmVmZXJyZWRDb3VudHJpZXM6IFsnYmonXSxcclxuXHRcdHNob3dTYW1wbGVQbGFjZWhvbGRlcjogdHJ1ZSxcclxuXHRcdGFsbG93ZWRDb3VudHJpZXM6ICgpID0+IFtdLFxyXG5cdH0sXHJcblx0Y2xlYW5QaG9uZVN0cmluZyA9IGZ1bmN0aW9uKHN0cjogc3RyaW5nKSB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQnKycgK1xyXG5cdFx0XHRzdHJcclxuXHRcdFx0XHQucmVwbGFjZSgvW15cXGQgLV0vZywgJycpXHJcblx0XHRcdFx0LnJlcGxhY2UoL1xccysvZywgJyAnKVxyXG5cdFx0XHRcdC5yZXBsYWNlKC8tW15cXGRdL2csICctJylcclxuXHRcdFx0XHQucmVwbGFjZSgvXlteMS05XSsvZywgJycpXHJcblx0XHQpO1xyXG5cdH07XHJcblxyXG5jbGFzcyBPV2ViVGVsSW5wdXQge1xyXG5cdHByaXZhdGUgcGhvbmVOdW1iZXI6IHN0cmluZyA9ICcnO1xyXG5cdHByaXZhdGUgb3B0aW9uczogdE9wdGlvbnMgPSB7fSBhcyB0T3B0aW9ucztcclxuXHRwcml2YXRlIGN1cnJlbnRDb3VudHJ5OiB0Q291bnRyeSA9IHt9IGFzIHRDb3VudHJ5O1xyXG5cclxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOiBhbnkpIHtcclxuXHRcdHRoaXMuX3VwZGF0ZU9wdGlvbnMob3B0aW9ucyk7XHJcblx0fVxyXG5cclxuXHRzZXRQaG9uZU51bWJlcihudW1iZXI6IHN0cmluZykge1xyXG5cdFx0bnVtYmVyID0gY2xlYW5QaG9uZVN0cmluZyhudW1iZXIpO1xyXG5cclxuXHRcdGxldCBkaWFsQ29kZSA9IE9XZWJUZWxJbnB1dC5nZXREaWFsQ29kZShudW1iZXIpLFxyXG5cdFx0XHRmb3JtYXR0ZWQ7XHJcblxyXG5cdFx0aWYgKGRpYWxDb2RlKSB7XHJcblx0XHRcdHRoaXMuY3VycmVudENvdW50cnkgPVxyXG5cdFx0XHRcdE9XZWJUZWxJbnB1dC5nZXRDb3VudHJ5V2l0aERpYWxDb2RlKGRpYWxDb2RlKSB8fFxyXG5cdFx0XHRcdHRoaXMuY3VycmVudENvdW50cnk7XHJcblx0XHRcdGZvcm1hdHRlZCA9IHRoaXMuX2dldEZvcm1hdChudW1iZXIpO1xyXG5cclxuXHRcdFx0dGhpcy5waG9uZU51bWJlciA9IGZvcm1hdHRlZDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucGhvbmVOdW1iZXIgPSBudW1iZXI7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRzZXRDb3VudHJ5KGNjMjogc3RyaW5nKSB7XHJcblx0XHRsZXQgY2MyTG93ZXIgPSBjYzIudG9Mb3dlckNhc2UoKTtcclxuXHRcdGlmIChjYzJUb0NvdW50cnlbY2MyTG93ZXJdKSB7XHJcblx0XHRcdGxldCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpO1xyXG5cdFx0XHRvcHQuY2MyID0gY2MyTG93ZXI7XHJcblx0XHRcdG9wdC5udW1iZXIgPSAnKycgKyBjYzJUb0NvdW50cnlbY2MyTG93ZXJdLmRpYWxDb2RlO1xyXG5cclxuXHRcdFx0dGhpcy5fdXBkYXRlT3B0aW9ucyhvcHQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGNvdW50cnkgY29kZTogJyArIGNjMik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91cGRhdGVPcHRpb25zKG9wdGlvbnM6IHRPcHRpb25zKTogdGhpcyB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxyXG5cdFx0XHR7fSxcclxuXHRcdFx0ZGVmYXVsdE9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnMgfHwgdGhpcy5vcHRpb25zIHx8IHt9XHJcblx0XHQpO1xyXG5cdFx0dGhpcy5jdXJyZW50Q291bnRyeSA9IE9XZWJUZWxJbnB1dC5nZXRDb3VudHJ5V2l0aENjMih0aGlzLm9wdGlvbnMuY2MyKTtcclxuXHJcblx0XHRpZiAoIXRoaXMub3B0aW9ucy5udW1iZXIpIHtcclxuXHRcdFx0Ly8gaWYgbm8gbnVtYmVyIGluaXRpYWxpemUgdG8gZGVmYXVsdCBjYzIgZGlhbENvZGVcclxuXHRcdFx0dGhpcy5vcHRpb25zLm51bWJlciA9XHJcblx0XHRcdFx0JysnICsgY2MyVG9Db3VudHJ5W3RoaXMub3B0aW9ucy5jYzIudG9Mb3dlckNhc2UoKV0uZGlhbENvZGU7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5zZXRQaG9uZU51bWJlcih0aGlzLm9wdGlvbnMubnVtYmVyKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGdldEN1cnJlbnRDb3VudHJ5KCk6IHRDb3VudHJ5IHtcclxuXHRcdHJldHVybiB0aGlzLmN1cnJlbnRDb3VudHJ5O1xyXG5cdH1cclxuXHJcblx0Z2V0T3B0aW9ucygpOiB0T3B0aW9ucyB7XHJcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zO1xyXG5cdH1cclxuXHJcblx0aXNWYWxpZChudW1iZXI6IHN0cmluZyA9IHRoaXMucGhvbmVOdW1iZXIpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiB1dGlscy5pc1ZhbGlkTnVtYmVyKG51bWJlciwgdGhpcy5jdXJyZW50Q291bnRyeS5jYzIpO1xyXG5cdH1cclxuXHJcblx0aXNQb3NzaWJsZShudW1iZXI6IHN0cmluZyA9IHRoaXMucGhvbmVOdW1iZXIpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdHV0aWxzLmdldFZhbGlkYXRpb25FcnJvcihudW1iZXIsIHRoaXMuY3VycmVudENvdW50cnkuY2MyKSA9PT1cclxuXHRcdFx0dXRpbHMudmFsaWRhdGlvbkVycm9yLklTX1BPU1NJQkxFXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0aXNGb3IodHlwZTogc3RyaW5nLCBudW1iZXI6IHN0cmluZyA9IHRoaXMucGhvbmVOdW1iZXIpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdHV0aWxzLmdldE51bWJlclR5cGUobnVtYmVyLCB0aGlzLmN1cnJlbnRDb3VudHJ5LmNjMikgPT09XHJcblx0XHRcdHV0aWxzLm51bWJlclR5cGVbdHlwZV1cclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRnZXRTYW1wbGUoaXNOYXRpb25hbE1vZGU6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XHJcblx0XHRsZXQgbnVtYmVyVHlwZSA9IHV0aWxzLm51bWJlclR5cGVbdGhpcy5vcHRpb25zLm51bWJlclR5cGVdO1xyXG5cclxuXHRcdHJldHVybiB1dGlscy5nZXRFeGFtcGxlTnVtYmVyKFxyXG5cdFx0XHR0aGlzLmN1cnJlbnRDb3VudHJ5LmNjMixcclxuXHRcdFx0Qm9vbGVhbihpc05hdGlvbmFsTW9kZSksXHJcblx0XHRcdG51bWJlclR5cGVcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRnZXRJbnB1dChmb3JtYXQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG5cdFx0cmV0dXJuIGZvcm1hdFxyXG5cdFx0XHQ/IHRoaXMuX2dldEZvcm1hdCh0aGlzLnBob25lTnVtYmVyKVxyXG5cdFx0XHQ6IHV0aWxzLmZvcm1hdE51bWJlcih0aGlzLnBob25lTnVtYmVyLCB0aGlzLmN1cnJlbnRDb3VudHJ5LmNjMik7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaXNQaG9uZU51bWJlclBvc3NpYmxlKG51bWJlcjogc3RyaW5nLCBwb3NzaWJsZTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcblx0XHRsZXQgaW5zdGFuY2UgPSBuZXcgT1dlYlRlbElucHV0KHsgbnVtYmVyOiBudW1iZXIgfSk7XHJcblxyXG5cdFx0aWYgKHBvc3NpYmxlID09PSB0cnVlKSB7XHJcblx0XHRcdHJldHVybiBpbnN0YW5jZS5pc1Bvc3NpYmxlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0aW5zdGFuY2UuaXNWYWxpZCgpIHx8XHJcblx0XHRcdChpbnN0YW5jZS5pc1Bvc3NpYmxlKCkgJiYgaW5zdGFuY2UuaXNGb3IoJ01PQklMRScpKVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRDb3VudHJ5V2l0aENjMihjYzI6IHN0cmluZykge1xyXG5cdFx0cmV0dXJuIGNjMlRvQ291bnRyeVtjYzIudG9Mb3dlckNhc2UoKV07XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0Q291bnRyeVdpdGhEaWFsQ29kZShkaWFsQ29kZTogc3RyaW5nKTogdENvdW50cnkgfCBudWxsIHtcclxuXHRcdGxldCBmb3VuZCA9IG51bGw7XHJcblxyXG5cdFx0aWYgKGRpYWxDb2RlKSB7XHJcblx0XHRcdGxldCBjYzJMaXN0ID0gZGlhbENvZGVUb0NjMltkaWFsQ29kZV07XHJcblxyXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGNjMkxpc3QubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRsZXQgZmlyc3QgPSBjYzJMaXN0W2pdOyAvL21heSBiZSBudWxsIHNvIHdlIGxldCBpdCBhbmQgZ28gdG8gdGhlIG5leHQgaWYgZXhpc3RzXHJcblx0XHRcdFx0aWYgKGZpcnN0KSB7XHJcblx0XHRcdFx0XHRmb3VuZCA9IE9XZWJUZWxJbnB1dC5nZXRDb3VudHJ5V2l0aENjMihmaXJzdCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZm91bmQ7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0Q291bnRyaWVzTGlzdCgpIHtcclxuXHRcdHJldHVybiBjYzJUb0NvdW50cnk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0RGlhbENvZGUoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdFx0bGV0IGRpYWxDb2RlID0gJycsXHJcblx0XHRcdHBob25lTnVtYmVyID0gU3RyaW5nKHN0ciksXHJcblx0XHRcdG51bWJlclJlZyA9IC9bMC05XS87XHJcblxyXG5cdFx0Ly8gb25seSBpbnRlcmVzdGVkIGluIGludGVybmF0aW9uYWwgbnVtYmVycyAoc3RhcnRpbmcgd2l0aCBhIHBsdXMpXHJcblx0XHRpZiAocGhvbmVOdW1iZXIuY2hhckF0KDApID09PSAnKycpIHtcclxuXHRcdFx0bGV0IG51bWVyaWNDaGFycyA9ICcnO1xyXG5cdFx0XHQvLyBpdGVyYXRlIG92ZXIgY2hhcnNcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwaG9uZU51bWJlci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGxldCBjID0gcGhvbmVOdW1iZXIuY2hhckF0KGkpO1xyXG5cdFx0XHRcdC8vIGlmIGNoYXIgaXMgbnVtYmVyXHJcblx0XHRcdFx0aWYgKG51bWJlclJlZy50ZXN0KGMpKSB7XHJcblx0XHRcdFx0XHRudW1lcmljQ2hhcnMgKz0gYztcclxuXHRcdFx0XHRcdC8vIGlmIGN1cnJlbnQgbnVtZXJpY0NoYXJzIG1ha2UgYSB2YWxpZCBkaWFsIGNvZGVcclxuXHRcdFx0XHRcdGlmIChkaWFsQ29kZVRvQ2MyW251bWVyaWNDaGFyc10pIHtcclxuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgdGhlIGFjdHVhbCByYXcgc3RyaW5nICh1c2VmdWwgZm9yIG1hdGNoaW5nIGxhdGVyKVxyXG5cdFx0XHRcdFx0XHRkaWFsQ29kZSA9IG51bWVyaWNDaGFycztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIGxvbmdlc3QgZGlhbCBjb2RlIGlzIDQgY2hhcnNcclxuXHRcdFx0XHRcdGlmIChudW1lcmljQ2hhcnMubGVuZ3RoID09PSA0KSB7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkaWFsQ29kZTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldEZvcm1hdChcclxuXHRcdG51bWJlcjogc3RyaW5nLFxyXG5cdFx0aXNOYXRpb25hbE1vZGU6IGJvb2xlYW4gPSBmYWxzZVxyXG5cdCk6IHN0cmluZyB7XHJcblx0XHRsZXQgcnVuID0gbnVtYmVyICYmIG51bWJlci50cmltKCkubGVuZ3RoID4gMTtcclxuXHRcdGlmIChydW4pIHtcclxuXHRcdFx0bGV0IGZvcm1hdCA9XHJcblx0XHRcdFx0aXNOYXRpb25hbE1vZGUgfHwgbnVtYmVyLmNoYXJBdCgwKSAhPT0gJysnXHJcblx0XHRcdFx0XHQ/IHV0aWxzLm51bWJlckZvcm1hdC5OQVRJT05BTFxyXG5cdFx0XHRcdFx0OiB1dGlscy5udW1iZXJGb3JtYXQuSU5URVJOQVRJT05BTDtcclxuXHRcdFx0bnVtYmVyID0gdXRpbHMuZm9ybWF0TnVtYmVyKFxyXG5cdFx0XHRcdG51bWJlcixcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRDb3VudHJ5LmNjMixcclxuXHRcdFx0XHRmb3JtYXRcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbnVtYmVyO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgT1dlYlRlbElucHV0O1xyXG4iXX0=