/**
 * OWebTelInput.js 2016-2019
 *
 * Emile Silas Sare (emile.silas@gmail.com)
 */

// thanks to https://github.com/jackocnr/intl-tel-input/
import './utils.js';
import {
	tCountry,
	cc2ToCountry,
	dialCodeToCc2,
	countries,
} from './countries.js';

type tOptions = {
	cc2: string;
	//nationalMode: true,
	number: string;
	numberType: 'MOBILE';
	preferredCountries: string[];
	showSamplePlaceholder: boolean;
	allowedCountries: () => string[];
};

const utils = (window as any).intlTelInputUtils,
	defaultOptions: tOptions = {
		cc2: 'bj',
		//nationalMode: false,
		number: '',
		numberType: 'MOBILE',
		preferredCountries: ['bj'],
		showSamplePlaceholder: true,
		allowedCountries: () => [],
	},
	cleanPhoneString = function(str: string) {
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
	private phoneNumber: string = '';
	private options: tOptions = {} as tOptions;
	private currentCountry: tCountry = {} as tCountry;

	constructor(options: any) {
		this._updateOptions(options);
	}

	setPhoneNumber(number: string) {
		number = cleanPhoneString(number);

		let dialCode = OWebTelInput.getDialCode(number),
			formatted;

		if (dialCode) {
			this.currentCountry =
				OWebTelInput.getCountryWithDialCode(dialCode) ||
				this.currentCountry;
			formatted = this._getFormat(number);

			this.phoneNumber = formatted;
		} else {
			this.phoneNumber = number;
		}

		return this;
	}

	setCountry(cc2: string) {
		let cc2Lower = cc2.toLowerCase();
		if (cc2ToCountry[cc2Lower]) {
			let opt = Object.assign({}, this.options);
			opt.cc2 = cc2Lower;
			opt.number = '+' + cc2ToCountry[cc2Lower].dialCode;

			this._updateOptions(opt);
		} else {
			throw new Error('Unknown country code: ' + cc2);
		}
	}

	private _updateOptions(options: tOptions): this {
		this.options = Object.assign(
			{},
			defaultOptions,
			options || this.options || {}
		);
		this.currentCountry = OWebTelInput.getCountryWithCc2(this.options.cc2);

		if (!this.options.number) {
			// if no number initialize to default cc2 dialCode
			this.options.number =
				'+' + cc2ToCountry[this.options.cc2.toLowerCase()].dialCode;
		}

		this.setPhoneNumber(this.options.number);

		return this;
	}

	getCurrentCountry(): tCountry {
		return this.currentCountry;
	}

	getOptions(): tOptions {
		return this.options;
	}

	isValid(number: string = this.phoneNumber): boolean {
		return utils.isValidNumber(number, this.currentCountry.cc2);
	}

	isPossible(number: string = this.phoneNumber): boolean {
		return (
			utils.getValidationError(number, this.currentCountry.cc2) ===
			utils.validationError.IS_POSSIBLE
		);
	}

	isFor(type: string, number: string = this.phoneNumber): boolean {
		return (
			utils.getNumberType(number, this.currentCountry.cc2) ===
			utils.numberType[type]
		);
	}

	getSample(isNationalMode: boolean = false): string {
		let numberType = utils.numberType[this.options.numberType];

		return utils.getExampleNumber(
			this.currentCountry.cc2,
			Boolean(isNationalMode),
			numberType
		);
	}

	getInput(format: boolean = false) {
		return format
			? this._getFormat(this.phoneNumber)
			: utils.formatNumber(this.phoneNumber, this.currentCountry.cc2);
	}

	static isPhoneNumberPossible(number: string, possible: boolean = false) {
		let instance = new OWebTelInput({ number: number });

		if (possible === true) {
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

	static getCountryWithDialCode(dialCode: string): tCountry | null {
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
	static getCountryByCc2(cc2: string) {
		return cc2ToCountry[cc2];
	}

	static getDialCode(str: string): string {
		let dialCode = '',
			phoneNumber = String(str),
			numberReg = /[0-9]/;

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

	private _getFormat(
		number: string,
		isNationalMode: boolean = false
	): string {
		let run = number && number.trim().length > 1;
		if (run) {
			let format =
				isNationalMode || number.charAt(0) !== '+'
					? utils.numberFormat.NATIONAL
					: utils.numberFormat.INTERNATIONAL;
			number = utils.formatNumber(
				number,
				this.currentCountry.cc2,
				format
			);
		}

		return number;
	}
}

export default OWebTelInput;
