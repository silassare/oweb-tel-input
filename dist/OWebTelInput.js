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
    static getCountryByCc2(cc2) {
        return cc2ToCountry[cc2];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT1dlYlRlbElucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL09XZWJUZWxJbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsd0RBQXdEO0FBQ3hELE9BQU8sWUFBWSxDQUFDO0FBQ3BCLE9BQU8sRUFFTixZQUFZLEVBQ1osYUFBYSxHQUViLE1BQU0sZ0JBQWdCLENBQUM7QUFZeEIsTUFBTSxLQUFLLEdBQUksTUFBYyxDQUFDLGlCQUFpQixFQUM5QyxjQUFjLEdBQWE7SUFDMUIsR0FBRyxFQUFFLElBQUk7SUFDVCxzQkFBc0I7SUFDdEIsTUFBTSxFQUFFLEVBQUU7SUFDVixVQUFVLEVBQUUsUUFBUTtJQUNwQixrQkFBa0IsRUFBRSxDQUFDLElBQUksQ0FBQztJQUMxQixxQkFBcUIsRUFBRSxJQUFJO0lBQzNCLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7Q0FDMUIsRUFDRCxnQkFBZ0IsR0FBRyxVQUFTLEdBQVc7SUFDdEMsT0FBTyxDQUNOLEdBQUc7UUFDSCxHQUFHO2FBQ0QsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7YUFDdkIsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7YUFDcEIsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUM7YUFDdkIsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FDMUIsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVIO0lBS0MsWUFBWSxPQUFZO1FBSmhCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLFlBQU8sR0FBYSxFQUFjLENBQUM7UUFDbkMsbUJBQWMsR0FBYSxFQUFjLENBQUM7UUFHakQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsY0FBYyxDQUFDLE1BQWM7UUFDNUIsTUFBTSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxDLElBQUksUUFBUSxH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SUFBSSxDQUFDLENBQUM7b0JBQ2xCLGlEQUFpRDtvQkFDakQsSUFBSSxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQUU7d0JBQ2hDLDBEQUEwRDt3QkFDMUQsUUFBUSxHQUFHLFlBQVksQ0FBQztxQkFDeEI7b0JBQ0QsK0JBQStCO29CQUMvQixJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUM5QixNQUFNO3FCQUNOO2lCQUNEO2FBQ0Q7U0FDRDtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2pCLENBQUM7SUFFTyxVQUFVLENBQ2pCLE1BQWMsRUFDZCxpQkFBMEIsS0FBSztRQUUvQixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDN0MsSUFBSSxHQUFHLEVBQUU7WUFDUixJQUFJLE1BQU0sR0FDVCxjQUFjLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHO2dCQUN6QyxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRO2dCQUM3QixDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUM7WUFDckMsTUFBTSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQzFCLE1BQU0sRUFDTixJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFDdkIsTUFBTSxDQUNOLENBQUM7U0FDRjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQztDQUNEO0FBRUQsZUFBZSxZQUFZLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogT1dlYlRlbElucHV0LmpzIDIwMTYtMjAxOVxyXG4gKlxyXG4gKiBFbWlsZSBTaWxhcyBTYXJlIChlbWlsZS5zaWxhc0BnbWFpbC5jb20pXHJcbiAqL1xyXG5cclxuLy8gdGhhbmtzIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9qYWNrb2Nuci9pbnRsLXRlbC1pbnB1dC9cclxuaW1wb3J0ICcuL3V0aWxzLmpzJztcclxuaW1wb3J0IHtcclxuXHR0Q291bnRyeSxcclxuXHRjYzJUb0NvdW50cnksXHJcblx0ZGlhbENvZGVUb0NjMixcclxuXHRjb3VudHJpZXMsXHJcbn0gZnJvbSAnLi9jb3VudHJpZXMuanMnO1xyXG5cclxudHlwZSB0T3B0aW9ucyA9IHtcclxuXHRjYzI6IHN0cmluZztcclxuXHQvL25hdGlvbmFsTW9kZTogdHJ1ZSxcclxuXHRudW1iZXI6IHN0cmluZztcclxuXHRudW1iZXJUeXBlOiAnTU9CSUxFJztcclxuXHRwcmVmZXJyZWRDb3VudHJpZXM6IHN0cmluZ1tdO1xyXG5cdHNob3dTYW1wbGVQbGFjZWhvbGRlcjogYm9vbGVhbjtcclxuXHRhbGxvd2VkQ291bnRyaWVzOiAoKSA9PiBzdHJpbmdbXTtcclxufTtcclxuXHJcbmNvbnN0IHV0aWxzID0gKHdpbmRvdyBhcyBhbnkpLmludGxUZWxJbnB1dFV0aWxzLFxyXG5cdGRlZmF1bHRPcHRpb25zOiB0T3B0aW9ucyA9IHtcclxuXHRcdGNjMjogJ2JqJyxcclxuXHRcdC8vbmF0aW9uYWxNb2RlOiBmYWxzZSxcclxuXHRcdG51bWJlcjogJycsXHJcblx0XHRudW1iZXJUeXBlOiAnTU9CSUxFJyxcclxuXHRcdHByZWZlcnJlZENvdW50cmllczogWydiaiddLFxyXG5cdFx0c2hvd1NhbXBsZVBsYWNlaG9sZGVyOiB0cnVlLFxyXG5cdFx0YWxsb3dlZENvdW50cmllczogKCkgPT4gW10sXHJcblx0fSxcclxuXHRjbGVhblBob25lU3RyaW5nID0gZnVuY3Rpb24oc3RyOiBzdHJpbmcpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdCcrJyArXHJcblx0XHRcdHN0clxyXG5cdFx0XHRcdC5yZXBsYWNlKC9bXlxcZCAtXS9nLCAnJylcclxuXHRcdFx0XHQucmVwbGFjZSgvXFxzKy9nLCAnICcpXHJcblx0XHRcdFx0LnJlcGxhY2UoLy1bXlxcZF0vZywgJy0nKVxyXG5cdFx0XHRcdC5yZXBsYWNlKC9eW14xLTldKy9nLCAnJylcclxuXHRcdCk7XHJcblx0fTtcclxuXHJcbmNsYXNzIE9XZWJUZWxJbnB1dCB7XHJcblx0cHJpdmF0ZSBwaG9uZU51bWJlcjogc3RyaW5nID0gJyc7XHJcblx0cHJpdmF0ZSBvcHRpb25zOiB0T3B0aW9ucyA9IHt9IGFzIHRPcHRpb25zO1xyXG5cdHByaXZhdGUgY3VycmVudENvdW50cnk6IHRDb3VudHJ5ID0ge30gYXMgdENvdW50cnk7XHJcblxyXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IGFueSkge1xyXG5cdFx0dGhpcy5fdXBkYXRlT3B0aW9ucyhvcHRpb25zKTtcclxuXHR9XHJcblxyXG5cdHNldFBob25lTnVtYmVyKG51bWJlcjogc3RyaW5nKSB7XHJcblx0XHRudW1iZXIgPSBjbGVhblBob25lU3RyaW5nKG51bWJlcik7XHJcblxyXG5cdFx0bGV0IGRpYWxDb2RlID0gT1dlYlRlbElucHV0LmdldERpYWxDb2RlKG51bWJlciksXHJcblx0XHRcdGZvcm1hdHRlZDtcclxuXHJcblx0XHRpZiAoZGlhbENvZGUpIHtcclxuXHRcdFx0dGhpcy5jdXJyZW50Q291bnRyeSA9XHJcblx0XHRcdFx0T1dlYlRlbElucHV0LmdldENvdW50cnlXaXRoRGlhbENvZGUoZGlhbENvZGUpIHx8XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50Q291bnRyeTtcclxuXHRcdFx0Zm9ybWF0dGVkID0gdGhpcy5fZ2V0Rm9ybWF0KG51bWJlcik7XHJcblxyXG5cdFx0XHR0aGlzLnBob25lTnVtYmVyID0gZm9ybWF0dGVkO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5waG9uZU51bWJlciA9IG51bWJlcjtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHNldENvdW50cnkoY2MyOiBzdHJpbmcpIHtcclxuXHRcdGxldCBjYzJMb3dlciA9IGNjMi50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0aWYgKGNjMlRvQ291bnRyeVtjYzJMb3dlcl0pIHtcclxuXHRcdFx0bGV0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XHJcblx0XHRcdG9wdC5jYzIgPSBjYzJMb3dlcjtcclxuXHRcdFx0b3B0Lm51bWJlciA9ICcrJyArIGNjMlRvQ291bnRyeVtjYzJMb3dlcl0uZGlhbENvZGU7XHJcblxyXG5cdFx0XHR0aGlzLl91cGRhdGVPcHRpb25zKG9wdCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gY291bnRyeSBjb2RlOiAnICsgY2MyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3VwZGF0ZU9wdGlvbnMob3B0aW9uczogdE9wdGlvbnMpOiB0aGlzIHtcclxuXHRcdHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXHJcblx0XHRcdHt9LFxyXG5cdFx0XHRkZWZhdWx0T3B0aW9ucyxcclxuXHRcdFx0b3B0aW9ucyB8fCB0aGlzLm9wdGlvbnMgfHwge31cclxuXHRcdCk7XHJcblx0XHR0aGlzLmN1cnJlbnRDb3VudHJ5ID0gT1dlYlRlbElucHV0LmdldENvdW50cnlXaXRoQ2MyKHRoaXMub3B0aW9ucy5jYzIpO1xyXG5cclxuXHRcdGlmICghdGhpcy5vcHRpb25zLm51bWJlcikge1xyXG5cdFx0XHQvLyBpZiBubyBudW1iZXIgaW5pdGlhbGl6ZSB0byBkZWZhdWx0IGNjMiBkaWFsQ29kZVxyXG5cdFx0XHR0aGlzLm9wdGlvbnMubnVtYmVyID1cclxuXHRcdFx0XHQnKycgKyBjYzJUb0NvdW50cnlbdGhpcy5vcHRpb25zLmNjMi50b0xvd2VyQ2FzZSgpXS5kaWFsQ29kZTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNldFBob25lTnVtYmVyKHRoaXMub3B0aW9ucy5udW1iZXIpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Z2V0Q3VycmVudENvdW50cnkoKTogdENvdW50cnkge1xyXG5cdFx0cmV0dXJuIHRoaXMuY3VycmVudENvdW50cnk7XHJcblx0fVxyXG5cclxuXHRnZXRPcHRpb25zKCk6IHRPcHRpb25zIHtcclxuXHRcdHJldHVybiB0aGlzLm9wdGlvbnM7XHJcblx0fVxyXG5cclxuXHRpc1ZhbGlkKG51bWJlcjogc3RyaW5nID0gdGhpcy5waG9uZU51bWJlcik6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHV0aWxzLmlzVmFsaWROdW1iZXIobnVtYmVyLCB0aGlzLmN1cnJlbnRDb3VudHJ5LmNjMik7XHJcblx0fVxyXG5cclxuXHRpc1Bvc3NpYmxlKG51bWJlcjogc3RyaW5nID0gdGhpcy5waG9uZU51bWJlcik6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0dXRpbHMuZ2V0VmFsaWRhdGlvbkVycm9yKG51bWJlciwgdGhpcy5jdXJyZW50Q291bnRyeS5jYzIpID09PVxyXG5cdFx0XHR1dGlscy52YWxpZGF0aW9uRXJyb3IuSVNfUE9TU0lCTEVcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRpc0Zvcih0eXBlOiBzdHJpbmcsIG51bWJlcjogc3RyaW5nID0gdGhpcy5waG9uZU51bWJlcik6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0dXRpbHMuZ2V0TnVtYmVyVHlwZShudW1iZXIsIHRoaXMuY3VycmVudENvdW50cnkuY2MyKSA9PT1cclxuXHRcdFx0dXRpbHMubnVtYmVyVHlwZVt0eXBlXVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdGdldFNhbXBsZShpc05hdGlvbmFsTW9kZTogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcclxuXHRcdGxldCBudW1iZXJUeXBlID0gdXRpbHMubnVtYmVyVHlwZVt0aGlzLm9wdGlvbnMubnVtYmVyVHlwZV07XHJcblxyXG5cdFx0cmV0dXJuIHV0aWxzLmdldEV4YW1wbGVOdW1iZXIoXHJcblx0XHRcdHRoaXMuY3VycmVudENvdW50cnkuY2MyLFxyXG5cdFx0XHRCb29sZWFuKGlzTmF0aW9uYWxNb2RlKSxcclxuXHRcdFx0bnVtYmVyVHlwZVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdGdldElucHV0KGZvcm1hdDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcblx0XHRyZXR1cm4gZm9ybWF0XHJcblx0XHRcdD8gdGhpcy5fZ2V0Rm9ybWF0KHRoaXMucGhvbmVOdW1iZXIpXHJcblx0XHRcdDogdXRpbHMuZm9ybWF0TnVtYmVyKHRoaXMucGhvbmVOdW1iZXIsIHRoaXMuY3VycmVudENvdW50cnkuY2MyKTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBpc1Bob25lTnVtYmVyUG9zc2libGUobnVtYmVyOiBzdHJpbmcsIHBvc3NpYmxlOiBib29sZWFuID0gZmFsc2UpIHtcclxuXHRcdGxldCBpbnN0YW5jZSA9IG5ldyBPV2ViVGVsSW5wdXQoeyBudW1iZXI6IG51bWJlciB9KTtcclxuXHJcblx0XHRpZiAocG9zc2libGUgPT09IHRydWUpIHtcclxuXHRcdFx0cmV0dXJuIGluc3RhbmNlLmlzUG9zc2libGUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHRpbnN0YW5jZS5pc1ZhbGlkKCkgfHxcclxuXHRcdFx0KGluc3RhbmNlLmlzUG9zc2libGUoKSAmJiBpbnN0YW5jZS5pc0ZvcignTU9CSUxFJykpXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldENvdW50cnlXaXRoQ2MyKGNjMjogc3RyaW5nKSB7XHJcblx0XHRyZXR1cm4gY2MyVG9Db3VudHJ5W2NjMi50b0xvd2VyQ2FzZSgpXTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRDb3VudHJ5V2l0aERpYWxDb2RlKGRpYWxDb2RlOiBzdHJpbmcpOiB0Q291bnRyeSB8IG51bGwge1xyXG5cdFx0bGV0IGZvdW5kID0gbnVsbDtcclxuXHJcblx0XHRpZiAoZGlhbENvZGUpIHtcclxuXHRcdFx0bGV0IGNjMkxpc3QgPSBkaWFsQ29kZVRvQ2MyW2RpYWxDb2RlXTtcclxuXHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgY2MyTGlzdC5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGxldCBmaXJzdCA9IGNjMkxpc3Rbal07IC8vbWF5IGJlIG51bGwgc28gd2UgbGV0IGl0IGFuZCBnbyB0byB0aGUgbmV4dCBpZiBleGlzdHNcclxuXHRcdFx0XHRpZiAoZmlyc3QpIHtcclxuXHRcdFx0XHRcdGZvdW5kID0gT1dlYlRlbElucHV0LmdldENvdW50cnlXaXRoQ2MyKGZpcnN0KTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmb3VuZDtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRDb3VudHJpZXNMaXN0KCkge1xyXG5cdFx0cmV0dXJuIGNjMlRvQ291bnRyeTtcclxuXHR9XHJcblx0c3RhdGljIGdldENvdW50cnlCeUNjMihjYzI6IHN0cmluZykge1xyXG5cdFx0cmV0dXJuIGNjMlRvQ291bnRyeVtjYzJdO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldERpYWxDb2RlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuXHRcdGxldCBkaWFsQ29kZSA9ICcnLFxyXG5cdFx0XHRwaG9uZU51bWJlciA9IFN0cmluZyhzdHIpLFxyXG5cdFx0XHRudW1iZXJSZWcgPSAvWzAtOV0vO1xyXG5cclxuXHRcdC8vIG9ubHkgaW50ZXJlc3RlZCBpbiBpbnRlcm5hdGlvbmFsIG51bWJlcnMgKHN0YXJ0aW5nIHdpdGggYSBwbHVzKVxyXG5cdFx0aWYgKHBob25lTnVtYmVyLmNoYXJBdCgwKSA9PT0gJysnKSB7XHJcblx0XHRcdGxldCBudW1lcmljQ2hhcnMgPSAnJztcclxuXHRcdFx0Ly8gaXRlcmF0ZSBvdmVyIGNoYXJzXHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGhvbmVOdW1iZXIubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRsZXQgYyA9IHBob25lTnVtYmVyLmNoYXJBdChpKTtcclxuXHRcdFx0XHQvLyBpZiBjaGFyIGlzIG51bWJlclxyXG5cdFx0XHRcdGlmIChudW1iZXJSZWcudGVzdChjKSkge1xyXG5cdFx0XHRcdFx0bnVtZXJpY0NoYXJzICs9IGM7XHJcblx0XHRcdFx0XHQvLyBpZiBjdXJyZW50IG51bWVyaWNDaGFycyBtYWtlIGEgdmFsaWQgZGlhbCBjb2RlXHJcblx0XHRcdFx0XHRpZiAoZGlhbENvZGVUb0NjMltudW1lcmljQ2hhcnNdKSB7XHJcblx0XHRcdFx0XHRcdC8vIHN0b3JlIHRoZSBhY3R1YWwgcmF3IHN0cmluZyAodXNlZnVsIGZvciBtYXRjaGluZyBsYXRlcilcclxuXHRcdFx0XHRcdFx0ZGlhbENvZGUgPSBudW1lcmljQ2hhcnM7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBsb25nZXN0IGRpYWwgY29kZSBpcyA0IGNoYXJzXHJcblx0XHRcdFx0XHRpZiAobnVtZXJpY0NoYXJzLmxlbmd0aCA9PT0gNCkge1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGlhbENvZGU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9nZXRGb3JtYXQoXHJcblx0XHRudW1iZXI6IHN0cmluZyxcclxuXHRcdGlzTmF0aW9uYWxNb2RlOiBib29sZWFuID0gZmFsc2VcclxuXHQpOiBzdHJpbmcge1xyXG5cdFx0bGV0IHJ1biA9IG51bWJlciAmJiBudW1iZXIudHJpbSgpLmxlbmd0aCA+IDE7XHJcblx0XHRpZiAocnVuKSB7XHJcblx0XHRcdGxldCBmb3JtYXQgPVxyXG5cdFx0XHRcdGlzTmF0aW9uYWxNb2RlIHx8IG51bWJlci5jaGFyQXQoMCkgIT09ICcrJ1xyXG5cdFx0XHRcdFx0PyB1dGlscy5udW1iZXJGb3JtYXQuTkFUSU9OQUxcclxuXHRcdFx0XHRcdDogdXRpbHMubnVtYmVyRm9ybWF0LklOVEVSTkFUSU9OQUw7XHJcblx0XHRcdG51bWJlciA9IHV0aWxzLmZvcm1hdE51bWJlcihcclxuXHRcdFx0XHRudW1iZXIsXHJcblx0XHRcdFx0dGhpcy5jdXJyZW50Q291bnRyeS5jYzIsXHJcblx0XHRcdFx0Zm9ybWF0XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG51bWJlcjtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9XZWJUZWxJbnB1dDtcclxuIl19