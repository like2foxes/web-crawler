'use strict';

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { normalizeURL, getURLsFromHTML } from '../src/crawl.js';

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

describe('getURLsFromHTML', function() {
	const baseUrl = new URL('https://blog.boot.dev');
	const aAbsolutePath = `<a href="${baseUrl.toString()}absolute.html"></a>`;
	const aRelativePath = `<a href="/relative.html"></a>`;
	const multipleATags = `<div>${aAbsolutePath}${aRelativePath}</div>`;

	const fullUrlFromAbsolute = 'https://blog.boot.dev/absolute.html'
	const fullUrlFromRelative = 'https://blog.boot.dev/relative.html'

	it('should return an empty array when no urls on html', function() {
		expect(getURLsFromHTML('', baseUrl))
			.to.be.instanceof(Array)
			.and.to.be.empty
	});

	it('should return an array with a url if it was on the html', function() {
		expect(getURLsFromHTML(aAbsolutePath, baseUrl).map(urlToStr))
			.to.be.length(1)
			.and.to.include(fullUrlFromAbsolute);

	});

	it('should convert relative urls to absolute urls', function() {
		expect(getURLsFromHTML(aRelativePath, baseUrl).map(urlToStr))
			.to.be.length(1)
			.and.to.include(fullUrlFromRelative);
	});

	it('should find all anchor tags', function() {
		expect(getURLsFromHTML(multipleATags, baseUrl).map(urlToStr))
			.to.be.length(2)
			.and.to.include.members([
				fullUrlFromAbsolute, 
				fullUrlFromRelative
			]);
	})

	function urlToStr(url) {
		return url.toString();
	}
});
