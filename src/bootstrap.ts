import { bootstrap, element } from 'angular';
import { NgModule } from './module';
import { Type } from './type';

export interface CompilerOptions {
  strictDi?: boolean;
}

export const platformBrowserDynamic = () => PlatformRef;

export class PlatformRef {
  static bootstrapModule(moduleType: Type<any>|string, compilerOptions?: CompilerOptions) {
    const moduleName = typeof moduleType === 'string' ? moduleType : (moduleType as NgModule).module.name;
    const strictDi = (compilerOptions.strictDi === true);
    element(document).ready(() => {
      bootstrap(document.body, [moduleName], { strictDi });
    });
  }
}
