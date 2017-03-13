import { NgModule } from '../angular-ts-decorators';


export const createModuleClass = (name: string = '',
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

    public config(): void {

    }

    public run(): void {

    }
  }

  return TestModule;
};