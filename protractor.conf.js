exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test/e2e/main.js'],
    baseUrl: 'http://localhost:9001' //default test port with Yeoman
}