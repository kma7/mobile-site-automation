const appDir = __dirname,
	assert = require(`${appDir}/../../tools/assert-fix`),
	coverageModule = require(`${appDir}/../../tools/coverage-module`)().started,
	testPages = require(`${appDir}/../../data/test_pages`)

for(page in testPages) {
	if(testPages.hasOwnProperty(page)) {
		let title = testPages[page].title,
			url = testPages[page].url,
			ttfb= testPages[page].ttfb,
			ttl = testPages[page].ttl

		describe(`Test ${title}`, () => {
			it('Verify page title', function() {
		    	this.timeout(360000)
				browser.url(url)
		    	browser.getTitle().then(
		    		(pageTitle) => {
		    		assert.equal(pageTitle, 'SVCA')	
		    	})
			})

			it('Page is giving a 200', function(done) {
		    	this.timeout(360000)
				coverageModule.getStatusCode(url).then(
					(value) => {
		console.log("status code: " + value)
						done(assert.strictEqual(value, 200, 'Page status isn\'t 200'))
					}
				)
				
			})

			it('All links in page are returning 200', function() {
		    	this.timeout(360000)

			})

			it('No console errors', function(done) {
		    	this.timeout(360000)
				coverageModule.consoleErrors(url).then(
					(value) => {
                      let count = value.length
					  done(assert.isTrue(
					    (value.length === 0),
					    `There were ${value.length} errors`)
					  )
					}
				)
			})

			it(`Time to First Byte shouldn\'t be greater than ${ttfb/1000}s`, function(done) {
		    	this.timeout(360000)
                coverageModule.responseTime(url, ttfb).then(
                  	(value) => {
	                    done(
	                      assert.isTrue(
	                        value,
	                        'There wasn\'t a response in a timely manner.'
	                      )
	                    )
                  	}
                )
			})

			it(`Time to load shouldn\'t be greater than ${ttl/1000}s`, function(done) {
		    	this.timeout(360000)
                coverageModule.loadTime(url, ttl).then(
                  	(value) => {
	                    done(
	                      assert.isTrue(
	                        value,
	                        'Page is not fully loaded in a timely manner.'
	                      )
	                    )
                  	}
                )
			})


			it('Check favicon', function(done) {
		    	this.timeout(360000)
		    	coverageModule.checkFavicon(url).then(
                  ({output, error}) => {
                    done(
                    assert.strictEqual(
                      output,
                      true,
                      `No icon could be found due to ${error}.`
                    ))
                  }
                )
			})
		})
	}
}

