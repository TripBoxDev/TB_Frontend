exports.config = {
    specs: ['test/e2e/main.js'],
    baseUrl: 'http://localhost:9000', //default test port with Yeoman
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 25000,
        includeStackTrace: true,
        isVerbose: true

    },
    capabilities: {
        'browserName': 'chrome'
    }
}