module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    customLaunchers: {
      chromeTravisCI: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    files: [
      "angular-ts-decorators.ts",
      "spec/**/*.ts",
    ],
    exclude: ['src'],
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
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  });

  if (process.env.TRAVIS) {
    config.browsers = ['chromeTravisCI'];
  }
};
