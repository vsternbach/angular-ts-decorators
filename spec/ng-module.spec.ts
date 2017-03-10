import { NgModule, Injectable, Component, NgModuleDecoratedInstance } from '../angular-ts-decorators';
import { createModuleClass } from './test.module';
import { createServiceClass } from './test.service';
import * as angular from 'angular';


describe("NgModule", () => {
  var testModule: NgModuleDecoratedInstance;
  var serviceName: string;
  var service: any;
  var $injector: ng.auto.IInjectorService;

  beforeEach(() => {
    serviceName = "TestService";
    service = createServiceClass();
  });

  describe("imports", () => {

  });

  describe("declarations", () => {

  });

  describe("providers", () => {
    var providers: any[];

    it("registers provider using class", () => {
      providers = [service];
      var constructor = createModuleClass('', [], [], providers);
      testModule = new constructor();
      $injector = angular.injector(['ng', constructor.name]);

      expect(angular.module(constructor.name)['_invokeQueue'].length).toEqual(providers.length);
      angular.module(constructor.name)['_invokeQueue'].forEach((value: any, index: number) => {
        expect(value[2][0]).toEqual(providers[index].name);
        expect($injector.get(providers[index].name) instanceof providers[index]);
      });
    });

    it("registers provider using string token and 'useClass' property", () => {
      providers = [{provide: serviceName, useClass: service}];
      var constructor = createModuleClass('', [], [], providers);
      testModule = new constructor();

      expect(angular.module(constructor.name)['_invokeQueue'].length).toEqual(providers.length);
      angular.module(constructor.name)['_invokeQueue'].forEach((value: any, index: number) => {
        expect(value[2][0]).toEqual(providers[index].provide);
        expect($injector.get(providers[index].provide) instanceof providers[index].useClass);
      });
    });

    it("registers provider using class type and 'usesClass' property", () => {
      providers = [{provide: service, useClass: service}];
      var constructor = createModuleClass('', [], [], providers);
      testModule = new constructor();

      expect(angular.module(constructor.name)['_invokeQueue'].length).toEqual(providers.length);
      angular.module(constructor.name)['_invokeQueue'].forEach((value: any, index: number) => {
        expect(value[2][0]).toEqual(providers[index].provide.name);
        expect($injector.get(providers[index].provide.name) instanceof providers[index].useClass);
      });
    });

    it("registers provider using 'useFactory' property", () => {

    });

    it("registers provider using 'useValue' property", () => {

    });

    it("sanity", () => {
      var constructor = createModuleClass('', [], [], providers);
      testModule = new constructor();

      expect(testModule).toBeDefined();
    });
  });
});
