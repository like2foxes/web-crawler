'use strict';

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { getUrlArgument } from '../src/input.js';

describe('command-parser', function() {
	it('should throw an error when invoked with no arguments', function() {
		expect(() => getUrlArgument([], true))
			.to.throw(Error);
	})

	it('should throw an error when invoked with 1 argument', function() {
		expect(() => getUrlArgument(['a'], true))
			.to.throw(Error);
	})

	it('should throw an error when invoked with 2 arguments', function() {
		expect(() => getUrlArgument(['a', 'b'], true))
			.to.throw(Error);
	})
})
