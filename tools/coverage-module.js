"use strict"
const { headPromise } = require("./http-module"),
    async = require("asyncawait/async"),
    await = require("asyncawait/await")

class CoverageModule {
    constructor() {}
    /**
     * @param {string} url - the url
     * @param {boolean} followRedirect - decide whether to follow redirect or not
     * @param {boolean} rejectErr - decide whether to reject error or not
     * Here we return a promise which resolves to statusCode
     * @return {promise} statusCode - returns a new promise for a url using get
     */
    getStatusCode(url, followRedirect = true, rejectErr = true) {
        return async(() => {
            return await (headPromise(url, followRedirect, rejectErr)).response.statusCode
        })()
    }

    /**
     * @param {string} url - the url on which to check
     * Here we laod a page, find every link and test it
     * @return {boolean} output - if all links return a 200
     */
    checkAllPageLinks(url) {
        // Load a page, get every url on it from anchor tags, verfiy they work
        // @return mixed boolean || object
        return async(() => {
            // land the page
            await (browser.url(url))
            // get every link on the page
            let links
            try {
                await (browser.waitUntil(browser.element('a'), 30000))
                await (browser.waitUntil(browser.element('paper-icon-button'), 30000))
                let anchorLinks = await (browser.getAttribute('a', 'href')),
                    outlineLinks = await (browser.getAttribute('paper-icon-button', 'title'))
                links = anchorLinks.concat(outlineLinks).filter(
                    (url) => {
                        return url && url.indexOf("http") > -1
                    }
                ).map(
                    (url) => {
                        // get the status which doesn't follow redirect and keep the url
                        return {
                            code: await (headPromise(url, false, false)).response.statusCode,
                            url: url
                        }
                    }
                )
            } catch (e) {
                res = e.message
            }
            // now we see if all links are not 400+ status so redirects are ok
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
            }

            return { output, links }
        })()
    }
    /**
     * @param {string} url - url to check console errors
     * @param {string} severityLevel - logs to be selected
     * Here we go to url and get all console errors
     * @return {boolean} mixed boolean - boolean || array
     */
    consoleErrors(url) {
        return async(() => {
            await (browser.url(url))
            let logs = await (browser.log('browser'))
            let errors = logs.value.filter((log) => {
                return log.level === 'SEVERE'
            })
            console.log('console errors: ' + errors.length)
            return errors
        })()
    }
    /**
     * @param {string} url - url to check responseTime
     * @param {int} limit - number of milliseconds for limit
     * Here we go to a url and check the responseTime is less than the limit
     * navigate to url with an open timer, end when resolved
     * @return {boolean} boolean - returns true when responseTime is less than
     * the limit
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
            console.log('Time to first byte: ' + ttfb.value)
            return ttfb.value <= limit
        })()
    }
    /**
     * @param {string} url - url to check time to fully load
     * @param {int} limit - number of milliseconds for limit
     * Here we go to a url and check the load time is less than the limit
     * navigate to url with an open timer, end when resolved
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
            console.log('Time to load: ' + ttl.value)
            return ttl.value <= limit
        })()
    }
    /**
     * @param {string} url - url to check favicon
     * Here we go to a url to check for favicon
     * @return {object} element - element which contains favicon
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
            console.log('favicon: ' + output)
            return { output, error }
        })()
    }
    /**
     * @param {url} url - land the search page 
     * @param {string} name - Hymn name to be searched by
     * Here we go to seach a Hymn by its name
     * @return {boolean} boolean - return true if the Hymns if found
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
                    30000
            ))
            let hymnTitles = '',
                found = false
            hymnTitles = await (browser.getText('#cards'))
            if(type === 'en') {
                found = (hymnTitles.indexOf(name.toUpperCase()) !== -1)
            } else {
                found = (hymnTitles.indexOf(name) !== -1)
            }
    console.log(found)
            return found
        })()
    }
}

module.exports = {
    started: new CoverageModule(),
    class: CoverageModule
}

//Once exported as a function
/*module.exports = () => {
    return {
        started: new CoverageModule(),
        class: CoverageModule
    }
}
*/
