import { NgModule, Injectable, Component } from '../angular-ts-decorators';
import { TestModule } from './test.module';


describe("NgModule", () => {
  var testModule: any;

  beforeEach(() => {
    testModule = new TestModule();
  });

  describe("imports", () => {

  });

  describe("declarations", () => {

  });

  describe("providers", () => {

    it("sanity", () => {
      expect(testModule).toBeDefined();
    });
  });
});


