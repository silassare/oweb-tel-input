/**
 * OWebTelInput.js 2016-2019
 *
 * Emile Silas Sare (emile.silas@gmail.com)
 */
// thanks to https://github.com/jackocnr/intl-tel-input/
import './utils.js';
import countriesMap from './countriesMap';
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
        this.changeHandlers = [];
        this._updateOptions(options);
    }
    onChange(handler) {
        if (typeof handler === 'function') {
            this.changeHandlers.push(handler);
        }
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
        return this._inform();
    }
    setCountry(cc2) {
        let opt = Object.assign({}, this.options);
        opt.cc2 = cc2;
        opt.number = '+' + countriesMap.countries[cc2.toLowerCase()].dialCode;
        this._updateOptions(opt);
    }
    _updateOptions(options) {
        this.options = Object.assign({}, defaultOptions, options || this.options || {});
        this.currentCountry = OWebTelInput.getCountryWithCc2(this.options.cc2);
        if (!this.options.number) {
            // if no number initialize to default cc2 dialCode
            this.options.number =
                '+' +
                    countriesMap.countries[this.options.cc2.toLowerCase()].dialCode;
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
        return countriesMap.countries[cc2.toLowerCase()];
    }
    static getCountryWithDialCode(dialCode) {
        let found = null;
        if (dialCode) {
            let cc2List = countriesMap.dialCodeToCc2[dialCode];
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
                    if (countriesMap.dialCodeToCc2[numericChars]) {
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
    _inform() {
        for (let i = 0; i < this.changeHandlers.length; i++) {
            let cb = this.changeHandlers[i];
            cb(this.currentCountry);
        }
        return this;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT1dlYlRlbElucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL09XZWJUZWxJbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsd0RBQXdEO0FBQ3hELE9BQU8sWUFBWSxDQUFDO0FBQ3BCLE9BQU8sWUFBMEIsTUFBTSxnQkFBZ0IsQ0FBQztBQWF4RCxNQUFNLEtBQUssR0FBSSxNQUFjLENBQUMsaUJBQWlCLEVBQzlDLGNBQWMsR0FBYTtJQUMxQixHQUFHLEVBQUUsSUFBSTtJQUNULHNCQUFzQjtJQUN0QixNQUFNLEVBQUUsRUFBRTtJQUNWLFVBQVUsRUFBRSxRQUFRO0lBQ3BCLGtCQUFrQixFQUFFLENBQUMsSUFBSSxDQUFDO0lBQzFCLHFCQUFxQixFQUFFLElBQUk7SUFDM0IsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtDQUMxQixFQUNELGdCQUFnQixHQUFHLFVBQVMsR0FBVztJQUN0QyxPQUFPLENBQ04sR0FBRztRQUNILEdBQUc7YUFDRCxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQzthQUN2QixPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQzthQUNwQixPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQzthQUN2QixPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUMxQixDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBRUg7SUFNQyxZQUFZLE9BQVk7UUFMaEIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFDekIsWUFBTyxHQUFhLEVBQWMsQ0FBQztRQUNuQyxtQkFBYyxHQUFhLEVBQWMsQ0FBQztRQUMxQyxtQkFBYyxHQUFxQixFQUFFLENBQUM7UUFHN0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsUUFBUSxDQUFDLE9BQXVCO1FBQy9CLElBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxFQUFFO1lBQ2xDLElBQUksQ0FB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MTlcclxuICpcclxuICogRW1pbGUgU2lsYXMgU2FyZSAoZW1pbGUuc2lsYXNAZ21haWwuY29tKVxyXG4gKi9cclxuXHJcbi8vIHRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vamFja29jbnIvaW50bC10ZWwtaW5wdXQvXHJcbmltcG9ydCAnLi91dGlscy5qcyc7XHJcbmltcG9ydCBjb3VudHJpZXNNYXAsIHsgdENvdW50cnkgfSBmcm9tICcuL2NvdW50cmllc01hcCc7XHJcblxyXG50eXBlIHRDaGFuZ2VIYW5kbGVyID0gKGM6IHRDb3VudHJ5KSA9PiB2b2lkO1xyXG50eXBlIHRPcHRpb25zID0ge1xyXG5cdGNjMjogc3RyaW5nO1xyXG5cdC8vbmF0aW9uYWxNb2RlOiB0cnVlLFxyXG5cdG51bWJlcjogc3RyaW5nO1xyXG5cdG51bWJlclR5cGU6ICdNT0JJTEUnO1xyXG5cdHByZWZlcnJlZENvdW50cmllczogc3RyaW5nW107XHJcblx0c2hvd1NhbXBsZVBsYWNlaG9sZGVyOiBib29sZWFuO1xyXG5cdGFsbG93ZWRDb3VudHJpZXM6ICgpID0+IHN0cmluZ1tdO1xyXG59O1xyXG5cclxuY29uc3QgdXRpbHMgPSAod2luZG93IGFzIGFueSkuaW50bFRlbElucHV0VXRpbHMsXHJcblx0ZGVmYXVsdE9wdGlvbnM6IHRPcHRpb25zID0ge1xyXG5cdFx0Y2MyOiAnYmonLFxyXG5cdFx0Ly9uYXRpb25hbE1vZGU6IGZhbHNlLFxyXG5cdFx0bnVtYmVyOiAnJyxcclxuXHRcdG51bWJlclR5cGU6ICdNT0JJTEUnLFxyXG5cdFx0cHJlZmVycmVkQ291bnRyaWVzOiBbJ2JqJ10sXHJcblx0XHRzaG93U2FtcGxlUGxhY2Vob2xkZXI6IHRydWUsXHJcblx0XHRhbGxvd2VkQ291bnRyaWVzOiAoKSA9PiBbXSxcclxuXHR9LFxyXG5cdGNsZWFuUGhvbmVTdHJpbmcgPSBmdW5jdGlvbihzdHI6IHN0cmluZykge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0JysnICtcclxuXHRcdFx0c3RyXHJcblx0XHRcdFx0LnJlcGxhY2UoL1teXFxkIC1dL2csICcnKVxyXG5cdFx0XHRcdC5yZXBsYWNlKC9cXHMrL2csICcgJylcclxuXHRcdFx0XHQucmVwbGFjZSgvLVteXFxkXS9nLCAnLScpXHJcblx0XHRcdFx0LnJlcGxhY2UoL15bXjEtOV0rL2csICcnKVxyXG5cdFx0KTtcclxuXHR9O1xyXG5cclxuY2xhc3MgT1dlYlRlbElucHV0IHtcclxuXHRwcml2YXRlIHBob25lTnVtYmVyOiBzdHJpbmcgPSAnJztcclxuXHRwcml2YXRlIG9wdGlvbnM6IHRPcHRpb25zID0ge30gYXMgdE9wdGlvbnM7XHJcblx0cHJpdmF0ZSBjdXJyZW50Q291bnRyeTogdENvdW50cnkgPSB7fSBhcyB0Q291bnRyeTtcclxuXHRwcml2YXRlIGNoYW5nZUhhbmRsZXJzOiB0Q2hhbmdlSGFuZGxlcltdID0gW107XHJcblxyXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IGFueSkge1xyXG5cdFx0dGhpcy5fdXBkYXRlT3B0aW9ucyhvcHRpb25zKTtcclxuXHR9XHJcblxyXG5cdG9uQ2hhbmdlKGhhbmRsZXI6IHRDaGFuZ2VIYW5kbGVyKSB7XHJcblx0XHRpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0dGhpcy5jaGFuZ2VIYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2V0UGhvbmVOdW1iZXIobnVtYmVyOiBzdHJpbmcpIHtcclxuXHRcdG51bWJlciA9IGNsZWFuUGhvbmVTdHJpbmcobnVtYmVyKTtcclxuXHJcblx0XHRsZXQgZGlhbENvZGUgPSBPV2ViVGVsSW5wdXQuZ2V0RGlhbENvZGUobnVtYmVyKSxcclxuXHRcdFx0Zm9ybWF0dGVkO1xyXG5cclxuXHRcdGlmIChkaWFsQ29kZSkge1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRDb3VudHJ5ID1cclxuXHRcdFx0XHRPV2ViVGVsSW5wdXQuZ2V0Q291bnRyeVdpdGhEaWFsQ29kZShkaWFsQ29kZSkgfHxcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRDb3VudHJ5O1xyXG5cdFx0XHRmb3JtYXR0ZWQgPSB0aGlzLl9nZXRGb3JtYXQobnVtYmVyKTtcclxuXHJcblx0XHRcdHRoaXMucGhvbmVOdW1iZXIgPSBmb3JtYXR0ZWQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnBob25lTnVtYmVyID0gbnVtYmVyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzLl9pbmZvcm0oKTtcclxuXHR9XHJcblxyXG5cdHNldENvdW50cnkoY2MyOiBzdHJpbmcpIHtcclxuXHRcdGxldCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpO1xyXG5cdFx0b3B0LmNjMiA9IGNjMjtcclxuXHRcdG9wdC5udW1iZXIgPSAnKycgKyBjb3VudHJpZXNNYXAuY291bnRyaWVzW2NjMi50b0xvd2VyQ2FzZSgpXS5kaWFsQ29kZTtcclxuXHJcblx0XHR0aGlzLl91cGRhdGVPcHRpb25zKG9wdCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91cGRhdGVPcHRpb25zKG9wdGlvbnM6IHRPcHRpb25zKTogdGhpcyB7XHJcblx0XHR0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxyXG5cdFx0XHR7fSxcclxuXHRcdFx0ZGVmYXVsdE9wdGlvbnMsXHJcblx0XHRcdG9wdGlvbnMgfHwgdGhpcy5vcHRpb25zIHx8IHt9XHJcblx0XHQpO1xyXG5cdFx0dGhpcy5jdXJyZW50Q291bnRyeSA9IE9XZWJUZWxJbnB1dC5nZXRDb3VudHJ5V2l0aENjMih0aGlzLm9wdGlvbnMuY2MyKTtcclxuXHJcblx0XHRpZiAoIXRoaXMub3B0aW9ucy5udW1iZXIpIHtcclxuXHRcdFx0Ly8gaWYgbm8gbnVtYmVyIGluaXRpYWxpemUgdG8gZGVmYXVsdCBjYzIgZGlhbENvZGVcclxuXHRcdFx0dGhpcy5vcHRpb25zLm51bWJlciA9XHJcblx0XHRcdFx0JysnICtcclxuXHRcdFx0XHRjb3VudHJpZXNNYXAuY291bnRyaWVzW3RoaXMub3B0aW9ucy5jYzIudG9Mb3dlckNhc2UoKV0uZGlhbENvZGU7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5zZXRQaG9uZU51bWJlcih0aGlzLm9wdGlvbnMubnVtYmVyKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdGdldEN1cnJlbnRDb3VudHJ5KCk6IHRDb3VudHJ5IHtcclxuXHRcdHJldHVybiB0aGlzLmN1cnJlbnRDb3VudHJ5O1xyXG5cdH1cclxuXHJcblx0Z2V0T3B0aW9ucygpOiB0T3B0aW9ucyB7XHJcblx0XHRyZXR1cm4gdGhpcy5vcHRpb25zO1xyXG5cdH1cclxuXHJcblx0aXNWYWxpZChudW1iZXI6IHN0cmluZyA9IHRoaXMucGhvbmVOdW1iZXIpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiB1dGlscy5pc1ZhbGlkTnVtYmVyKG51bWJlciwgdGhpcy5jdXJyZW50Q291bnRyeS5jYzIpO1xyXG5cdH1cclxuXHJcblx0aXNQb3NzaWJsZShudW1iZXI6IHN0cmluZyA9IHRoaXMucGhvbmVOdW1iZXIpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdHV0aWxzLmdldFZhbGlkYXRpb25FcnJvcihudW1iZXIsIHRoaXMuY3VycmVudENvdW50cnkuY2MyKSA9PT1cclxuXHRcdFx0dXRpbHMudmFsaWRhdGlvbkVycm9yLklTX1BPU1NJQkxFXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0aXNGb3IodHlwZTogc3RyaW5nLCBudW1iZXI6IHN0cmluZyA9IHRoaXMucGhvbmVOdW1iZXIpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdHV0aWxzLmdldE51bWJlclR5cGUobnVtYmVyLCB0aGlzLmN1cnJlbnRDb3VudHJ5LmNjMikgPT09XHJcblx0XHRcdHV0aWxzLm51bWJlclR5cGVbdHlwZV1cclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRnZXRTYW1wbGUoaXNOYXRpb25hbE1vZGU6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XHJcblx0XHRsZXQgbnVtYmVyVHlwZSA9IHV0aWxzLm51bWJlclR5cGVbdGhpcy5vcHRpb25zLm51bWJlclR5cGVdO1xyXG5cclxuXHRcdHJldHVybiB1dGlscy5nZXRFeGFtcGxlTnVtYmVyKFxyXG5cdFx0XHR0aGlzLmN1cnJlbnRDb3VudHJ5LmNjMixcclxuXHRcdFx0Qm9vbGVhbihpc05hdGlvbmFsTW9kZSksXHJcblx0XHRcdG51bWJlclR5cGVcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRnZXRJbnB1dChmb3JtYXQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG5cdFx0cmV0dXJuIGZvcm1hdFxyXG5cdFx0XHQ/IHRoaXMuX2dldEZvcm1hdCh0aGlzLnBob25lTnVtYmVyKVxyXG5cdFx0XHQ6IHV0aWxzLmZvcm1hdE51bWJlcih0aGlzLnBob25lTnVtYmVyLCB0aGlzLmN1cnJlbnRDb3VudHJ5LmNjMik7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgaXNQaG9uZU51bWJlclBvc3NpYmxlKG51bWJlcjogc3RyaW5nLCBwb3NzaWJsZTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcblx0XHRsZXQgaW5zdGFuY2UgPSBuZXcgT1dlYlRlbElucHV0KHsgbnVtYmVyOiBudW1iZXIgfSk7XHJcblxyXG5cdFx0aWYgKHBvc3NpYmxlID09PSB0cnVlKSB7XHJcblx0XHRcdHJldHVybiBpbnN0YW5jZS5pc1Bvc3NpYmxlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0aW5zdGFuY2UuaXNWYWxpZCgpIHx8XHJcblx0XHRcdChpbnN0YW5jZS5pc1Bvc3NpYmxlKCkgJiYgaW5zdGFuY2UuaXNGb3IoJ01PQklMRScpKVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRDb3VudHJ5V2l0aENjMihjYzI6IHN0cmluZykge1xyXG5cdFx0cmV0dXJuIGNvdW50cmllc01hcC5jb3VudHJpZXNbY2MyLnRvTG93ZXJDYXNlKCldO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldENvdW50cnlXaXRoRGlhbENvZGUoZGlhbENvZGU6IHN0cmluZyk6IHRDb3VudHJ5IHwgbnVsbCB7XHJcblx0XHRsZXQgZm91bmQgPSBudWxsO1xyXG5cclxuXHRcdGlmIChkaWFsQ29kZSkge1xyXG5cdFx0XHRsZXQgY2MyTGlzdCA9IGNvdW50cmllc01hcC5kaWFsQ29kZVRvQ2MyW2RpYWxDb2RlXTtcclxuXHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgY2MyTGlzdC5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGxldCBmaXJzdCA9IGNjMkxpc3Rbal07IC8vbWF5IGJlIG51bGwgc28gd2UgbGV0IGl0IGFuZCBnbyB0byB0aGUgbmV4dCBpZiBleGlzdHNcclxuXHRcdFx0XHRpZiAoZmlyc3QpIHtcclxuXHRcdFx0XHRcdGZvdW5kID0gT1dlYlRlbElucHV0LmdldENvdW50cnlXaXRoQ2MyKGZpcnN0KTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmb3VuZDtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXREaWFsQ29kZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0XHRsZXQgZGlhbENvZGUgPSAnJyxcclxuXHRcdFx0cGhvbmVOdW1iZXIgPSBTdHJpbmcoc3RyKSxcclxuXHRcdFx0bnVtYmVyUmVnID0gL1swLTldLztcclxuXHJcblx0XHQvLyBvbmx5IGludGVyZXN0ZWQgaW4gaW50ZXJuYXRpb25hbCBudW1iZXJzIChzdGFydGluZyB3aXRoIGEgcGx1cylcclxuXHRcdGlmIChwaG9uZU51bWJlci5jaGFyQXQoMCkgPT09ICcrJykge1xyXG5cdFx0XHRsZXQgbnVtZXJpY0NoYXJzID0gJyc7XHJcblx0XHRcdC8vIGl0ZXJhdGUgb3ZlciBjaGFyc1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBob25lTnVtYmVyLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0bGV0IGMgPSBwaG9uZU51bWJlci5jaGFyQXQoaSk7XHJcblx0XHRcdFx0Ly8gaWYgY2hhciBpcyBudW1iZXJcclxuXHRcdFx0XHRpZiAobnVtYmVyUmVnLnRlc3QoYykpIHtcclxuXHRcdFx0XHRcdG51bWVyaWNDaGFycyArPSBjO1xyXG5cdFx0XHRcdFx0Ly8gaWYgY3VycmVudCBudW1lcmljQ2hhcnMgbWFrZSBhIHZhbGlkIGRpYWwgY29kZVxyXG5cdFx0XHRcdFx0aWYgKGNvdW50cmllc01hcC5kaWFsQ29kZVRvQ2MyW251bWVyaWNDaGFyc10pIHtcclxuXHRcdFx0XHRcdFx0Ly8gc3RvcmUgdGhlIGFjdHVhbCByYXcgc3RyaW5nICh1c2VmdWwgZm9yIG1hdGNoaW5nIGxhdGVyKVxyXG5cdFx0XHRcdFx0XHRkaWFsQ29kZSA9IG51bWVyaWNDaGFycztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIGxvbmdlc3QgZGlhbCBjb2RlIGlzIDQgY2hhcnNcclxuXHRcdFx0XHRcdGlmIChudW1lcmljQ2hhcnMubGVuZ3RoID09PSA0KSB7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBkaWFsQ29kZTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2luZm9ybSgpOiB0aGlzIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGFuZ2VIYW5kbGVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgY2IgPSB0aGlzLmNoYW5nZUhhbmRsZXJzW2ldO1xyXG5cdFx0XHRjYih0aGlzLmN1cnJlbnRDb3VudHJ5KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldEZvcm1hdChcclxuXHRcdG51bWJlcjogc3RyaW5nLFxyXG5cdFx0aXNOYXRpb25hbE1vZGU6IGJvb2xlYW4gPSBmYWxzZVxyXG5cdCk6IHN0cmluZyB7XHJcblx0XHRsZXQgcnVuID0gbnVtYmVyICYmIG51bWJlci50cmltKCkubGVuZ3RoID4gMTtcclxuXHRcdGlmIChydW4pIHtcclxuXHRcdFx0bGV0IGZvcm1hdCA9XHJcblx0XHRcdFx0aXNOYXRpb25hbE1vZGUgfHwgbnVtYmVyLmNoYXJBdCgwKSAhPT0gJysnXHJcblx0XHRcdFx0XHQ/IHV0aWxzLm51bWJlckZvcm1hdC5OQVRJT05BTFxyXG5cdFx0XHRcdFx0OiB1dGlscy5udW1iZXJGb3JtYXQuSU5URVJOQVRJT05BTDtcclxuXHRcdFx0bnVtYmVyID0gdXRpbHMuZm9ybWF0TnVtYmVyKFxyXG5cdFx0XHRcdG51bWJlcixcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRDb3VudHJ5LmNjMixcclxuXHRcdFx0XHRmb3JtYXRcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbnVtYmVyO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgT1dlYlRlbElucHV0O1xyXG4iXX0=