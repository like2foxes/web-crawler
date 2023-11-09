'use strict'
import {getUrlArgument} from './input.js';
import { getHTMLFromURL, getURLFromHTML } from './crawl.js';

async function main() {
	const url = getUrlArgument();
	const html = await getHTMLFromURL(url);
	const urls = getURLFromHTML(html, url.toString());
	for(const url of urls) {
		console.log(url);
	}
}

main()
