"use strict";

let assert = require('chai').assert,
checkAllLinksFailMsg = function(results) {
    let msg = "", code = "", url = ""
      if (Array.isArray(results)) {
        for ({url, code} of results) {
          msg += `url: ${url}\nstatusCode: ${code}\n`
        }
        return msg
      } else if (typeof results === "string") {
        return results
      }
}

describe('homepage tests', function(){
    this.timeout(99999);
    it('should open mobile site home page', function() {
        browser.url('http://m2-test.svca.cc/');
    });

    it('should load correct title', function() {
        var title = browser.getTitle();
        assert.equal(title, 'SVCA');       
    });

    it('Page is giving a 200', function (done) {
        
    });

    it('should load homepage correctly', function() {
        var chTitle = browser.getText('.app-name');
        assert.equal(chTitle, '網站首頁');
        var enTitle = browser.getText('.bottom-title');
        assert.equal(enTitle, 'Silicon Valley Christian Assembly');
    });

    it('All links on page should be valid', function() {
        //xpath to select all the links
        // var homepageContent = browser.elements('//*[@id="mainContainer"]/div/iron-pages/section[1]//a');
        //css selector way
        // var homepageContent = browser.elements('#mainContainer > div > iron-pages > section.iron-selected a')
       var homepageLinks = browser.getAttribute('(//*[@id="mainContainer"]/div/iron-pages/section[1]//a)', 'href');
       var index = 1;
       var flag = false;
       var results = [];
       homepageLinks.forEach(function(link) {
        var pageTitle = browser.url(link).getTitle();
        if(pageTitle === '404 Not Found') {
            flag = true;
            var res = 'Invalid link:' + index + '\n';
            results.push(res);
        }
        index = index + 1;
       });

       if(flag) {
        assert(false, results);
       }
    });

    //Done Automation Test
    it('finish automatically testing Registration page', function(done) {
        browser.call(done);
    });

});