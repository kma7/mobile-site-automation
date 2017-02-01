"use strict";
const Page = require('./page')

class LoginPage extends Page {

    get username() {
        return browser.element('#userid')
    }
    get password() {
        return browser.element('#password')
    }
    get signInSubmit() {
        return browser.element('#sign-in-submit-btn')
    }
    
}
module.exports = new LoginPage();