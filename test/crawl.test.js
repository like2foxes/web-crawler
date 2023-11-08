'use strict';

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { normalizeURL, getURLFromHTML } from '../src/crawl.js';

describe('normalizeURL', function() {
	const expected = 'blog.boot.dev/path';

	it('should emits the protocol from the url', function() {
		const url = 'https://blog.boot.dev/path';
		expect(normalizeURL(url)).to.be.equal(expected)
	})

	it('should emits trailing backslash', function() {
		const url = 'https://blog.boot.dev/path/'
		expect(normalizeURL(url)).to.be.equal(expected)
	})
	it('should throw an error if url is not legal', function() {
		const url = 'koko jumbo';
		expect(() => normalizeURL(url)).to.throw('E_INVALID_URL');
	})
})

describe('getURLFromHTML', function() {
	const baseUrl = 'https://blog.boot.dev';
	const aAbsolutePath = `<a href="${baseUrl}/absolute.html">`;
	const aRelativePath = `<a href="/relative.html">`;
	const multipleATags = `<div>${aAbsolutePath}${aRelativePath}</div>`;

	const fullUrlFromAbsolute = 'https://blog.boot.dev/absolute.html'
	const fullUrlFromRelative = 'https://blog.boot.dev/relative.html'

	it('should return an empty array when no urls on html', function() {
		expect(getURLFromHTML('', baseUrl)).to.be.instanceof(Array)
			.and.to.be.empty
	});

	it('should return an array with a url if it was on the html', function() {
		expect(getURLFromHTML(aAbsolutePath, baseUrl)).to.be.length(1)
			.and.to.include(fullUrlFromAbsolute);

	});

	it('should convert relative urls to absolute urls', function() {
		expect(getURLFromHTML(aRelativePath, baseUrl)).to.be.length(1)
			.and.to.include(fullUrlFromRelative);
	});

	it('should find all anchor tags', function() {
		expect(getURLFromHTML(multipleATags, baseUrl)).to.be.length(2)
			.and.to.include.members([
				fullUrlFromAbsolute, 
				fullUrlFromAbsolute
			]);
	})
});
