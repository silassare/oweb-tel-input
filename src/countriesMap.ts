import countriesList, { tCountryListItem } from './countiesList';

export type tCountry = {
	name: string;
	dialCode: string;
	cc2: string;
	priority: number;
	areaCodes: string[];
};

let countries: { [key: string]: tCountry } = {},
	dialCodeToCc2: { [key: string]: string[] } = {},
	addKey = function(key: string, to: any) {
		if (!(key in to)) {
			to[key] = [];
		}
	};

for (let i = 0; i < countriesList.length; i++) {
	let _tmp: tCountryListItem = countriesList[i],
		cc2: string = _tmp[1],
		country: tCountry = {
			name: _tmp[0],
			dialCode: _tmp[2],
			cc2: cc2,
			priority: _tmp[3] || 0,
			areaCodes: _tmp[4] || [],
		};

	countries[cc2] = country;

	addKey(country.dialCode, dialCodeToCc2);
	dialCodeToCc2[country.dialCode][country.priority] = cc2;

	if (country.areaCodes) {
		for (let j = 0; j < country.areaCodes.length; j++) {
			let fullDialCode = country.dialCode + country.areaCodes[j];
			addKey(fullDialCode, dialCodeToCc2);
			dialCodeToCc2[fullDialCode][country.priority] = cc2;
		}
	}
}

export default { countries, dialCodeToCc2 };
