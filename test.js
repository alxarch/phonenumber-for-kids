'use strict';
const phonenumber = require('.');
const assert = require('assert');

describe('Phonenumber module', () => {
	describe('phonenumber.normalize()', () => {
		it('Removes zeros from the start', () => {
			let r = phonenumber.normalize('00 0 10 10 10 10');
			assert.equal(r, '10101010')
		});
		it('Removes non digits from a string', () => {
			let r = phonenumber.normalize('+ 10 10 10 10');
			assert.equal(r, '10101010')
		});
		it('Returns null for non numeric', () => {
			let r = phonenumber.normalize('  asdf asdf');
			assert.strictEqual(r, null);
		});
		it('Returns null for non strings', () => {
			assert.strictEqual(phonenumber.normalize({}), null);
			assert.strictEqual(phonenumber.normalize(4), null);
		});
	});
	describe('phonenumber.zeros`()', () => {
		it('Adds zeros prefix', () => {
			assert.equal(phonenumber.zeros('+123456'), '00123456');
		});
		it('Merges zeros prefix', () => {
			assert.equal(phonenumber.zeros('00123456'), '00123456')
		});
	});
	describe('phonenumber.plus`()', () => {
		it('Adds + prefix', () => {
			assert.equal(phonenumber.plus('+123456'), '+123456');
		});
		it('Merges + prefix', () => {
			assert.equal(phonenumber.plus('00123456'), '+123456')
		});
	});
	describe('phonenumber.country`()', () => {
		it('Finds country code', () => {
			assert.equal(phonenumber.country('+303333333'), 'GR');
		});
		it('Finds country code', () => {
			assert.equal(phonenumber.country('00303333333'), 'GR');
		});
		it('Finds country code', () => {
			assert.equal(phonenumber.country('+30 33-33-333'), 'GR');
		});
		it('Handles null', () => {
			assert.equal(phonenumber.country(null), null);
		});
		it('Handles empty string', () => {
			assert.equal(phonenumber.country(''), null);
		});
		it('Handles invalid number', () => {
			assert.equal(phonenumber.country('%214a'), null);
		});
	});
	describe('phonenumber.random()', () => {
		it('Returns a valid random number', () => {
			let r = phonenumber.random('GR');
			assert.ok(r.match(/^\+\d+$/));
			// let p = phonenumber.asPhoneNumber(r);
			// console.log(p);

			assert.equal(phonenumber.possible(r, 'GR'), true, 'Correct country');
			assert.equal(phonenumber.type(r), 'mobile', 'Correct type');
		});
	});
});
