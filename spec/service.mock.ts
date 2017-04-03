import { Injectable } from '../angular-ts-decorators';

export const serviceName = 'TestService';

@Injectable(serviceName)
export class TestService {
  private someProp = 'This is private property';

  constructor(private $http: any) {}

  public static someStaticMethod() {
    return 'This is static method';
  }

  public someMethod(): string {
    return this.someProp;
  }
}

// export function createServiceClass(name = '') {
//   @Injectable(name)
//   class TestService {
//     private someProp = 'This is private property';
//
//     constructor(private $http: ng.IHttpService) {}
//
//     public static someStaticMethod() {
//       return 'This is static method';
//     }
//
//     public someMethod(): string {
//       return this.someProp;
//     }
//   }
//   return TestService;
// };
