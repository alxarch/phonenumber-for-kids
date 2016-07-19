'use strict';
const PhoneNumber = require('awesome-phonenumber');
const COUNTRIES = require('./data/countries');
function randomCountry () {
	return COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
}
function randomNumeric (length) {
	const result = [];
	while (length--) {
		result.push(Math.floor(Math.random() * 10));
	}
	return result.join('');
}
const ZERO = '0'.charCodeAt(0);
const NINE = '9'.charCodeAt(0);
function normalize (phone) {
	if ('string' != typeof phone) return null;
	const result = [];
	let MIN = ZERO + 1;
	let j = 0;
	for (let i=0; i < phone.length; i++) {
		let n = phone.charCodeAt(i);
		if (n >= MIN && n <= NINE) {
			result.push(n - ZERO);
			MIN = ZERO;
		}
	}
	return result.join('') || null;
}

function random (country, type) {
	country = (null != country) ? `${country}` : randomCountry();
	type = (null != type) ? `${type}` : (country == 'US' ? 'fixed-line-or-mobile' : 'mobile');
	if (country == 'US' && type == 'mobile') {
		throw new Error('Cannot produce a valid random mobile number for US');
	}
	let phone = PhoneNumber.getExample(country, type);
	let random = randomNumeric(6);
	phone = phone.a.number.e164;
	let pos = phone.length - 6;
	return `${phone.slice(0, pos)}${random}`
}

function zeros(phone) {
	phone = normalize(phone);
	return phone ? `00${phone}` : phone;
}
function plus(phone) {
	phone = normalize(phone);
	return phone ? `+${phone}` : phone;
}
function json (phone) {
	phone = cast(phone);
	return {
		number: phone.a.number.e164,
		type: phone.a.type,
		country: phone.a.regionCode,
		valid: phone.a.valid,
		possible: phone.a.possible
	}
}
function cast (phone) {
	return PhoneNumber(plus(phone));
}
function possible (phone, country) {
	phone = cast(phone);
	return phone.a.possible && phone.a.regionCode === country;
}
function country (phone) {
	phone = plus(phone);
	const c = phone ? PhoneNumber.getRegionCodeForCountryCode(phone) : null;
	return 'ZZ' === c ? cast(phone).a.regionCode : c;
}

function type (phone) {
	return cast(phone).a.type;
}
function code (cc) {
	return PhoneNumber.getCountryCodeForRegionCode(cc);
}

function example (cc, type) {
	return PhoneNumber.getExample(cc, type).getNumber();
}

module.exports = {
	example,
	type,
	cast,
	normalize,
	plus,
	zeros,
	possible,
	country,
	code,
	random,
	json
}
