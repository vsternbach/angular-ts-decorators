import { bootstrap, element, IModule } from 'angular';
import { NgModule } from './module';

export interface CompilerOptions {
  strictDi?: boolean;
}

export const platformBrowserDynamic = () => PlatformRef;

export class PlatformRef {
  static bootstrapModule(moduleType: NgModule|IModule|string, compilerOptions: CompilerOptions = { strictDi: false }) {
    let moduleName;
    switch (typeof moduleType) {
      case 'string': // module name string
        moduleName = moduleType;
        break;
      case 'object': // angular.module object
        moduleName = (moduleType as IModule).name;
        break;
      case 'function': // NgModule class
      default:
        const module = (moduleType as NgModule).module;
        if (!module) {
          throw Error('Argument moduleType should be NgModule class, angular.module object or module name string');
        }
        moduleName = module.name;
    }
    const strictDi = (compilerOptions.strictDi === true);
    element(document).ready(() => {
      bootstrap(document.body, [moduleName], { strictDi });
    });
  }
}
