import * as angular from 'angular';
import { component, directive, registerNgModule, TestService } from './mocks';


describe('NgModule', () => {
  const moduleName = 'TestModule';

  describe('has run and config methods', () => {
    it('module should have run and config blocks', () => {
      const NgModuleClass = registerNgModule(moduleName, [], [], []);
      expect(NgModuleClass.module.name).toBe(moduleName);
      expect(angular.module(moduleName)['_runBlocks'].length).toBe(1);
      expect(angular.module(moduleName)['_configBlocks'].length).toBe(1);
      expect(angular.module(moduleName)['_configBlocks'][0].length).toBe(3);

      expect(angular.module(moduleName)['_runBlocks'][0].$inject).toEqual(['$rootScope']);
      expect(angular.module(moduleName)['_configBlocks'][0][2][0].$inject).toEqual(['$httpProvider'] );

      expect(angular.module(moduleName)['_runBlocks'][0]).toBe(NgModuleClass.run);
      expect(angular.module(moduleName)['_configBlocks'][0][2][0]).toBe(NgModuleClass.config);
    });
  });

  describe('imports', () => {
    it('should define required module as dependency', () => {
      const importedModuleName = 'ImportedModule';
      const importedModule = registerNgModule(importedModuleName, [], [], []);
      registerNgModule(moduleName, [importedModule], [], []);
      expect(angular.module(moduleName).requires).toEqual([importedModuleName]);
    });
  });

  describe('declarations', () => {
    describe('@Component', () => {
      it('registers as component or directive', () => {
        registerNgModule(moduleName, [], [
          component('camelCaseName'), // registers as component
          component('camel-case-name'), // registers as component
          component('[camelCaseName]'), // registers as directive
          component('[camel-case-name]'), // registers as directive
        ]);
        const invokeQueue = angular.module(moduleName)['_invokeQueue'];
        expect(invokeQueue.length).toEqual(4);
        invokeQueue.forEach((value: any, index: number) => {
          expect(value[0]).toEqual('$compileProvider');
          if (index < 2) expect(value[1]).toEqual('component');
          else expect(value[1]).toEqual('directive');
          expect(value[2][0]).toEqual('camelCaseName');
        });
      });

      describe('@Input and @Output', () => {
        it('assigns properties to @Component options bindings' , () => {
          registerNgModule(moduleName, [], [
            component('camelCaseName')
          ]);
          const invokeQueue = angular.module(moduleName)['_invokeQueue'];
          const bindings = invokeQueue[0][2][1].bindings;
          expect(bindings).toBeDefined();
          expect(bindings).toEqual({
            testInput: '<',
            testOutput: '&'
          });
        });
      });

      describe('@HostListener', () => {
        it('injects $element and adds $postLink and $onDestroy lifecycle hooks' , () => {
          registerNgModule(moduleName, [], [
            component('camelCaseName')
          ]);
          const invokeQueue = angular.module(moduleName)['_invokeQueue'];
          const ctrlProto = invokeQueue[0][2][1].controller.prototype;
          const inject = ctrlProto['constructor']['$inject'];

          inject.forEach(dependency => expect(typeof dependency).toBe('string'));
          expect(inject[0]).toEqual('$element');
          expect(ctrlProto['$postLink']).toBeDefined();
          expect(ctrlProto['$onDestroy']).toBeDefined();
        });
      });

      describe('lifecycle hooks', () => {
        it('replaces angular lifecycle hooks to angularjs lifecycle hooks' , () => {
          registerNgModule(moduleName, [], [
            component('camelCaseName')
          ]);
          const invokeQueue = angular.module(moduleName)['_invokeQueue'];
          const ctrlProto = invokeQueue[0][2][1].controller.prototype;
          expect(ctrlProto['$onInit']).toBeDefined();
          expect(ctrlProto['$postLink']).toBeDefined();
          expect(ctrlProto['$onChanges']).toBeDefined();
          expect(ctrlProto['$doCheck']).toBeDefined();
          expect(ctrlProto['$onDestroy']).toBeDefined();
        });
      });
    });

    describe('@Directive', () => {
      it('registers as directive', () => {
        registerNgModule(moduleName, [], [
          directive('camelCaseName'),
          directive('camel-case-name'),
          directive('[camelCaseName]'),
          directive('[camel-case-name]'),
        ]);
        const invokeQueue = angular.module(moduleName)['_invokeQueue'];
        expect(invokeQueue.length).toEqual(4);
        invokeQueue.forEach((value: any) => {
          expect(value[0]).toEqual('$compileProvider');
          expect(value[1]).toEqual('directive');
          expect(value[2][0]).toEqual('camelCaseName');
        });
      });

      describe('@Input and @Output', () => {
        it('assigns properties to @Directive bindToController bindings' , () => {
          const myDirective = directive('camelCaseName');
          registerNgModule(moduleName, [], [
            myDirective
          ]);
          const invokeQueue = angular.module(moduleName)['_invokeQueue'];
          const directiveObject = invokeQueue[0][2][1]();
          expect(directiveObject).toBeDefined();
          expect(directiveObject).toEqual({
            bindToController: {
              testInput: '<',
              testOutput: '&',
            },
            restrict: 'A',
            scope: true,
            controller: myDirective
          });
        });
      });
    });
  });

  describe('providers', () => {
    describe('provided as array of classes', () => {
      it('registers provider using class type', () => {
        const providers = [TestService];
        registerNgModule(moduleName, [], [], providers);

        expect(angular.module(moduleName)['_invokeQueue'].length).toEqual(providers.length);
        angular.module(moduleName)['_invokeQueue'].forEach((value: any, index: number) => {
          // expect(value[2][0]).toEqual(serviceName);
          expect(value[2][1]).toEqual(TestService);
        });
      });
    });

    describe('provided using useClass syntax', () => {
      it('registers provider using provide token', () => {
        const providers = [{provide: 'useClassTestService', useClass: TestService}];
        registerNgModule(moduleName, [], [], providers);

        // const $injector = angular.injector([moduleName]);
        const invokeQueue = angular.module(moduleName)['_invokeQueue'];
        expect(invokeQueue.length).toEqual(providers.length);
        invokeQueue.forEach((value: any, index: number) => {
          expect(value[0]).toEqual('$provide');
          expect(value[1]).toEqual('service');
          expect(value[2][0]).toEqual(providers[index].provide);
          expect(value[2][1]).toEqual(providers[index].useClass);
          expect(TestService).toEqual(providers[index].useClass);
        });
        // expect($injector.get(anotherServiceName)).toEqual($injector.get(serviceName));
      });
    });

    describe('useFactory', () => {

      it('registers provider using string token', () => {
        const providers = [{provide: 'useFactoryTestService', useFactory: (...args) => new TestService(args)}];
        registerNgModule(moduleName, [], [], providers);

        const invokeQueue = angular.module(moduleName)['_invokeQueue'];
        expect(invokeQueue.length).toEqual(providers.length);
        invokeQueue.forEach((value: any, index: number) => {
          expect(value[0]).toEqual('$provide');
          expect(value[1]).toEqual('factory');
          expect(value[2][0]).toEqual(providers[index].provide);
          expect(value[2][1]).toBe(providers[index].useFactory);
        });
      });
    });

    describe('useValue', () => {

      it('registers provider using string token', () => {
        const providers = [{provide: 'useValueTestService', useValue: (...args) => new TestService(args)}];
        registerNgModule(moduleName, [], [], providers);

        const invokeQueue = angular.module(moduleName)['_invokeQueue'];
        expect(invokeQueue.length).toEqual(providers.length);
        invokeQueue.forEach((value: any, index: number) => {
          expect(value[0]).toEqual('$provide');
          expect(value[1]).toEqual('constant');
          expect(value[2][0]).toEqual(providers[index].provide);
          expect(value[2][1]).toEqual(providers[index].useValue);
        });
      });
    });
  });
});

