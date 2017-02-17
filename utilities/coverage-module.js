'use strict'

const {headPromise} = require('./http-module'),
  cn_twMap = {
    "伟大的神": "偉大的神",
    "你是我异象": "祢是我異象",
    "你信实何广大": "祢信實何廣大"
  }

class CoverageModule {
  /**
   * @param {object} browser - global instance from webdriverIO
   * @return {object} this - a PageUtility instance
   */
  constructor (browser) {
    this.browser = browser
    return this
  }
  /**
   * @param {string} url - the url
   * @param {boolean} followRedirect - decide whether to follow redirect or not
   * @param {boolean} rejectErr - decide whether to reject error or not
   * @return {promise} statusCode - returns a new promise for a url using get
   * @description Here we return a promise which resolves to statusCode
   */
  getStatusCode(url, followRedirect = true, rejectErr = true) {
    return async(() => {
      return await (headPromise(url, followRedirect, rejectErr)).response.statusCode
    })()
  }

  /**
   * @param {string} url - the url on which to check
   * @return {boolean} output - if all links return a 200
   * @description Here we load a page, find every link and test it
   */
  checkAllPageLinks(url) {
      // Load a page, get every url on it from anchor tags, verfiy they work
      // @return mixed boolean || object
      return async(() => {
        // Land the page
        await (browser.url(url))
        // Get every link on the page
        let links,
          anchorLinks,
          outlineLinks,
          failMsg = ""
        try {
          await (browser.waitUntil(browser.element('a'), 30000))
          await (browser.waitUntil(browser.element('paper-icon-button'), 30000))
          anchorLinks = await (browser.getAttribute('a', 'href'))
          outlineLinks = await (browser.getAttribute('paper-icon-button', 'title'))
          links = anchorLinks.concat(outlineLinks).filter(
            (url) => {
              return url && url.indexOf("http") > -1
            }
          ).map(
            (url) => {
              // Get the status which doesn't follow redirect and keep the url
              return {
                code: await (headPromise(url, false, false)).response.statusCode,
                url: url
              }
            }
          )
        } catch (e) {
          links = e.message
        }
        // Now we see if all links are not 400+ status so redirects are ok
        let isLinksArray = Array.isArray(links),
          output = isLinksArray && links.every(
            ({ code }) => {
              return code < 400
            }
          )
        if (!output && isLinksArray) {
          // If not everything resolved, get the failures
          links = links.filter(
            ({ code }) => {
              return code >= 400
            }
          )
          failMsg = this.checkAllLinksFailMsg(links)
        }
        return { output, failMsg }
      })()
  }
  /**
   * @param {array} results - an array of failed links
   * @return {string} msg/results - fail message
   * @description Here we handle failed links and return meaning message
   */
  checkAllLinksFailMsg (results) {
    let msg = "",
      code = "",
      url = ""
    if (Array.isArray(results)) {
      for ({url, code} of results) {
        msg += `url: ${url}\nstatusCode: ${code}\n`
      }
      return msg
    } else if (typeof results === "string") {
      return results
    }
  }
  /**
   * @param {string} url - url to check console errors
   * @param {string} severityLevel - logs to be selected
   * @return {boolean} mixed boolean - boolean || array
   * @description Here we go to url and get all console errors
   */
  consoleErrors(url) {
      return async(() => {
        await (browser.url(url))
        let logs = await (browser.log('browser'))
        let errors = logs.value.filter((log) => {
          return log.level === 'SEVERE'
        })
        return errors
      })()
    }
  /**
   * @param {string} url - url to check responseTime
   * @param {int} limit - number of milliseconds for limit
   * @return {boolean} boolean - returns true when responseTime is less than
   * the limit
   * @description Here we go to a url and check the responseTime is less than the limit
   * navigate to url with an open timer, end when resolved
   */
  responseTime(url, limit) {
      return async(() => {
        await (browser.url(url))
        let ttfb = await (browser.execute(
          () => {
            return window.performance.timing.responseStart -
              window.performance.timing.requestStart
          }
        ))
        if (ttfb.value > limit) {
          console.info('Time to first byte: ' + ttfb)
        }
        return ttfb.value <= limit
      })()
    }
  /**
   * @param {string} url - url to check time to fully load
   * @param {int} limit - number of milliseconds for limit
   * @return {boolean} boolean - returns true when load time is less than
   * the limit
   */
  loadTime(url, limit) {
      return async(() => {
        await (browser.url(url))
        let ttl = await (browser.execute(
          () => {
            return window.performance.timing.loadEventEnd -
              window.performance.timing.navigationStart
          }
        ))
        if (ttl.value > limit) {
          console.info('Time to load: ' + ttl)
        }
        return ttl.value <= limit
      })()
    }
  /**
   * @param {string} url - url to check favicon
   * @return {object} element - element which contains favicon
   * @description Here we go to a url to check for favicon
   */
  checkFavicon(url) {
      return async(() => {
        await (browser.url(url))
        let error = '',
          output = true
        try {
          await (browser.waitUntil(
            browser.element("link[href='favicon.ico']").value !== null,
            30000
          ))
        } catch (e) {
          output = false
          error = e.message
        }
        return { output, error }
      })()
    }
  /**
   * @param {string} url - land the search page 
   * @param {string} name - Hymn name to be searched by
   * @param {string} type - Tell different test approaches
   * @return {boolean} boolean - return true if the Hymn is found
   * @description Here we go to seach a Hymn by its name
   */
  searchByName(url, name, type) {
    return async(() => {
      await (browser.url(url))
      await (browser.pause(2000))
      await (browser.waitUntil(
        browser.element("input[id='input']").value !== null,
        30000))
      await (browser.setValue("input[id='input']", name))
      await (browser.keys('Enter'))
      await (browser.waitUntil(
        browser.element('#cards').value !== null,
        30000))
      let hymnTitles = '',
        found = false,
        enTitles = [],
        chTitles = [],
        indexTitles = [],
        index
      hymnTitles = await (browser.getText('#cards'))
      let hymnArr = hymnTitles.split('\n')
      for (index = 0; index < hymnArr.length; index++) {
        // Group all English titles, Chinese titles & hymn indexes
        if (index % 3 === 0) {
          chTitles.push(hymnArr[index])
        } else if (index % 3 === 1) {
          enTitles.push(hymnArr[index])
        } else {
          indexTitles.push(hymnArr[index])
        }
      }
      if (type === 'en') {
        name = name.toUpperCase()
        found = enTitles.every((title) => {
          title = title.toUpperCase()
          return title.includes(name)
        })
      } else if (type === 'zh-CN' || type === 'zh-TW') {
        if (type === 'zh-CN') {
          name = cn_twMap[name]
        }
        found = chTitles.every((title) => {
          return title.includes(name)
        })
      } else if (type === 'index') {
        found = indexTitles.every((title) => {
          return title.includes(name)
        })
      } else if (type === 'space') {
        // Tested 'hope ', which will have two items as output
        name = name.trim().toUpperCase()
        found = (hymnTitles.indexOf(name) !== -1 &&
          hymnTitles.lastIndexOf(name) !== -1 &&
          hymnTitles.indexOf(name) !== hymnTitles.lastIndexOf(name)
        )
      } else if (type === 'fail') {
        found = (hymnTitles.includes(name) === false)
      } else {
        found = (hymnTitles.indexOf(name) !== -1 &&
          hymnTitles.lastIndexOf(name) !== -1 &&
          hymnTitles.indexOf(name) !== hymnTitles.lastIndexOf(name)
        )
      }
      return found
    })()
  }
}

module.exports = () => {
  return {
    started: new CoverageModule(),
    className: CoverageModule
  }
}
