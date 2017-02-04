"use strict";

const fs = require("fs")

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
        this.findUtilities()
    }
    /**
     * Here we read all utility files under utilities folder
     */
    findUtilities () {
        fs.readdirSync(this.utilDirectory).forEach(
            (file) => {
                let filePath = `${this.utilDirectory}/${file}`
                if (fs.statSync(filePath).isDirectory()) {
                    fs.readdirSync(filePath).forEach(
                        (file) => {
                            this.moduleFiles.push(`${filePath}/${file}`)
                        }
                    )
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
                let temp
                if (typeof require(module) === "function") {
                    temp = require(module)()
                } else {
                    temp = require(module)
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

let buildUtil = new UtilBuilder(browser)

module.exports = buildUtil.utilities
