'use strict';

import { Command } from 'commander';

/**
* @summary parse the command line arguments: this is just a thin wrapper over the
* [commander]{@link https://www.npmjs.com/package/commander NPM} package
* @param {string[]} args - the command line args
* @param {boolean} noexit - prevent the command to exit the process in case of an error.
* used for testing
* @returns {URL} a valid parsed url
* @throws {Error} an 'E_INVALID_URL' error if the url argument is invalid
*/
export function getUrlArgument(args = [], noexit = false) {
	const program = new Command();
	if (noexit) {
		program.exitOverride();
	}
	program
		.name('link-crawler')
		.description('Collect all the url of the link in an html page')
		.version(process.env.VERSION || '0.0.1')
		.argument('<url>', 'a url')
		.showHelpAfterError('(add --help for additional information)');
	program.parse(args.length ? args : process.argv);
	const url = program.args[0];
	if(URL.canParse(url)) {
		return new URL(url);
	}
	throw new Error('E_INVALID_URL');
}
