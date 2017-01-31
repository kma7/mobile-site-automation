const appDir = __dirname,
	assert = require(`${appDir}/../../tools/assert-fix`),
	coverageModule = require(`${appDir}/../../tools/coverage-module`).started,
	searchApproaches = require(`${appDir}/../../data/search_input`),
	url = searchApproaches['url']

describe('Search by Hymn names', () => {
	describe('Search by English names', () => {
		searchApproaches["by_name"].english.forEach(
			(name) => {
				it(`Searched: ${name}`, function(done) {
		    		this.timeout(360000)
		    		/*browser.url(url)
		    		browser.pause(1000)
		    		browser.setValue("input[id='input']", name)

		    		browser.keys('Enter')
		    		browser.waitUntil(browser.element('#cards').value !== null, 30000)
		    		let titles = browser.getText('#cards')
		    console.log(titles.indexOf(name.toUpperCase()) !== -1)*/

		    		coverageModule.searchByName(url, name, 'en').then(
		    			(value) => {
		    				done(assert.isTrue(
							    value,
							    `Did not find Hymn: ${name}`)
							)
		    			}
		    		)
				})
			}
		)
	})
})
