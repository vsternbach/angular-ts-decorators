import { Directive, NgModule } from '../src/angular-ts-decorators';
import { Injectable } from '../src/angular-ts-decorators';

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

@Directive({
  selector: "myDirective",
  scope: true
})
export class MyDirective {

  // static $inject = ["$log", "$parse"];
  constructor(private $log: ng.ILogService,
              private $parse: ng.IParseService) { }
  $onInit() {
    console.log(this.$log, this.$parse);
  }
}

export function myDirective($log, $parse): ng.IDirective {
  return {
    restrict: 'A',
    scope: {},
    link: () => {
      console.log($log, $parse);
    }
  }
}

export const registerNgModule = (name: string = '',
                                 imports: any[] = [],
                                 declarations: any[] = [],
                                 providers: any[] = []): any => {

  @NgModule({
    name: name,
    imports: imports,
    declarations: declarations,
    providers: providers,
  })
  class TestModule {

    public config($httpProvider: ng.IHttpProvider) {}

    public run($rootScope: ng.IRootScopeService) {}
  }

  return TestModule;
};