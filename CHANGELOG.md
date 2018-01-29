# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.0.2"></a>
## [3.0.2](https://github.com/vsternbach/angular-ts-decorators/compare/v3.0.1...v3.0.2) (2018-01-29)


### Bug Fixes

* **Pipe:** fixed $inject bug ([1a84056](https://github.com/vsternbach/angular-ts-decorators/commit/1a84056))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/vsternbach/angular-ts-decorators/compare/v3.0.0...v3.0.1) (2018-01-15)


### Bug Fixes

* update test suite after removing implicit annotations ([0046928](https://github.com/vsternbach/angular-ts-decorators/commit/0046928))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/vsternbach/angular-ts-decorators/compare/v2.1.0...v3.0.0) (2018-01-15)


### Features

* Remove support for implicit annotations ([19f8ad9](https://github.com/vsternbach/angular-ts-decorators/commit/19f8ad9))
* **NgModule:** Add support for bootstrap elements in NgModule

### Bug Fixes

* use explicit imports from angular definitions instead of namespaced
* **build:** update typescript

### BREAKING CHANGES

* Implicit annotations were error prone and didn't work
correctly with uglified code, so this feature is removed completely now
and it's user's responsibility to take care of angular annotations,
either by explicitly providing them or by using tools like ng-annotate.


<a name="2.1.0"></a>
# [2.1.0](https://github.com/vsternbach/angular-ts-decorators/compare/v2.0.0...v2.1.0) (2017-11-29)


### Features

* add missing exports for Type, Provider and ModuleConfig ([addadc2](https://github.com/vsternbach/angular-ts-decorators/commit/addadc2))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/vsternbach/angular-ts-decorators/compare/v1.3.1...v2.0.0) (2017-11-29)


### Bug Fixes

* handle use case of service registration without explicit name ([667e921](https://github.com/vsternbach/angular-ts-decorators/commit/667e921)), closes [#39](https://github.com/vsternbach/angular-ts-decorators/issues/39)


### Features

* add utility function to get Type name ([390bc80](https://github.com/vsternbach/angular-ts-decorators/commit/390bc80))
* Remove support for link, compile and $provider ([f92351d](https://github.com/vsternbach/angular-ts-decorators/commit/f92351d))


### BREAKING CHANGES

* remove support for directive's link and compile, so you
if you want to migrate directives with link or compile, you need to
register them the old angularjs way.
* remove support for classes registered as $providers, so
if you have custom providers you need to register them the old way.



<a name="1.3.1"></a>
## [1.3.1](https://github.com/vsternbach/angular-ts-decorators/compare/v1.3.0...v1.3.1) (2017-11-14)



<a name="1.3.0"></a>
# [1.3.0](https://github.com/vsternbach/angular-ts-decorators/compare/v1.2.5...v1.3.0) (2017-11-06)


### Bug Fixes

* **providers:** Support deps for useFactory provider registration ([f51eea9](https://github.com/vsternbach/angular-ts-decorators/commit/f51eea9)), closes [#45](https://github.com/vsternbach/angular-ts-decorators/issues/45)


### Features

* **lifecycle_hooks:** Support generic SimpleChange<T> for use in ngOnChanges ([c730215](https://github.com/vsternbach/angular-ts-decorators/commit/c730215)), closes [#46](https://github.com/vsternbach/angular-ts-decorators/issues/46)



<a name="1.2.5"></a>
## [1.2.5](https://github.com/vsternbach/angular-ts-decorators/compare/v1.2.4...v1.2.5) (2017-07-03)


### Bug Fixes

* **directive:** add support for controller and angular hooks ([2eef743](https://github.com/vsternbach/angular-ts-decorators/commit/2eef743)), closes [#31](https://github.com/vsternbach/angular-ts-decorators/issues/31) [#32](https://github.com/vsternbach/angular-ts-decorators/issues/32)



<a name="1.2.4"></a>
## [1.2.4](https://github.com/vsternbach/angular-ts-decorators/compare/v1.2.3...v1.2.4) (2017-06-28)


### Bug Fixes

* **component:** add support for automatic injection ([3e53658](https://github.com/vsternbach/angular-ts-decorators/commit/3e53658)), closes [#29](https://github.com/vsternbach/angular-ts-decorators/issues/29)



<a name="1.2.3"></a>
## [1.2.3](https://github.com/vsternbach/angular-ts-decorators/compare/v1.2.2...v1.2.3) (2017-06-27)


### Bug Fixes

* **NgModule:** Support for TypeScript 2.4, which requires a weak  ([293e783](https://github.com/vsternbach/angular-ts-decorators/commit/293e783))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/vsternbach/angular-ts-decorators/compare/v1.2.1...v1.2.2) (2017-06-27)


### Bug Fixes

* **build:** rename package-lock to npm-shrinkwrap ([853a8d6](https://github.com/vsternbach/angular-ts-decorators/commit/853a8d6))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/vsternbach/angular-ts-decorators/compare/v1.2.0...v1.2.1) (2017-06-27)


### Bug Fixes

* **build:** add package-lock and upgrade to typescript 2.4.1 ([fd7b43e](https://github.com/vsternbach/angular-ts-decorators/commit/fd7b43e))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/vsternbach/angular-ts-decorators/compare/v1.1.2...v1.2.0) (2017-06-27)


### Bug Fixes

* **NgModule:** make declarations optional ([6c510d1](https://github.com/vsternbach/angular-ts-decorators/commit/6c510d1))
* add Type and Provider from angular source code ([2174cec](https://github.com/vsternbach/angular-ts-decorators/commit/2174cec))


### Features

* **bootstrap:** add bootstrap abstraction as in angular 2 ([84356ca](https://github.com/vsternbach/angular-ts-decorators/commit/84356ca))
* **directive:** add [@HostListener](https://github.com/HostListener) support ([b34250f](https://github.com/vsternbach/angular-ts-decorators/commit/b34250f))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/vsternbach/angular-ts-decorators/compare/v1.1.1...v1.1.2) (2017-06-21)


### Features

* **@Component:** add support for styles using webpack require ([f0703ed](https://github.com/vsternbach/angular-ts-decorators/commit/f0703ed)), closes [#25](https://github.com/vsternbach/angular-ts-decorators/issues/25)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/vsternbach/angular-ts-decorators/compare/v1.1.0...v1.1.1) (2017-05-19)


### Bug Fixes

* **@Component:** fix injection error when original controller has no dependencies ([5b5b6a9](https://github.com/vsternbach/angular-ts-decorators/commit/5b5b6a9))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.15...v1.1.0) (2017-05-17)


### Bug Fixes

* **@NgModule:** add backward compatibility for deprecated NgModuleDecorated ([97f7fd5](https://github.com/vsternbach/angular-ts-decorators/commit/97f7fd5))


### Features

* **@Component:** add [@HostListener](https://github.com/HostListener) ([26f5094](https://github.com/vsternbach/angular-ts-decorators/commit/26f5094)), closes [#13](https://github.com/vsternbach/angular-ts-decorators/issues/13)
* **@Component:** add angular 2+ style lifecycle hooks support ([b2fd1bf](https://github.com/vsternbach/angular-ts-decorators/commit/b2fd1bf))



<a name="1.0.15"></a>
## [1.0.15](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.14...v1.0.15) (2017-05-15)


### Bug Fixes

* **build:** add minified build ([10db0e0](https://github.com/vsternbach/angular-ts-decorators/commit/10db0e0))
* **deploy:** change string substitution to POSIX format ([0eea0d9](https://github.com/vsternbach/angular-ts-decorators/commit/0eea0d9))



<a name="1.0.14"></a>
## [1.0.14](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.13...v1.0.14) (2017-05-14)


### Bug Fixes

* **build:** fix interfaces export issue ([bdf6cfe](https://github.com/vsternbach/angular-ts-decorators/commit/bdf6cfe))



<a name="1.0.13"></a>
## [1.0.13](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.12...v1.0.13) (2017-04-27)


### Bug Fixes

* **NgModule:** change warnings ([a23b78e](https://github.com/vsternbach/angular-ts-decorators/commit/a23b78e))



<a name="1.0.12"></a>
## [1.0.12](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.11...v1.0.12) (2017-04-27)



<a name="1.0.11"></a>
## [1.0.11](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.10...v1.0.11) (2017-04-27)



<a name="1.0.10"></a>
## [1.0.10](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.9...v1.0.10) (2017-04-27)



<a name="1.0.9"></a>
## [1.0.9](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.8...v1.0.9) (2017-04-27)



<a name="1.0.8"></a>
## [1.0.8](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.7...v1.0.8) (2017-04-27)


### Bug Fixes

* **build:** fix build script ([f48d2ad](https://github.com/vsternbach/angular-ts-decorators/commit/f48d2ad))



<a name="1.0.7"></a>
## [1.0.7](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.6...v1.0.7) (2017-04-27)



<a name="1.0.6"></a>
## [1.0.6](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.5...v1.0.6) (2017-04-27)



<a name="1.0.5"></a>
## [1.0.5](https://github.com/vsternbach/angular-ts-decorators/compare/v1.0.4...v1.0.5) (2017-04-27)
