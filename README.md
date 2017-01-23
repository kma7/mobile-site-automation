#SVCA Mobile Site Automation

#Prerequisites
You will need to have Node.js (Install the latest version of Node.js) and NPM (comes with Node) installed on your machine. Check out their project websites for more instructions

#Installation
	$ cd <your projects folder>
	$ git https://github.com/kma7/mobile-site-auto-test.git
	$ cd mobile-site-auto-test/
	$ npm install

Set up Selenium environment
The simplest way to get started is to use one of the NPM selenium standalone packages like: vvo/selenium-standalone (https://github.com/vvo/selenium-standalone).

	$ npm install selenium-standalone@latest -g
	$ selenium-standalone install
	$ selenium-standalone start

After installing it globally you can run your server by executing: 

	$ selenium-standalone start

#GETTING STARTED
Start Selenium Standalone

	$ selenium-standalone start

Execute the test runner:

	$ npm test
