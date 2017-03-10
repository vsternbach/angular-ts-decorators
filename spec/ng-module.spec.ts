import { NgModule, Injectable, Component, NgModuleDecoratedInstance } from '../angular-ts-decorators';
import { createModuleClass } from './test.module';
import { createServiceClass } from './test.service';
import * as angular from 'angular';


describe("NgModule", () => {
  var testModule: NgModuleDecoratedInstance;
  var serviceName: string;
  var Service: any;
  var $injector: ng.auto.IInjectorService;

  beforeEach(() => {
    serviceName = "TestService";
    Service = createServiceClass();
  });

  describe("imports", () => {
    // TODO
  });

  describe("declarations", () => {
    // TODO
  });

  describe("providers", () => {
    var providers: any[];

    describe("array of classes", () => {

      it("registers provider using class type", () => {
        providers = [Service];
        var constructor = createModuleClass('', [], [], providers);
        testModule = new constructor();
        $injector = angular.injector(['ng', constructor.name]);

        expect(angular.module(constructor.name)['_invokeQueue'].length).toEqual(providers.length);
        angular.module(constructor.name)['_invokeQueue'].forEach((value: any, index: number) => {
          expect(value[2][0]).toEqual(providers[index].name);
          expect($injector.get(providers[index].name).constructor).toBe(providers[index]);
        });
      });
    });

    describe("useClass", () => {

      it("registers provider using string token", () => {
        providers = [{provide: serviceName, useClass: Service}];
        var constructor = createModuleClass('', [], [], providers);
        testModule = new constructor();

        expect(angular.module(constructor.name)['_invokeQueue'].length).toEqual(providers.length);
        angular.module(constructor.name)['_invokeQueue'].forEach((value: any, index: number) => {
          expect(value[2][0]).toEqual(providers[index].provide);
          expect($injector.get(providers[index].provide).constructor.name).toBe(providers[index].useClass.name);
        });
      });

      it("registers provider using class type", () => {
        providers = [{provide: Service, useClass: Service}];
        var constructor = createModuleClass('', [], [], providers);
        testModule = new constructor();

        expect(angular.module(constructor.name)['_invokeQueue'].length).toEqual(providers.length);
        angular.module(constructor.name)['_invokeQueue'].forEach((value: any, index: number) => {
          expect(value[2][0]).toEqual(providers[index].provide.name);
          expect($injector.get(providers[index].provide.name).constructor.name).toBe(providers[index].useClass.name);
        });
      });
    });

    describe("useFactory", () => {

      it("registers provider using string token", () => {
        providers = [{provide: serviceName, useFactory: () => new Service()}];
        var constructor = createModuleClass('', [], [], providers);
        testModule = new constructor();

        expect(angular.module(constructor.name)['_invokeQueue'].length).toEqual(providers.length);
        angular.module(constructor.name)['_invokeQueue'].forEach((value: any, index: number) => {
          expect(value[2][0]).toEqual(providers[index].provide);
          expect($injector.get(providers[index].provide).constructor.name).toBe(providers[index].useFactory().constructor.name);
        });
      });

      it("registers provider using class type", () => {
        providers = [{provide: Service, useFactory: () => new Service()}];
        var constructor = createModuleClass('', [], [], providers);
        testModule = new constructor();

        expect(angular.module(constructor.name)['_invokeQueue'].length).toEqual(providers.length);
        angular.module(constructor.name)['_invokeQueue'].forEach((value: any, index: number) => {
          expect(value[2][0]).toEqual(providers[index].provide.name);
          expect($injector.get(providers[index].provide.name).constructor.name).toBe(providers[index].useFactory().constructor.name);
        });
      });
    });

    describe("useValue", () => {

      it("registers provider using string token", () => {
        providers = [{provide: serviceName, useValue: new Service()}];
        var constructor = createModuleClass('', [], [], providers);
        testModule = new constructor();

        expect(angular.module(constructor.name)['_invokeQueue'].length).toEqual(providers.length);
        angular.module(constructor.name)['_invokeQueue'].forEach((value: any, index: number) => {
          expect(value[2][0]).toEqual(providers[index].provide);
          expect($injector.get(providers[index].provide).constructor.name).toEqual(providers[index].useValue.constructor.name);
        });
      });

      it("registers provider using class type", () => {
        providers = [{provide: Service, useValue: new Service()}];
        var constructor = createModuleClass('', [], [], providers);
        testModule = new constructor();

        expect(angular.module(constructor.name)['_invokeQueue'].length).toEqual(providers.length);
        angular.module(constructor.name)['_invokeQueue'].forEach((value: any, index: number) => {
          expect(value[2][0]).toEqual(providers[index].provide.name);
          expect($injector.get(providers[index].provide.name).constructor.name).toEqual(providers[index].useValue.constructor.name);
        });
      });
    });
  });
});
