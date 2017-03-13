module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'karma-typescript'],
        files: [
            "angular-ts-decorators.ts",
            "spec/**/*.ts",
        ],
        exclude: [],
        preprocessors: {
            'angular-ts-decorators.ts': ['coverage'],
            '**/*.ts': ['karma-typescript'],
        },
        reporters: ['dots', 'coverage', 'karma-typescript'],
        coverageReporter: {
            dir: 'coverage',
            type: 'html'
        },
        client: {
            captureConsole: true
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false,
        concurrency: Infinity
    });
};
