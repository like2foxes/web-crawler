'use strict'
import {getUrlArgument} from './input.js';
import { getURLFromHTML } from './crawl.js';

function main() {
	const link = getUrlArgument()
	console.log(link)
}

main()
