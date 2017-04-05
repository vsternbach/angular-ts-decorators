module.exports = (config) => {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    customLaunchers: {
      chromeTravisCI: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    files: [
      'src/**/*.ts',
      'test/**/*.ts',
    ],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript', 'coverage'],
      'test/**/*.ts': ['karma-typescript'],
    },
    reporters: ['dots', 'coverage'],
    coverageReporter: {
      reporters: [
        // { type: 'html', subdir: 'report-html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
      ]
    },
    colors: true,
    browsers: ['Chrome'],
  });

  if (process.env.TRAVIS) {
    config.browsers = ['chromeTravisCI'];
  }
};
