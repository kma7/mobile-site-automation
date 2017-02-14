'use strict'

const request = require('request')

/**
 * A module for creating http requests
 */
class HTTPModule {
  /**
   * Empty constructor
   */
  constructor() {}
  /**
   * @param {string} type - the method for our request
   * @param {string} url - the url for our request
   * @param {string} payload - the payload for our request
   * @param {boolean} followRedirect - flag for redirects
   * @param {boolean} rejectErr - flag for rejecting errors
   * We build a promise and return it here.
   * @return {promise} output - a promise based on configuration
   */
  buildRequestPromise(type, url, payload, followRedirect, rejectErr = true) {
    return new Promise(
      (resolve, reject) => {
        request(
          this.buildRequestConfig(type, url, payload, followRedirect),
          (error, response, body) => {
            if (rejectErr && error) {
              reject(error)
            } else if (!rejectErr && error) {
              resolve({
                response: {
                  statusCode: 503
                },
                body: error
              })
            } else {
              resolve({
                response: response.toJSON(),
                body: body
              })
            }
          }
        )
      }
    )
  }
  /**
   * @param {string} type - the method for our config
   * @param {string} url - the url for our config
   * @param {string} payload - the payload for our config
   * @param {boolean} followRedirect - flag for redirects
   * We build a config and return it here.
   * @return {object} options - a configuration object
   */
  buildRequestConfig(type, url, payload, followRedirect) {
    let options = {
      method: `${type}`,
      uri: `${url}`,
      protocol: `${url.split('//')[0]}`,
      followRedirect: followRedirect
    }
    if (payload) {
      if (typeof payload === 'object') {
        payload = JSON.stringify(payload)
      }
      options.data = payload
    }
    return options
  }
}

const httpCalls = new HTTPModule()
module.exports = {
  started: httpCalls,
  class: HTTPModule,
  getPromise: (url, redirect = true, rejectErr = true) => {
    return httpCalls.buildRequestPromise('GET', url, null, redirect, rejectErr)
  },
  headPromise: (url, redirect = false, rejectErr = false) => {
    return httpCalls.buildRequestPromise('HEAD', url, null, redirect, rejectErr)
  }
}
