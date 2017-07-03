import { bootstrap, element } from 'angular';
import { NgModule } from './module';
import { Type } from './type';

export interface CompilerOptions {
  strictDi?: boolean;
}

export const platformBrowserDynamic = () => PlatformRef;

export const PlatformRef = {

  bootstrapModule: (moduleType: Type<any>, compilerOptions?: CompilerOptions) => {
    let strictDi = true;
    if (compilerOptions) strictDi = compilerOptions.strictDi;

    element(document).ready(() => {
      bootstrap(document, [(moduleType as NgModule).module.name], { strictDi });
    });
  }
};
