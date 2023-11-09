'use strict';

/**
* @summary sort a map of urls and their counts to an array
* @param {Map<string, number>} urlCountMap - a map of URLs and their counts
* @returns {Array<{url: string, count: number}>} a sorted array of the map items
*/
export function sortURLs(urlCountMap) {
	return Array.from(urlCountMap.entries())
		.map(([url, count]) => ({ url, count }))
		.sort((a, b) => b.count - a.count)
}

/**
* @summary pretty print a report
* @param {Array<{url: string, count: number}>} counts - an object containing counts
*/
export function printReport(counts) {
	counts.forEach(({url, count}) => {
		console.log(`Found ${count} internal links to ${url}`)
	})
}
