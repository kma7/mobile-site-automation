"use strict";
const Page = require('./page')

class LoginPage extends Page {

    get username() {
        return browser.element('#ius-userid')
    }
    get password() {
        return browser.element('#ius-password')
    }
    get signInSubmit() {
        return browser.element('#ius-sign-in-submit-btn-text')
    }
    
}
module.exports = new LoginPage();