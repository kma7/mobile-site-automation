"use strict";
const coverageTest = coverageModule.started,
	searchApproaches = require(`${utilDirectory}/../data/search_input`),
	url = searchApproaches['url']

describe('Searched by Hymn names', () => {
	describe('Names in English', () => {
		searchApproaches["by_name"].english.forEach(
			(name) => {
				it(`Searched: ${name}`, function(done) {
		    		this.timeout(360000)
		    		coverageTest.searchByName(url, name, 'en').then(
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
	describe('Names in simplified Chinese', () => {
		searchApproaches["by_name"].simplified.forEach(
			(name) => {
				it(`Searched: ${name}`, function(done) {
		    		this.timeout(360000)
		    		coverageTest.searchByName(url, name, 'zh-CN').then(
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
	describe('Names in traditional Chinese', () => {
		searchApproaches["by_name"].traditional.forEach(
			(name) => {
				it(`Searched: ${name}`, function(done) {
		    		this.timeout(360000)
		    		coverageTest.searchByName(url, name, 'zh-TW').then(
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

describe('Searched by Hymn index', () => {
	searchApproaches["by_index"].forEach(
		(index) => {
			it(`Searched index: ${index}`, function(done) {
		    	this.timeout(360000)
		    	coverageTest.searchByName(url, index, 'index').then(
	    			(value) => {
	    				done(assert.isTrue(
						    value,
						    `Did not find Hymn: ${index}`)
						)
	    			}
		    	)
			})
		}
	)
})

describe('Searched by special input', () => {
	describe('Input are in both long & short hymn books', () => {
		searchApproaches["special_input"].long_and_short.forEach(
			(input) => {
				it(`Searched input: ${input}`, function(done) {
			    	this.timeout(360000)
			    	coverageTest.searchByName(url, input, 'input').then(
		    			(value) => {
		    				done(assert.isTrue(
							    value,
							    `Hymn is not found in both long & short hymn books: ${input}`)
							)
		    			}
			    	)
				})
			}
		)
	})
	describe('Input contains space', () => {
		searchApproaches["special_input"].with_space.forEach(
			(input) => {
				it(`Searched input: ${input}`, function(done) {
			    	this.timeout(360000)
			    	coverageTest.searchByName(url, input, 'space').then(
		    			(value) => {
		    				done(assert.isTrue(
							    value,
							    `Did not find Hymn: ${input}`)
							)
		    			}
			    	)
				})
			}
		)
	})
	describe('Input is designed to fail', () => {
		searchApproaches["test_fail"].forEach(
			(input) => {
				it(`Searched but not found: ${input}`, function(done) {
			    	this.timeout(360000)
			    	coverageTest.searchByName(url, input, 'fail').then(
		    			(value) => {
		    				done(assert.isTrue(
							    value,
							    `Did not find Hymn: ${input}`)
							)
		    			}
			    	)
				})
			}
		)
	})

})
