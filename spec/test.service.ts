import { Injectable } from '../angular-ts-decorators';


export const createServiceClass = (token: string = '') => {

  @Injectable(token)
  class TestService {

    constructor() {

    }

    public static someStaticMethod(): TestService {
      return new TestService();
    }

    public someMethod(): void {

    }
  }

  return TestService;
};