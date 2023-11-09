'strict mode';

import { JSDOM } from "jsdom";

/**
* @summary normalize a legal URL
* @param {string} url - a legal URL
* @returns {string} a normalize URL string
* @throws {Error} an "E_INVALID_URL" error
*/
export function normalizeURL(url) {
	if(!URL.canParse(url)) {
		throw new Error('E_INVALID_URL')
	}
	const { hostname, pathname } = new URL(url)
	return `${removeSlashes(hostname)}/${removeSlashes(pathname)}`
}

/**
* @summary scan all the anchor tags on [htmlBody]{@link htmlBody} and transform them into absolute path
* @param {string} htmlBody - an html string represntation
* @param {string} baseURL - the base url to create an absolute path
* @returns {string[]} - the paths found in [htmlBody]{@link htmlBody} as absolute paths
*/
export function getURLFromHTML(htmlBody, baseURL) {
	return getAnchorTagsFromHTML(htmlBody)
		.map(toHref)
		.filter(hasHref)
		.map(maybeRelativeUrl => absolutePathOf(baseURL, maybeRelativeUrl));
}

/**
* @summary extract the content from the given url
* @param {URL} url - a valid URL object
* @return {Promise<string>} an HTML string represntation
*/
export async function getHTMLFromURL(url) {
	const html = await JSDOM.fromURL(url.toString());
	return html.serialize();
}

/**
* @param {string} htmlBody
* @returns {HTMLAnchorElement[]}
*/
function getAnchorTagsFromHTML(htmlBody) {
	return Array.from(
		new JSDOM(htmlBody).window.document.querySelectorAll('a')
	);
}

/**
* @param {HTMLAnchorElement} a
* @returns {string}
*/
function toHref(a) {
	return a.href;
}

/**
* @param {string} href
* @returns {boolean}
*/
function hasHref(href) {
	if(href)
		return true;
	return false;
}

/**
* @param {string} baseURL
* @param {string} href
* @returns {string}
*/
function absolutePathOf(baseURL, href) {
	if(href.startsWith('/'))
		return `${baseURL}${href}`;
	return href;
}

/**
* @param {string} str 
* @returns {string}
*/
function removeSlashes(str) {
	return removePrefixSlash(removeTrailingSlash(str));
}

/**
* @param {string} str 
* @returns {string}
*/
function removePrefixSlash(str) {
	return str.startsWith('/') ? str.slice(1) : str;
}

/**
* @param {string} str 
* @returns {string}
*/
function removeTrailingSlash(str) {
	return str.endsWith('/') ? str.slice(0, -1) : str;
}
