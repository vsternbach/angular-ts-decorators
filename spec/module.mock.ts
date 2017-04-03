import { NgModule } from '../angular-ts-decorators';

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