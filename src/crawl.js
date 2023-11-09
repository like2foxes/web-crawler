'strict mode';

import { JSDOM } from "jsdom";

/**
* @summary normalize a legal URL
* @param {string} url - a legal URL
* @returns {string} a normalize URL string
* @throws {Error} an "E_INVALID_URL" error
*/
export function normalizeURL(url) {
	if (!URL.canParse(url)) {
		console.error('can\'t parse ', url)
		throw new Error('E_INVALID_URL')
	}
	const { hostname, pathname } = cleanURLParts(new URL(url));
	return `${hostname}${pathname ? '/' : ''}${pathname}`
}

/**
* @summary recursively crawl the all the links in site
* @param {URL} baseURL - the base url of the site
* @param {URL} currentURL - the url currently being visited
* @param {Map<string, number>} pages - aggregation of the links being visited
* @return {Promise<Map<string, number>>} all the pages
*/
export async function crawlPage(baseURL, currentURL, pages) {
	if(baseURL.hostname !== currentURL.hostname) {
		return pages;
	}

	const normalizedCurrentURL = normalizeURL(currentURL.toString());
	const oldValue = pages.get(normalizedCurrentURL);
	if(typeof oldValue !== 'undefined') {
		pages.set(normalizedCurrentURL, oldValue + 1);
		if(normalizedCurrentURL === normalizeURL(baseURL.toString())) {
			pages.set(normalizedCurrentURL, 0);
		}
		return pages;
	}
	pages.set(normalizedCurrentURL, 1);

	const next = await getHTMLFromURL(currentURL);
	const urls = getURLsFromHTML(next, baseURL);
	if(urls.length) {
		await Promise.all(urls.map(url => {
			return crawlPage(baseURL, url, pages);
		}));
	}
	return pages;
}

/**
* @summary scan all the anchor tags on [htmlBody]{@link htmlBody} and transform them into absolute path
* @param {string} htmlBody - an html string represntation
* @param {URL} baseURL - the base url to create an absolute path
* @returns {URL[]} - the paths found in [htmlBody]{@link htmlBody} as absolute paths
*/
export function getURLsFromHTML(htmlBody, baseURL) {
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
* @param {URL} url - a valid url
* @returns {{hostname: string, pathname: string}} trimed and clear of backslash
*/
function cleanURLParts(url) {
	return {
		hostname: removeSlashes(url.hostname.trim()),
		pathname: removeSlashes(url.pathname.trim())
	}
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
	if (href)
		return true;
	return false;
}

/**
* @param {URL} baseURL
* @param {string} href
* @returns {URL}
*/
function absolutePathOf(baseURL, href) {
	if (href.startsWith('/'))
		return new URL(`${removeSlashes(baseURL.toString())}${href}`);
	return new URL(href);
}

/**
* @param {string} str 
* @returns {string}
*/
function removeSlashes(str) {
	return removePrefixSlash(removeTrailingSlash(str.trim()));
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
