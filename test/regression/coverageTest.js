'use strict'

const coverageTest = coverageModule.started,
  testPages = require(`${utilDirectory}/../data/test_pages`)

for (let page in testPages) {
  if (testPages.hasOwnProperty(page)) {
    let title = testPages[page].title,
      url = testPages[page].url,
      ttfb = testPages[page].ttfb,
      ttl = testPages[page].ttl,
      checkAllLinksFailMsg = (results) => {
      let msg = '',
        code = '',
        url = ''
      if (Array.isArray(results)) {
        for ({ url, code }
          of results) {
          msg += `url: ${url}\nstatusCode: ${code}\n`
        }
        return msg
      } else if (typeof results === 'string') {
        return results
      }
    }
    describe(`Test ${title}`, () => {
      // Verify page title, not much necessary for mobile site,
      // since all pages have the same title
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
        coverageTest.getStatusCode(url).then(
          (value) => {
            done(assert.strictEqual(value, 200,
              'Page status isn\'t 200'))
          }
        )
      })
      // Only check all links in homepage
      if (page === 'homepage') {
        it('All links in page are giving a 200', function(done) {
          this.timeout(360000)
          coverageTest.checkAllPageLinks(url).then(
            ({ output, links }) => {
              done(
                assert.strictEqual(
                  output,
                  true,
                  `These pages need to be checked` +
                  `\n${checkAllLinksFailMsg(links)}`
                )
              )
            }
          )
        })
      }

      it('No console errors', function(done) {
        this.timeout(360000)
        coverageTest.consoleErrors(url).then(
          (value) => {
            let count = value.length
            done(assert.isTrue(
              (value.length === 0),
              `There were ${value.length} errors`))
          }
        )
      })
      // Performance test. Check the time to get the first byte of page
      it(`Time to First Byte shouldn\'t be greater than ${ttfb/1000}s`,
        function(done) {
          this.timeout(360000)
          coverageTest.responseTime(url, ttfb).then(
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
      // Performance test. Check the time to fully loaded
      it(`Time to fully load shouldn\'t be greater than ${ttl/1000}s`,
        function(done) {
        this.timeout(360000)
        coverageTest.loadTime(url, ttl).then(
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
        coverageTest.checkFavicon(url).then(
          ({ output, error }) => {
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
