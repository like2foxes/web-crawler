'use strict'
import {getUrlArgument} from './input.js';
import { crawlPage } from './crawl.js';
import { printReport, sortURLs } from './printReport.js';

async function main() {
	const url = getUrlArgument();
	const urls = await crawlPage(url, url, new Map());
	printReport(sortURLs(urls));
}

main()
