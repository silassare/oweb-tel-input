/**
 * OWebTelInput.js Since 2016
 *
 * Emile Silas Sare (emile.silas@gmail.com)
 *
 * Thanks to https://github.com/jackocnr/intl-tel-input/
 */
import './utils.js';
import {OCountry, cc2ToCountry, dialCodeToCc2} from './countries';

type OOptions = {
	cc2: string;
	// nationalMode: true,
	phoneNumber: string;
	numberType: 'MOBILE';
	preferredCountries: string[];
	showSamplePlaceholder: boolean;
	allowedCountries: () => string[];
};

const utils                    = (window as any).intlTelInputUtils,
	  defaultOptions: OOptions = {
		  cc2                  : 'bj',
		  // nationalMode: false,
		  phoneNumber          : '',
		  numberType           : 'MOBILE',
		  preferredCountries   : ['bj'],
		  showSamplePlaceholder: true,
		  allowedCountries     : () => [],
	  },
	  cleanPhoneString         = function (str: string) {
		  return (
			  '+' +
			  str
				  .replace(/[^\d -]/g, '')
				  .replace(/\s+/g, ' ')
				  .replace(/-[^\d]/g, '-')
				  .replace(/^[^1-9]+/g, '')
		  );
	  };

class OWebTelInput {
	private phoneNumber      = '';
	private options: OOptions        = {} as OOptions;
	private currentCountry: OCountry = {} as OCountry;

	constructor(options: Partial<OOptions> = {}) {
		this._updateOptions(options);
	}

	setPhoneNumber(phoneNumber: string) {
		phoneNumber = cleanPhoneString(phoneNumber);

		const dialCode = OWebTelInput.getDialCode(phoneNumber);
		let formatted;

		if (dialCode) {
			this.currentCountry =
				OWebTelInput.getCountryWithDialCode(dialCode) ||
				this.currentCountry;
			formatted           = this._getFormat(phoneNumber);

			this.phoneNumber = formatted;
		} else {
			this.phoneNumber = phoneNumber;
		}

		return this;
	}

	setCountry(cc2: string) {
		const cc2Lower = cc2.toLowerCase();
		if (cc2ToCountry[cc2Lower]) {
			const opt       = Object.assign({}, this.options);
			opt.cc2         = cc2Lower;
			opt.phoneNumber = '+' + cc2ToCountry[cc2Lower].dialCode;

			this._updateOptions(opt);
		} else {
			throw new Error('Unknown country code: ' + cc2);
		}
	}

	private _updateOptions(options: Partial<OOptions> = {}): this {
			{},
			defaultOptions,
			options || this.options || {},
		);
		const cc2           = this.options.cc2;
		this.currentCountry = OWebTelInput.getCountryWithCc2(cc2);

		if (!this.options.phoneNumber && cc2ToCountry[cc2]) {
			// if no phoneNumber initialize to default cc2 dialCode
			this.options.phoneNumber = '+' + cc2ToCountry[cc2].dialCode;
		}

		this.setPhoneNumber(this.options.phoneNumber);

		return this;
	}

	getCurrentCountry(): OCountry {
		return this.currentCountry;
	}

	getOptions(): OOptions {
		return this.options;
	}

	isValid(phoneNumber: string = this.phoneNumber): boolean {
		return utils.isValidNumber(phoneNumber, this.currentCountry.cc2);
	}

	isPossible(phoneNumber: string = this.phoneNumber): boolean {
		return (
			utils.getValidationError(phoneNumber, this.currentCountry.cc2) ===
			utils.validationError.IS_POSSIBLE
		);
	}

	isFor(type: string, phoneNumber: string = this.phoneNumber): boolean {
		return (
			utils.getNumberType(phoneNumber, this.currentCountry.cc2) ===
			utils.numberType[type]
		);
	}

	getSample(isNationalMode = false): string {
		const numberType = utils.numberType[this.options.numberType];

		return utils.getExampleNumber(
			this.currentCountry.cc2,
			Boolean(isNationalMode),
			numberType,
		);
	}

	getInput(format = false) {
		return format
			   ? this._getFormat(this.phoneNumber)
			   : utils.formatNumber(this.phoneNumber, this.currentCountry.cc2);
	}

	static isPhoneNumberPossible(
		phoneNumber: string,
		possible = false,
	) {
		const instance = new OWebTelInput({phoneNumber});

		if (possible) {
			return instance.isPossible();
		}

		return (
			instance.isValid() ||
			(instance.isPossible() && instance.isFor('MOBILE'))
		);
	}

	static getCountryWithCc2(cc2: string) {
		return cc2ToCountry[cc2.toLowerCase()];
	}

	static getCountryWithDialCode(dialCode: string): OCountry | null {
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

	static getDialCode(str: string): string {
		const phoneNumber = String(str),
			  numberReg   = /[0-9]/;
		let dialCode      = '';

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

	private _getFormat(
		phoneNumber: string,
		isNationalMode = false,
	): string {
		const run = phoneNumber && phoneNumber.trim().length > 1;
		if (run) {
			const format =
					  isNationalMode || phoneNumber.charAt(0) !== '+'
					  ? utils.numberFormat.NATIONAL
					  : utils.numberFormat.INTERNATIONAL;
			phoneNumber  = utils.formatNumber(
				phoneNumber,
				this.currentCountry.cc2,
				format,
			);
		}

		return phoneNumber;
	}
}

export default OWebTelInput;
