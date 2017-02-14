#SVCA Mobile Site Automation

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

#Prerequisites
You will need to have Node.js (Install the latest version of Node.js) and NPM (comes with Node) installed on your machine. Check out their project websites for more instructions

#Installation
	$ cd <your projects folder>
	$ git https://github.com/kma7/mobile-site-automation.git
	$ cd mobile-site-automation/
	$ npm install

Set up Selenium environment
The simplest way to get started is to use one of the NPM selenium standalone packages like: vvo/selenium-standalone (https://github.com/vvo/selenium-standalone).

	$ npm install selenium-standalone@latest -g
	$ selenium-standalone install

Execute the test runner:

	$ npm test

#Note
The configuration file contains all necessary information to run your test suite. It is a node module that exports a JSON.