module.exports = () => {
    // todo crawl through all directors, compile all classes,
    // add them to the global namespace as tools
    const fs = require("fs"),
        path = require("path"),
        utilDirectory = __dirname,
        assert = require(`${utilDirectory}/assert-fix`),
        utilities = require(`${utilDirectory}/util-builder`),
        tools = {
            fs,
            path,
            assert,
            utilDirectory
        }
    /**
     * Add all of our tools & utilities to global space for easier test writing
     */
    Object.assign(tools, utilities)
    Object.assign(global, tools)
}
