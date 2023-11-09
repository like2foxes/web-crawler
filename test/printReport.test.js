import { describe, it } from 'mocha';
import { expect } from 'chai';
import { sortURLs } from '../src/printReport.js';

describe('sortURLs', function() {
	const urls = new Map();

	it('should return an empty array when map is empty', function() {
		const sorted = sortURLs(urls);
		expect(sorted).is.empty;
	})

	it('should return a 1 item array when getting 1 item map', function() {
		urls.set('first.com', 5);
		const sorted = sortURLs(urls);
		expect(sorted).to.be.length(1);
		expect(sorted).to.eql([{ url: 'first.com', count: 5 }]);
	})

	it(
		'should return descending sorted array based on count when getting map',
		function() {
			urls.set('second.com', 1);
			urls.set('first.com', 5);
			const sorted = sortURLs(urls);
			expect(sorted).to.eql([
				{ url: 'first.com', count: 5 },
				{ url: 'second.com', count: 1 }
			])
		}
	)
})
