'strict mode';
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
