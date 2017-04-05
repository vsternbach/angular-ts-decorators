import * as angular from 'angular';
import { NgModule } from '../src/angular-ts-decorators';
import { registerNgModule, TestService } from './mocks';


describe('NgModule', () => {
  const moduleName = 'TestModule';

  describe('has run and config methods', () => {
    it('module should have run and config blocks', () => {
      const NgModuleClass = registerNgModule(moduleName, [], [], []);
      const ngModuleInstance = new NgModuleClass();
      expect(angular.module(moduleName)['_runBlocks'].length).toBe(1);
      expect(angular.module(moduleName)['_configBlocks'].length).toBe(1);
      expect(angular.module(moduleName)['_configBlocks'][0].length).toBe(3);

      expect(angular.module(moduleName)['_runBlocks'][0].$inject).toEqual(['$rootScope']);
      expect(angular.module(moduleName)['_configBlocks'][0][2][0].$inject).toEqual(['$httpProvider'] );

      expect(angular.module(moduleName)['_runBlocks'][0]).toBe(ngModuleInstance.run);
      expect(angular.module(moduleName)['_configBlocks'][0][2][0]).toBe(ngModuleInstance.config);
    })
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
    // TODO
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
