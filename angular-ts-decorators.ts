import * as angular from 'angular';
import 'reflect-metadata';

/**
 * When targeting es5, name doesn't exist on Function interface
 * https://github.com/Microsoft/TypeScript/issues/2076
 */
declare global {
  interface Function {
    readonly name: string;
  }
}
enum Declarations { component, directive, pipe }

const typeSymbol = 'custom:type';
const nameSymbol = 'custom:name';
const bindingsSymbol = 'custom:bindings';
const optionsSymbol = 'custom:options';

/**
 * Interfaces
 */
export interface ModuleConfig {
  name?: string;
  declarations: Array<ng.IComponentController | ng.Injectable<ng.IDirectiveFactory> | PipeTransform>;
  imports?: Array<string | Function>;
  exports?: Array<Function>;
  providers?: Array<ng.IServiceProvider | ng.Injectable<Function> | ProviderObject>;
  constants?: Object;
  decorators?: {[name: string]: ng.Injectable<Function>};
}

export interface NgModuleDecorated {
  new(...args: Array<any>): NgModuleDecoratedInstance;
  module?: ng.IModule;
}

export interface NgModuleDecoratedInstance {
  config?(...args: Array<any>): void;
  run?(...args: Array<any>): void;
}

export interface ComponentOptionsDecorated {
  selector: string;
  template?: string | ng.Injectable<(...args: Array<any>) => string>;
  templateUrl?: string | ng.Injectable<(...args: Array<any>) => string>;
  transclude?: boolean | {[slot: string]: string};
  require?: {[controller: string]: string};
}

export interface DirectiveOptionsDecorated {
  selector: string;
  multiElement?: boolean;
  priority?: number;
  require?: string | string[] | {[controller: string]: string};
  scope?: boolean | {[boundProperty: string]: string};
  template?: string | ((tElement: JQuery, tAttrs: ng.IAttributes) => string);
  templateNamespace?: string;
  templateUrl?: string | ((tElement: JQuery, tAttrs: ng.IAttributes) => string);
  terminal?: boolean;
  transclude?: boolean | 'element' | {[slot: string]: string};
}

export interface DirectiveControllerConstructor {
  new(...args: Array<any>): DirectiveController;
}

export interface DirectiveController {
  compile?: ng.IDirectiveCompileFn;
  link?: ng.IDirectiveLinkFn | ng.IDirectivePrePost;
}

export interface PipeTransformConstructor {
  new(...args: Array<any>): PipeTransform;
}

export interface PipeTransform {
  transform(...args: Array<any>): any;
}

export interface ClassProvider {
  provide: any;
  useClass: ng.Injectable<Function>;
}

export interface FactoryProvider {
  provide: any;
  useFactory: any;
}

export interface ValueProvider {
  provide: any;
  useValue: any;
}

export type ProviderObject = ClassProvider | FactoryProvider | ValueProvider;

/**
 * Decorators
 */
export function NgModule({ name, declarations, imports, providers }: ModuleConfig) {
  return (Class: NgModuleDecorated) => {
    // module registration
    const deps = imports ? imports.map(mod => typeof mod === 'string' ? mod : mod.name) : [];
    if (!name) {
      console.warn('You are not providing explicit ngModule name, be careful this code might not work when uglified.');
      name = Class.name;
    }
    const module = angular.module(name, deps);

    // components, directives and filters registration
    declarations.forEach((declaration: any) => {
      const declarationType = getDeclarationType(declaration);
      switch (declarationType) {
        case Declarations.component:
          registerComponent(module, declaration);
          break;
        case Declarations.directive:
          registerDirective(module, declaration);
          break;
        case Declarations.pipe:
          registerPipe(module, declaration);
          break;
        default:
          console.error(
            `Can't find type metadata on ${declaration.name} declaration, did you forget to decorate it?
            Decorate your declarations using @Component, @Directive or @Pipe decorator.`
          );
      }
    });

    // services registration
    if (providers) {
      registerServices(module, providers);
    }
    // config and run blocks registration
    const { config, run } = Class.prototype;
    if (config) {
      config.$inject = annotate(config);
      module.config(config);
    }
    if (run) {
      run.$inject = annotate(run);
      module.run(run);
    }
    // expose angular module as static property
    Class.module = module;
  };
}

export function Component(decoratedOptions: ComponentOptionsDecorated) {
  return (ctrl: ng.IControllerConstructor) => {
    const options: ng.IComponentOptions = {...decoratedOptions};
    options.controller = ctrl;
    const bindings = Reflect.getMetadata(bindingsSymbol, ctrl);
    if (bindings) {
      options.bindings = bindings;
    }
    Reflect.defineMetadata(nameSymbol, decoratedOptions.selector, ctrl);
    Reflect.defineMetadata(typeSymbol, Declarations.component, ctrl);
    Reflect.defineMetadata(optionsSymbol, options, ctrl);
  };
}

export function Directive(decoratedOptions: DirectiveOptionsDecorated) {
  return (ctrl: DirectiveControllerConstructor) => {
    const options: ng.IDirective = {...decoratedOptions};
    // deprecate restrict for directives and force attribute usage only
    options.restrict = 'A';
    const bindings = Reflect.getMetadata(bindingsSymbol, ctrl);
    if (bindings) {
      options.scope = bindings;
      console.warn(`Using scope with directives is deprecated, you should consider writing it as a component.
      See: https://github.com/toddmotto/angular-styleguide#recommended-properties`);
    }
    Reflect.defineMetadata(nameSymbol, decoratedOptions.selector, ctrl);
    Reflect.defineMetadata(typeSymbol, Declarations.directive, ctrl);
    Reflect.defineMetadata(optionsSymbol, options, ctrl);
  };
}

export function Input(alias?: string) {
  return (target: Object, key: string) => addBindingToMetadata(target, key, '<', alias);
}

export function Output(alias?: string) {
  return (target: Object, key: string) => addBindingToMetadata(target, key, '&', alias);
}

export function Injectable(name?: string) {
  return (Class: any) => {
    if (!name) {
      console.warn('You are not providing explicit service name, be careful this code might not work when uglified.');
      name = Class.name;
    }
    Reflect.defineMetadata(nameSymbol, name, Class);
  };
}

export function Pipe(options: {name: string}) {
  return (Class: PipeTransformConstructor) => {
    Reflect.defineMetadata(nameSymbol, options.name, Class);
    Reflect.defineMetadata(typeSymbol, Declarations.pipe, Class);
  };
}

/**
 * Private functions
 */
function registerComponent(module: ng.IModule, component: ng.IComponentController) {
  const {name, options} = getComponentMetadata(component);
  module.component(name, options);
}

function registerDirective(module: ng.IModule, ctrl: DirectiveControllerConstructor) {
  const {name, options} = getComponentMetadata(ctrl);
  const {compile, link} = ctrl.prototype;
  const isValid = compile && typeof compile === 'function' || link && typeof link === 'function';
  if (isValid) {
    const directiveFunc =  (...args: Array<any>) => {
      const instance = new ctrl(args);
      if (compile) {
        options.compile = compile.bind(instance);
      }
      else if (link) {
        options.link = link.bind(instance);
      }
      return options;
    };
    directiveFunc.$inject = directiveFunc.$inject || annotate(ctrl);
    module.directive(name, directiveFunc);
  }
  else {
    console.error(`Directive ${ctrl.name} was not registered because no link or compile methods were provided`);
  }
}

function registerPipe(module: ng.IModule, filter: PipeTransformConstructor) {
  const {name} = getNameMetadata(filter);
  const filterFunc = (...args: Array<any>) => {
    const instance = new filter(args);
    return instance.transform.bind(instance);
  };
  filterFunc.$inject = filter.$inject || annotate(filter);
  module.filter(name, filterFunc);
}

function registerServices(module: ng.IModule, providers: Array<ng.IServiceProvider | ng.Injectable<Function> | ProviderObject>) {
  providers.forEach((provider: any) => {
    if (provider.provide !== undefined) {
      const {name} = typeof provider.provide == "string" ? {name: provider.provide} : getNameMetadata(provider.provide);
      if (provider.useClass !== undefined && provider.useClass instanceof Function) {
        provider.useClass.$inject = provider.useClass.$inject || annotate(provider.useClass);
        if (provider.useClass.prototype.$get) {
          module.provider(name, provider.useClass);
        }
        else {
          module.service(name, provider.useClass);
        }
      }
    }
    else {
      const {name} = getNameMetadata(provider);
      provider.$inject = provider.$inject || annotate(provider);
      if (provider.prototype.$get) {
        module.provider(name, provider);
      }
      else {
        module.service(name, provider);
      }
    }
  });
}


function getComponentMetadata(component: ng.IComponentController) {
  return {
    name: Reflect.getMetadata(nameSymbol, component),
    options: Reflect.getMetadata(optionsSymbol, component)
  };
}

function getNameMetadata(service: any) {
  return {
    name: Reflect.getMetadata(nameSymbol, service)
  };
}

function getDeclarationType(declaration: any) {
  return Reflect.getMetadata(typeSymbol, declaration);
}

function addBindingToMetadata(target: Object, key: string, direction: string, alias?: string) {
  const targetConstructor = target.constructor;
  const bindings = Reflect.getMetadata(bindingsSymbol, targetConstructor) || {};
  bindings[key] = alias || direction;
  Reflect.defineMetadata(bindingsSymbol, bindings, targetConstructor);
}

function annotate(func: any) {
  return angular.injector().annotate(func);
}
