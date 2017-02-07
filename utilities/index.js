module.exports = () => {
    const fs = require("fs"),
        path = require("path"),
        utilDirectory = __dirname,
        assert = require(`${utilDirectory}/assert-fix`),
        async = require("asyncawait/async"),
        await = require("asyncawait/await")
    /**
     * A class to build utilities
     */
    class UtilBuilder {
        /**
         * @param {object} browser - globle instance from webdriverIO
         * Here we start our utilities building
         */
        constructor (browser) {
            this.browser = browser,
            this.utilDirectory = __dirname,
            this.moduleFiles = [],
            this.utilities = {},
            this.verifyUtilDir()
            return this
        }
        /**
         * Here we verify the utilities directory is valid
         */
        verifyUtilDir () {
            try {
                fs.statSync(this.utilDirectory).isDirectory()
            } catch (e) {
                return
            }
            this.findUtilities(this.utilDirectory)
        }
        /**
         * Here we read all utility files under utilities folder
         */
        findUtilities (utilDir) {
            fs.readdirSync(utilDir).forEach(
                (file) => {
                    let filePath = `${utilDir}/${file}`
                    if (fs.statSync(filePath).isDirectory()) {
                        this.findUtilities(filePath)
                    } else {
                        this.moduleFiles.push(filePath)
                    }
                }
            )
            this.buildUtilities()
        }
        /**
         * Here we build all utilities
         */
        buildUtilities () {
            this.moduleFiles.filter(
                (file) => {
                    return file.substr(-10) === "-module.js"
                }
            ).map(
                (module) => {
                    let temp = require(module)
                    if (typeof temp === "function") {
                        temp = require(module)(this.browser)
                    }
                    let fileName = module.replace(/^.*[\\\/]/, ""),
                        moduleName = fileName.split("-").map((fs, index) => {
                            if (index > 0) {
                                let char = fs.charAt(0).toUpperCase()
                                return `${char}${fs.substring(1)}`
                            } else {
                                return fs
                            }
                        }).join("").split(".js")[0]
                    this.utilities[moduleName] = temp
                }
            )
            this.assignUtilities()
        }
        /**
         * Here we add all utilities to global space
         */
        assignUtilities () {
            Object.assign(global, this.utilities)
        }
    }

    let buildUtil = new UtilBuilder(browser),
        tools = {
            fs,
            path,
            assert,
            utilDirectory,
            async,
            await
        }
    /**
     * Add all of our tools to global space for easier test writing
     */
    Object.assign(global, tools)
}
