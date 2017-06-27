import { bootstrap, element } from 'angular';
import { NgModule } from './module';
import { Type } from './type';

export interface CompilerOptions {
  strictDi?: boolean;
}

export const platformBrowserDynamic = () => PlatformRef;

export const PlatformRef = {
  /**
   * Creates an instance of an `@NgModule` for a given platform using the given runtime compiler.
   *
   * ## Simple Example
   *
   * ```typescript
   * @NgModule({
   *   imports: [BrowserModule]
   * })
   * class MyModule {}
   *
   * let moduleRef = platformBrowser().bootstrapModule(MyModule);
   * ```
   */
  bootstrapModule: (moduleType: Type<any>, compilerOptions?: CompilerOptions) => {
    let strictDi = true;
    if (compilerOptions) strictDi = compilerOptions.strictDi;

    element(document).ready(() => {
      bootstrap(document, [(moduleType as NgModule).module.name], { strictDi });
    });
  }
};
