/**
 * OWebTelInput.js 2016-2019
 *
 * Emile Silas Sare (emile.silas@gmail.com)
 */
// thanks to https://github.com/jackocnr/intl-tel-input/
import './utils.js';
import { cc2ToCountry, dialCodeToCc2 } from './countries.js';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT1dlYlRlbElucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL09XZWJUZWxJbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsd0RBQXdEO0FBQ3hELE9BQU8sWUFBWSxDQUFDO0FBQ3BCLE9BQU8sRUFBWSxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFZdkUsTUFBTSxLQUFLLEdBQUksTUFBYyxDQUFDLGlCQUFpQixFQUM5QyxjQUFjLEdBQWE7SUFDMUIsR0FBRyxFQUFFLElBQUk7SUFDVCxzQkFBc0I7SUFDdEIsTUFBTSxFQUFFLEVBQUU7SUFDVixVQUFVLEVBQUUsUUFBUTtJQUNwQixrQkFBa0IsRUFBRSxDQUFDLElBQUksQ0FBQztJQUMxQixxQkFBcUIsRUFBRSxJQUFJO0lBQzNCLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7Q0FDMUIsRUFDRCxnQkFBZ0IsR0FBRyxVQUFTLEdBQVc7SUFDdEMsT0FBTyxDQUNOLEdBQUc7UUFDSCxHQUFHO2FBQ0QsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7YUFDdkIsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7YUFDcEIsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUM7YUFDdkIsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FDMUIsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVIO0lBS0MsWUFBWSxPQUFZO1FBSmhCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLFlBQU8sR0FBYSxFQUFjLENBQUM7UUFDbkMsbUJBQWMsR0FBYSxFQUFjLENBQUM7UUFHakQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsY0FBYyxDQUFDLE1BQWM7UUFDNUIsTUFBTSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxDLElBQUksUUFBUSxH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L0IsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTt3QkFDOUIsTUFBTTtxQkFDTjtpQkFDRDthQUNEO1NBQ0Q7UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNqQixDQUFDO0lBRU8sVUFBVSxDQUNqQixNQUFjLEVBQ2QsaUJBQTBCLEtBQUs7UUFFL0IsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLElBQUksR0FBRyxFQUFFO1lBQ1IsSUFBSSxNQUFNLEdBQ1QsY0FBYyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRztnQkFDekMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUTtnQkFDN0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDO1lBQ3JDLE1BQU0sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUMxQixNQUFNLEVBQ04sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQ3ZCLE1BQU0sQ0FDTixDQUFDO1NBQ0Y7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7Q0FDRDtBQUVELGVBQWUsWUFBWSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIE9XZWJUZWxJbnB1dC5qcyAyMDE2LTIwMTlcclxuICpcclxuICogRW1pbGUgU2lsYXMgU2FyZSAoZW1pbGUuc2lsYXNAZ21haWwuY29tKVxyXG4gKi9cclxuXHJcbi8vIHRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vamFja29jbnIvaW50bC10ZWwtaW5wdXQvXHJcbmltcG9ydCAnLi91dGlscy5qcyc7XHJcbmltcG9ydCB7IHRDb3VudHJ5LCBjYzJUb0NvdW50cnksIGRpYWxDb2RlVG9DYzIgfSBmcm9tICcuL2NvdW50cmllcy5qcyc7XHJcblxyXG50eXBlIHRPcHRpb25zID0ge1xyXG5cdGNjMjogc3RyaW5nO1xyXG5cdC8vbmF0aW9uYWxNb2RlOiB0cnVlLFxyXG5cdG51bWJlcjogc3RyaW5nO1xyXG5cdG51bWJlclR5cGU6ICdNT0JJTEUnO1xyXG5cdHByZWZlcnJlZENvdW50cmllczogc3RyaW5nW107XHJcblx0c2hvd1NhbXBsZVBsYWNlaG9sZGVyOiBib29sZWFuO1xyXG5cdGFsbG93ZWRDb3VudHJpZXM6ICgpID0+IHN0cmluZ1tdO1xyXG59O1xyXG5cclxuY29uc3QgdXRpbHMgPSAod2luZG93IGFzIGFueSkuaW50bFRlbElucHV0VXRpbHMsXHJcblx0ZGVmYXVsdE9wdGlvbnM6IHRPcHRpb25zID0ge1xyXG5cdFx0Y2MyOiAnYmonLFxyXG5cdFx0Ly9uYXRpb25hbE1vZGU6IGZhbHNlLFxyXG5cdFx0bnVtYmVyOiAnJyxcclxuXHRcdG51bWJlclR5cGU6ICdNT0JJTEUnLFxyXG5cdFx0cHJlZmVycmVkQ291bnRyaWVzOiBbJ2JqJ10sXHJcblx0XHRzaG93U2FtcGxlUGxhY2Vob2xkZXI6IHRydWUsXHJcblx0XHRhbGxvd2VkQ291bnRyaWVzOiAoKSA9PiBbXSxcclxuXHR9LFxyXG5cdGNsZWFuUGhvbmVTdHJpbmcgPSBmdW5jdGlvbihzdHI6IHN0cmluZykge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0JysnICtcclxuXHRcdFx0c3RyXHJcblx0XHRcdFx0LnJlcGxhY2UoL1teXFxkIC1dL2csICcnKVxyXG5cdFx0XHRcdC5yZXBsYWNlKC9cXHMrL2csICcgJylcclxuXHRcdFx0XHQucmVwbGFjZSgvLVteXFxkXS9nLCAnLScpXHJcblx0XHRcdFx0LnJlcGxhY2UoL15bXjEtOV0rL2csICcnKVxyXG5cdFx0KTtcclxuXHR9O1xyXG5cclxuY2xhc3MgT1dlYlRlbElucHV0IHtcclxuXHRwcml2YXRlIHBob25lTnVtYmVyOiBzdHJpbmcgPSAnJztcclxuXHRwcml2YXRlIG9wdGlvbnM6IHRPcHRpb25zID0ge30gYXMgdE9wdGlvbnM7XHJcblx0cHJpdmF0ZSBjdXJyZW50Q291bnRyeTogdENvdW50cnkgPSB7fSBhcyB0Q291bnRyeTtcclxuXHJcblx0Y29uc3RydWN0b3Iob3B0aW9uczogYW55KSB7XHJcblx0XHR0aGlzLl91cGRhdGVPcHRpb25zKG9wdGlvbnMpO1xyXG5cdH1cclxuXHJcblx0c2V0UGhvbmVOdW1iZXIobnVtYmVyOiBzdHJpbmcpIHtcclxuXHRcdG51bWJlciA9IGNsZWFuUGhvbmVTdHJpbmcobnVtYmVyKTtcclxuXHJcblx0XHRsZXQgZGlhbENvZGUgPSBPV2ViVGVsSW5wdXQuZ2V0RGlhbENvZGUobnVtYmVyKSxcclxuXHRcdFx0Zm9ybWF0dGVkO1xyXG5cclxuXHRcdGlmIChkaWFsQ29kZSkge1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRDb3VudHJ5ID1cclxuXHRcdFx0XHRPV2ViVGVsSW5wdXQuZ2V0Q291bnRyeVdpdGhEaWFsQ29kZShkaWFsQ29kZSkgfHxcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRDb3VudHJ5O1xyXG5cdFx0XHRmb3JtYXR0ZWQgPSB0aGlzLl9nZXRGb3JtYXQobnVtYmVyKTtcclxuXHJcblx0XHRcdHRoaXMucGhvbmVOdW1iZXIgPSBmb3JtYXR0ZWQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnBob25lTnVtYmVyID0gbnVtYmVyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0c2V0Q291bnRyeShjYzI6IHN0cmluZykge1xyXG5cdFx0bGV0IGNjMkxvd2VyID0gY2MyLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRpZiAoY2MyVG9Db3VudHJ5W2NjMkxvd2VyXSkge1xyXG5cdFx0XHRsZXQgb3B0ID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKTtcclxuXHRcdFx0b3B0LmNjMiA9IGNjMkxvd2VyO1xyXG5cdFx0XHRvcHQubnVtYmVyID0gJysnICsgY2MyVG9Db3VudHJ5W2NjMkxvd2VyXS5kaWFsQ29kZTtcclxuXHJcblx0XHRcdHRoaXMuX3VwZGF0ZU9wdGlvbnMob3B0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignVW5rbm93biBjb3VudHJ5IGNvZGU6ICcgKyBjYzIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfdXBkYXRlT3B0aW9ucyhvcHRpb25zOiB0T3B0aW9ucyk6IHRoaXMge1xyXG5cdFx0dGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihcclxuXHRcdFx0e30sXHJcblx0XHRcdGRlZmF1bHRPcHRpb25zLFxyXG5cdFx0XHRvcHRpb25zIHx8IHRoaXMub3B0aW9ucyB8fCB7fVxyXG5cdFx0KTtcclxuXHRcdHRoaXMuY3VycmVudENvdW50cnkgPSBPV2ViVGVsSW5wdXQuZ2V0Q291bnRyeVdpdGhDYzIodGhpcy5vcHRpb25zLmNjMik7XHJcblxyXG5cdFx0aWYgKCF0aGlzLm9wdGlvbnMubnVtYmVyKSB7XHJcblx0XHRcdC8vIGlmIG5vIG51bWJlciBpbml0aWFsaXplIHRvIGRlZmF1bHQgY2MyIGRpYWxDb2RlXHJcblx0XHRcdHRoaXMub3B0aW9ucy5udW1iZXIgPVxyXG5cdFx0XHRcdCcrJyArIGNjMlRvQ291bnRyeVt0aGlzLm9wdGlvbnMuY2MyLnRvTG93ZXJDYXNlKCldLmRpYWxDb2RlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuc2V0UGhvbmVOdW1iZXIodGhpcy5vcHRpb25zLm51bWJlcik7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRnZXRDdXJyZW50Q291bnRyeSgpOiB0Q291bnRyeSB7XHJcblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50Q291bnRyeTtcclxuXHR9XHJcblxyXG5cdGdldE9wdGlvbnMoKTogdE9wdGlvbnMge1xyXG5cdFx0cmV0dXJuIHRoaXMub3B0aW9ucztcclxuXHR9XHJcblxyXG5cdGlzVmFsaWQobnVtYmVyOiBzdHJpbmcgPSB0aGlzLnBob25lTnVtYmVyKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gdXRpbHMuaXNWYWxpZE51bWJlcihudW1iZXIsIHRoaXMuY3VycmVudENvdW50cnkuY2MyKTtcclxuXHR9XHJcblxyXG5cdGlzUG9zc2libGUobnVtYmVyOiBzdHJpbmcgPSB0aGlzLnBob25lTnVtYmVyKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHR1dGlscy5nZXRWYWxpZGF0aW9uRXJyb3IobnVtYmVyLCB0aGlzLmN1cnJlbnRDb3VudHJ5LmNjMikgPT09XHJcblx0XHRcdHV0aWxzLnZhbGlkYXRpb25FcnJvci5JU19QT1NTSUJMRVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdGlzRm9yKHR5cGU6IHN0cmluZywgbnVtYmVyOiBzdHJpbmcgPSB0aGlzLnBob25lTnVtYmVyKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHR1dGlscy5nZXROdW1iZXJUeXBlKG51bWJlciwgdGhpcy5jdXJyZW50Q291bnRyeS5jYzIpID09PVxyXG5cdFx0XHR1dGlscy5udW1iZXJUeXBlW3R5cGVdXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0Z2V0U2FtcGxlKGlzTmF0aW9uYWxNb2RlOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xyXG5cdFx0bGV0IG51bWJlclR5cGUgPSB1dGlscy5udW1iZXJUeXBlW3RoaXMub3B0aW9ucy5udW1iZXJUeXBlXTtcclxuXHJcblx0XHRyZXR1cm4gdXRpbHMuZ2V0RXhhbXBsZU51bWJlcihcclxuXHRcdFx0dGhpcy5jdXJyZW50Q291bnRyeS5jYzIsXHJcblx0XHRcdEJvb2xlYW4oaXNOYXRpb25hbE1vZGUpLFxyXG5cdFx0XHRudW1iZXJUeXBlXHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0Z2V0SW5wdXQoZm9ybWF0OiBib29sZWFuID0gZmFsc2UpIHtcclxuXHRcdHJldHVybiBmb3JtYXRcclxuXHRcdFx0PyB0aGlzLl9nZXRGb3JtYXQodGhpcy5waG9uZU51bWJlcilcclxuXHRcdFx0OiB1dGlscy5mb3JtYXROdW1iZXIodGhpcy5waG9uZU51bWJlciwgdGhpcy5jdXJyZW50Q291bnRyeS5jYzIpO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGlzUGhvbmVOdW1iZXJQb3NzaWJsZShudW1iZXI6IHN0cmluZywgcG9zc2libGU6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG5cdFx0bGV0IGluc3RhbmNlID0gbmV3IE9XZWJUZWxJbnB1dCh7IG51bWJlcjogbnVtYmVyIH0pO1xyXG5cclxuXHRcdGlmIChwb3NzaWJsZSA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRyZXR1cm4gaW5zdGFuY2UuaXNQb3NzaWJsZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdGluc3RhbmNlLmlzVmFsaWQoKSB8fFxyXG5cdFx0XHQoaW5zdGFuY2UuaXNQb3NzaWJsZSgpICYmIGluc3RhbmNlLmlzRm9yKCdNT0JJTEUnKSlcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0Q291bnRyeVdpdGhDYzIoY2MyOiBzdHJpbmcpIHtcclxuXHRcdHJldHVybiBjYzJUb0NvdW50cnlbY2MyLnRvTG93ZXJDYXNlKCldO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldENvdW50cnlXaXRoRGlhbENvZGUoZGlhbENvZGU6IHN0cmluZyk6IHRDb3VudHJ5IHwgbnVsbCB7XHJcblx0XHRsZXQgZm91bmQgPSBudWxsO1xyXG5cclxuXHRcdGlmIChkaWFsQ29kZSkge1xyXG5cdFx0XHRsZXQgY2MyTGlzdCA9IGRpYWxDb2RlVG9DYzJbZGlhbENvZGVdO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBjYzJMaXN0Lmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0bGV0IGZpcnN0ID0gY2MyTGlzdFtqXTsgLy9tYXkgYmUgbnVsbCBzbyB3ZSBsZXQgaXQgYW5kIGdvIHRvIHRoZSBuZXh0IGlmIGV4aXN0c1xyXG5cdFx0XHRcdGlmIChmaXJzdCkge1xyXG5cdFx0XHRcdFx0Zm91bmQgPSBPV2ViVGVsSW5wdXQuZ2V0Q291bnRyeVdpdGhDYzIoZmlyc3QpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZvdW5kO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldERpYWxDb2RlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuXHRcdGxldCBkaWFsQ29kZSA9ICcnLFxyXG5cdFx0XHRwaG9uZU51bWJlciA9IFN0cmluZyhzdHIpLFxyXG5cdFx0XHRudW1iZXJSZWcgPSAvWzAtOV0vO1xyXG5cclxuXHRcdC8vIG9ubHkgaW50ZXJlc3RlZCBpbiBpbnRlcm5hdGlvbmFsIG51bWJlcnMgKHN0YXJ0aW5nIHdpdGggYSBwbHVzKVxyXG5cdFx0aWYgKHBob25lTnVtYmVyLmNoYXJBdCgwKSA9PT0gJysnKSB7XHJcblx0XHRcdGxldCBudW1lcmljQ2hhcnMgPSAnJztcclxuXHRcdFx0Ly8gaXRlcmF0ZSBvdmVyIGNoYXJzXHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGhvbmVOdW1iZXIubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRsZXQgYyA9IHBob25lTnVtYmVyLmNoYXJBdChpKTtcclxuXHRcdFx0XHQvLyBpZiBjaGFyIGlzIG51bWJlclxyXG5cdFx0XHRcdGlmIChudW1iZXJSZWcudGVzdChjKSkge1xyXG5cdFx0XHRcdFx0bnVtZXJpY0NoYXJzICs9IGM7XHJcblx0XHRcdFx0XHQvLyBpZiBjdXJyZW50IG51bWVyaWNDaGFycyBtYWtlIGEgdmFsaWQgZGlhbCBjb2RlXHJcblx0XHRcdFx0XHRpZiAoZGlhbENvZGVUb0NjMltudW1lcmljQ2hhcnNdKSB7XHJcblx0XHRcdFx0XHRcdC8vIHN0b3JlIHRoZSBhY3R1YWwgcmF3IHN0cmluZyAodXNlZnVsIGZvciBtYXRjaGluZyBsYXRlcilcclxuXHRcdFx0XHRcdFx0ZGlhbENvZGUgPSBudW1lcmljQ2hhcnM7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBsb25nZXN0IGRpYWwgY29kZSBpcyA0IGNoYXJzXHJcblx0XHRcdFx0XHRpZiAobnVtZXJpY0NoYXJzLmxlbmd0aCA9PT0gNCkge1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGlhbENvZGU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9nZXRGb3JtYXQoXHJcblx0XHRudW1iZXI6IHN0cmluZyxcclxuXHRcdGlzTmF0aW9uYWxNb2RlOiBib29sZWFuID0gZmFsc2VcclxuXHQpOiBzdHJpbmcge1xyXG5cdFx0bGV0IHJ1biA9IG51bWJlciAmJiBudW1iZXIudHJpbSgpLmxlbmd0aCA+IDE7XHJcblx0XHRpZiAocnVuKSB7XHJcblx0XHRcdGxldCBmb3JtYXQgPVxyXG5cdFx0XHRcdGlzTmF0aW9uYWxNb2RlIHx8IG51bWJlci5jaGFyQXQoMCkgIT09ICcrJ1xyXG5cdFx0XHRcdFx0PyB1dGlscy5udW1iZXJGb3JtYXQuTkFUSU9OQUxcclxuXHRcdFx0XHRcdDogdXRpbHMubnVtYmVyRm9ybWF0LklOVEVSTkFUSU9OQUw7XHJcblx0XHRcdG51bWJlciA9IHV0aWxzLmZvcm1hdE51bWJlcihcclxuXHRcdFx0XHRudW1iZXIsXHJcblx0XHRcdFx0dGhpcy5jdXJyZW50Q291bnRyeS5jYzIsXHJcblx0XHRcdFx0Zm9ybWF0XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG51bWJlcjtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9XZWJUZWxJbnB1dDtcclxuIl19