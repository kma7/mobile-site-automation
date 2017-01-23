var assert = require('assert');

describe('ndMessages page tests', function(){
    this.timeout(99999);
    it('should open ndMessages page', function() {
        browser.url('http://m2-test.svca.cc/#!/newman');
    });

    it('should load ndMessages page correctly', function() {
        var chTitle = browser.getText('.app-name');
        assert.equal(chTitle, '新人門訓');
        var enTitle = browser.getText('.bottom-title');
        assert.equal(enTitle, 'Silicon Valley Christian Assembly');
    });

    it('Links should be valid', function() {
        //xpath to select all the links
       browser.pause(3000);
       var recentMessageLinks = browser.getAttribute('//*[@id="mainContainer"]/div/iron-pages/section[4]/message-list/paper-material/div/paper-icon-button', 'title');
       var index = 1;
       var flag = false;
       var results = [];
       var exception = ["newman"];
       recentMessageLinks.forEach(function(link) {
	if (link.lastIndexOf('.mp4') !== -1) return;	
	var lastPartUrl = link.substr(link.lastIndexOf('/') + 1);
	if (exception.indexOf(lastPartUrl) !==  -1) return; 
	
        var pageTitle = browser.url(link).getTitle();
        if(pageTitle === '404 Not Found') {
            flag = true;
            var res = 'Invalid link' + index + ':' + link + '\n';
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
