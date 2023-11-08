import { describe, it } from 'mocha';
import { expect } from 'chai';
import { normalizeURL } from '../src/crawl.js';

describe('normalizeURL', function() {
	const expected = 'blog.boot.dev/path';

	it('should emits the protocol from the url', function () {
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
